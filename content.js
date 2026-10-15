(() => {
  "use strict";

  // `chrome` supports callbacks in both Chrome and Firefox
  const api = globalThis.chrome ?? globalThis.browser;

  // ───────────── Selectors

  const CARD_SELECTORS = [
    // Pornhub / YouPorn / RedTube
    "li.pcVideoListItem", "li.videoblock", "li.videoblock_list", ".videoBox", ".video-box", ".video_block_wrapper",
    // XVideos / XNXX
    ".thumb-block",
    // xHamster
    ".video-thumb", ".thumb-list__item",
    // SpankBang
    ".video-item",
    // EPorner
    "div.mb[data-id]", "div.mb",
    // Motherless, PornPics, Erome
    ".thumb-container", "li.thumbwook", "div.album",
    // Reddit (new and old)
    "shreddit-post", "div.thing.link"
  ].join(",");

  // Sites above with hand-written selectors. Everywhere else (and here, when the selectors find nothing)
  // thumbnails are detected automatically.
  const HOST = location.hostname;
  const PRIMARY = /(^|\.)(pornhub\.com|xvideos\.com|xnxx\.com|xhamster\.(com|desi)|redtube\.com|youporn\.com|spankbang\.com|eporner\.com)$/.test(HOST);
  const IS_REDDIT = /(^|\.)reddit\.com$/.test(HOST);

  const TITLE_SELECTORS = [
    ".title", "[class*='title']", "[class*='name']", "a[title]", "img[alt]", "h2", "h3", "h4", "p > a"
  ].join(",");

  // Tags, categories, channels/studios and performers visible on a thumbnail card
  const TAG_SELECTORS = [
    "a[href*='/tag/']", "a[href*='/tags/']", "a[href*='/tag-']", "a[href*='/category/']",
    "a[href*='/categories/']", "a[href*='/channels/']", "a[href*='/channel/']", "a[href*='/profiles/']",
    "a[href*='/pornstar/']", "a[href*='/pornstars/']", "a[href*='/model/']", "a[href*='/models/']",
    "a[href*='/studio/']", "a[href*='/studios/']", "a[href*='/pornstar-']",
    "[class*='tag']", "[class*='pornstar']", "[class*='model']", "[class*='channel']",
    "[data-tags]", "[data-tag]"
  ].join(",");

  // Same idea for a video's own page, plus keyword-style markup
  const PAGE_TAG_SELECTORS = [
    TAG_SELECTORS, ".video-tags-list a", ".is-keyword", ".is-pornstar", "[class*='keyword']",
    "[class*='categor'] a", "h1"
  ].join(",");

  // Links on a card that are not the video itself
  const NOT_VIDEO_LINK = /\/(profiles?|tags?|channels?|pornstars?|models?|categories|category|studios?|users?)\b|^#|^javascript:/i;

  // ───────────── State

  let settings = kwfResolve(null);
  let matcher = null;
  let scheduled = false;

  const TTL_MS = 30 * 24 * 3600 * 1000;
  const MAX_CACHE = 4000;
  const MAX_CONCURRENT = 2;
  const GAP_MS = 400;
  const THROTTLE_PAUSE_MS = 60 * 1000;

  const tagCache = new Map(); // url -> { ts, text }
  const waiting = new Map();  // url -> Set(cards) waiting for tags
  const queued = new Set();
  const queue = [];
  const linkOf = new WeakMap();
  const observed = new WeakSet();
  let active = 0;
  let pausedUntil = 0;
  let pumpTimer = null;
  let saveTimer = null;
  let io = null;
  const stats = { fetched: 0, failed: 0, throttled: 0 };

  function rebuild() {
    matcher = kwfBuildMatcher(kwfActiveTerms(settings), settings.wholeWord);
  }

  // ───────────── Text on the card itself

  const fullText = new WeakSet(); // auto-detected cards and Reddit posts: read all of their text

  function collectText(card) {
    const chunks = [];

    if (fullText.has(card)) {
      chunks.push((card.textContent || "").slice(0, 800));
      for (const a of ["post-title", "subreddit-name", "subreddit-prefixed-name", "data-subreddit", "aria-label", "title"]) {
        chunks.push(card.getAttribute(a) || "");
      }
      card.querySelectorAll("img[alt], a[title]").forEach((el) => chunks.push(el.getAttribute("alt") || "", el.getAttribute("title") || ""));
      return kwfFold(chunks.join(" \n "));
    }

    if (settings.matchTitle) {
      card.querySelectorAll(TITLE_SELECTORS).forEach((el) => {
        chunks.push(el.getAttribute("title") || "", el.getAttribute("alt") || "");
        if (el.children.length === 0) chunks.push(el.textContent || "");
      });
      chunks.push(card.getAttribute("title") || "");
    }

    if (settings.matchTags) {
      card.querySelectorAll(TAG_SELECTORS).forEach((el) => {
        chunks.push(el.textContent || "");
        chunks.push(el.getAttribute("data-tags") || "", el.getAttribute("data-tag") || "");
      });
      chunks.push(card.getAttribute("data-tags") || "", card.getAttribute("data-tag") || "");
    }

    return kwfFold(chunks.join(" \n "));
  }

  // ───────────── Tag lookup on the video's page

  function videoUrl(card) {
    if (linkOf.has(card)) return linkOf.get(card);
    let found = null;
    const candidates = card.querySelectorAll(".title a[href], a.title[href], [class*='title'] a[href], a[href]");
    for (const a of candidates) {
      const raw = a.getAttribute("href") || "";
      if (!raw || NOT_VIDEO_LINK.test(raw)) continue;
      try {
        const u = new URL(raw, location.href);
        if (u.origin !== location.origin || u.pathname === "/" || u.pathname === location.pathname && !u.search) continue;
        u.hash = "";
        found = u.href;
        break;
      } catch {
        /* ignore malformed links */
      }
    }
    linkOf.set(card, found);
    return found;
  }

  function cachedTags(url) {
    const entry = tagCache.get(url);
    return entry && Date.now() - entry.ts < TTL_MS ? entry.text : null;
  }

  function storeTags(url, text, failed) {
    // A failed lookup is remembered for ten minutes only
    const ts = failed ? Date.now() - TTL_MS + 10 * 60 * 1000 : Date.now();
    tagCache.set(url, { ts, text });
    scheduleCacheSave();
  }

  function extractTags(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Drop related-video thumbnails so their tags are not mistaken for this video's
    doc.querySelectorAll(CARD_SELECTORS).forEach((n) => n.remove());
    if (!PRIMARY && !IS_REDDIT) {
      // Sites without hand-written selectors: drop thumbnail cards found automatically
      const gone = new Set();
      doc.querySelectorAll("a[href] img").forEach((img) => {
        const a = img.closest("a[href]");
        if (a && !a.closest("header, nav, footer")) gone.add(climb(a));
      });
      gone.forEach((n) => n.remove());
    }
    doc.querySelectorAll("#related-videos, #video-related, [id*='related'], [class*='related']").forEach((n) => n.remove());

    const parts = [];
    const metaContent = (selector) =>
      doc.querySelectorAll(selector).forEach((m) => parts.push(m.getAttribute("content") || ""));
    metaContent("meta[name='keywords']");
    metaContent("meta[property='video:tag']");
    metaContent("meta[property='article:tag']");
    metaContent("meta[name='news_keywords']");

    doc.querySelectorAll("script[type='application/ld+json']").forEach((sc) => {
      try {
        const walk = (o) => {
          if (Array.isArray(o)) return o.forEach(walk);
          if (o && typeof o === "object") {
            if (o.keywords) parts.push(Array.isArray(o.keywords) ? o.keywords.join(", ") : String(o.keywords));
            Object.values(o).forEach(walk);
          }
        };
        walk(JSON.parse(sc.textContent));
      } catch {
        /* ignore broken JSON-LD */
      }
    });

    doc.querySelectorAll(PAGE_TAG_SELECTORS).forEach((el) => {
      parts.push(el.textContent || "");
      parts.push(el.getAttribute("data-tags") || "", el.getAttribute("data-tag") || "");
    });

    return kwfFold(parts.join(" \n "));
  }

  async function fetchTags(url) {
    try {
      const res = await fetch(url, { credentials: "same-origin", headers: { Accept: "text/html" } });
      if (res.status === 429 || res.status === 403 || res.status === 503) {
        // The site is pushing back: pause all lookups and try this one again later
        stats.throttled++;
        pausedUntil = Date.now() + THROTTLE_PAUSE_MS;
        queued.delete(url);
        enqueue(url);
        return;
      }
      if (!res.ok) {
        stats.failed++;
        storeTags(url, "", true);
      } else {
        stats.fetched++;
        storeTags(url, extractTags(await res.text()), false);
      }
    } catch {
      stats.failed++;
      storeTags(url, "", true);
    }
    queued.delete(url);
    const cards = waiting.get(url);
    waiting.delete(url);
    if (cards) cards.forEach((card) => applyCard(card));
  }

  function enqueue(url) {
    if (queued.has(url) || cachedTags(url) !== null) return;
    queued.add(url);
    queue.push(url);
    pump();
  }

  function pump() {
    clearTimeout(pumpTimer);
    const now = Date.now();
    if (now < pausedUntil) {
      pumpTimer = setTimeout(pump, pausedUntil - now + 50);
      return;
    }
    while (active < MAX_CONCURRENT && queue.length) {
      const url = queue.shift();
      active++;
      fetchTags(url).finally(() => {
        active--;
        setTimeout(pump, GAP_MS);
      });
    }
  }

  function watchCard(card, url) {
    let set = waiting.get(url);
    if (!set) waiting.set(url, (set = new Set()));
    set.add(card);

    if (typeof IntersectionObserver === "undefined") return enqueue(url);
    if (!io) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            io.unobserve(e.target);
            const u = linkOf.get(e.target);
            if (u) enqueue(u);
          }
        },
        { rootMargin: "800px 0px" }
      );
    }
    if (!observed.has(card)) {
      observed.add(card);
      io.observe(card);
    }
  }

  function loadCache() {
    return new Promise((resolve) => {
      try {
        api.storage.local.get("kwfTagCache", (res) => {
          const stored = (res && res.kwfTagCache) || {};
          for (const [url, v] of Object.entries(stored)) tagCache.set(url, { ts: v[0], text: v[1] });
          resolve();
        });
      } catch {
        resolve();
      }
    });
  }

  function scheduleCacheSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      // Keep the newest entries only
      let entries = [...tagCache.entries()];
      if (entries.length > MAX_CACHE) {
        entries.sort((a, b) => b[1].ts - a[1].ts);
        entries = entries.slice(0, MAX_CACHE - 1000);
        tagCache.clear();
        for (const [k, v] of entries) tagCache.set(k, v);
      }
      const out = {};
      for (const [url, v] of entries) out[url] = [v.ts, v.text];
      try {
        api.storage.local.set({ kwfTagCache: out });
      } catch {
        /* storage may be unavailable while the extension reloads */
      }
    }, 3000);
  }

  // ───────────── Applying the filter

  function setState(card, hit, pending) {
    card.classList.toggle("kwf-hide", hit && settings.mode === "hide");
    card.classList.toggle("kwf-blur", hit && settings.mode === "blur");
    card.classList.toggle("kwf-pending", !hit && pending && settings.holdUntilChecked);
    if (hit) card.setAttribute("data-kwf", "1");
    else card.removeAttribute("data-kwf");
  }

  function isNsfw(card) {
    for (const a of ["nsfw", "is-nsfw", "over-18", "over18", "data-nsfw"]) {
      if (card.hasAttribute(a) && card.getAttribute(a) !== "false") return true;
    }
    if (card.classList.contains("over18")) return true;
    if (card.querySelector("[icon-name='nsfw'], [class*='nsfw'], [data-testid*='nsfw']")) return true;
    return /(^|\s)NSFW(\s|$)/.test(card.textContent || "");
  }

  function applyCard(card) {
    if (IS_REDDIT) fullText.add(card);
    if (IS_REDDIT && settings.redditNsfwOnly && !isNsfw(card)) {
      setState(card, false, false);
      return;
    }
    if (!matcher || !matcher.size || !settings.enabled) {
      card.classList.remove("kwf-hide", "kwf-blur", "kwf-pending");
      card.removeAttribute("data-kwf");
      return;
    }

    let hit = matcher.match(collectText(card)) !== null;
    let pending = false;

    if (!hit && settings.deepTags && settings.matchTags && !IS_REDDIT) {
      const url = videoUrl(card);
      if (url) {
        const text = cachedTags(url);
        if (text !== null) hit = matcher.match(text) !== null;
        else {
          pending = true;
          watchCard(card, url);
        }
      }
    }
    setState(card, hit, pending);
  }

  // ───────────── Automatic thumbnail detection (sites without hand-written selectors)

  const cardOfAnchor = new WeakMap();
  const BOUNDARY = /^(BODY|HTML|MAIN|ASIDE|NAV|HEADER|FOOTER|FORM)$/;

  function thumbLinkCount(el, limit) {
    const seen = new Set();
    for (const img of el.querySelectorAll("a[href] img")) {
      const a = img.closest("a[href]");
      if (!a) continue;
      seen.add((a.getAttribute("href") || "").split(/[?#]/)[0]);
      if (seen.size >= limit) break;
    }
    return seen.size;
  }

  function climb(a) {
    let card = a;
    for (let steps = 0; steps < 6; steps++) {
      const p = card.parentElement;
      if (!p || BOUNDARY.test(p.tagName)) break;
      if (thumbLinkCount(p, 2) > 1) break;
      if ((p.textContent || "").length > 500 || p.querySelectorAll("a").length > 14) break;
      card = p;
    }
    return card;
  }

  function autoCardFor(img) {
    const a = img.closest("a[href]");
    if (!a || a.closest("header, nav, footer")) return null;
    const hit = cardOfAnchor.get(a);
    // A card found while it was the only one on the page may have grown into a container since
    if (hit && thumbLinkCount(hit, 2) <= 1) return hit;
    if (hit) hit.classList.remove("kwf-hide", "kwf-blur", "kwf-pending");

    let card = null;
    const href = a.getAttribute("href") || "";
    if (href && !/^(#|javascript:|mailto:)/i.test(href)) {
      try {
        const u = new URL(href, location.href);
        const w = img.getBoundingClientRect().width;
        const small = w > 0 && w < 60;
        if (!small && u.pathname.length > 1 && !(u.pathname === location.pathname && !u.search)) card = climb(a);
      } catch {
        /* ignore malformed links */
      }
    }
    cardOfAnchor.set(a, card);
    return card;
  }

  let lastCards = [];

  function currentCards() {
    const specific = [...document.querySelectorAll(CARD_SELECTORS)].filter(
      (c) => !(c.parentElement && c.parentElement.closest(CARD_SELECTORS))
    );
    if (specific.length || IS_REDDIT) return specific;
    const found = new Set();
    for (const img of document.querySelectorAll("a[href] img")) {
      const card = autoCardFor(img);
      if (card) found.add(card);
    }
    found.forEach((c) => fullText.add(c));
    return [...found];
  }

  function scan() {
    lastCards = currentCards();
    lastCards.forEach(applyCard);
  }

  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      scan();
    });
  }

  function loadSettings() {
    return new Promise((resolve) => {
      try {
        api.storage.local.get(Object.keys(KWF_DEFAULTS), (res) => {
          settings = kwfResolve(res);
          resolve();
        });
      } catch {
        resolve();
      }
    });
  }

  // For the popup's "Copy debug info" button
  function debugInfo() {
    const cards = lastCards;
    return {
      url: location.href,
      mode: IS_REDDIT ? "reddit" : document.querySelector(CARD_SELECTORS) ? "selectors" : "auto-detect",
      settings: { enabled: settings.enabled, deepTags: settings.deepTags, matchTags: settings.matchTags, mode: settings.mode },
      terms: matcher ? matcher.size : 0,
      cardsFound: cards.length,
      hidden: document.querySelectorAll("[data-kwf]").length,
      lookups: { ...stats, queued: queue.length, running: active, cached: tagCache.size, pausedForMs: Math.max(0, pausedUntil - Date.now()) },
      sampleCards: cards.slice(0, 3).map((c) => {
        const url = videoUrl(c);
        return {
          tag: c.tagName + "." + [...c.classList].join("."),
          videoLink: url,
          cachedTags: url ? (cachedTags(url) || "").slice(0, 200) : null,
          cardText: collectText(c).slice(0, 200),
          tagLinks: [...c.querySelectorAll(TAG_SELECTORS)].slice(0, 5).map((e) => e.textContent.trim().slice(0, 40)),
          html: c.outerHTML.replace(/\s+/g, " ").slice(0, 600)
        };
      })
    };
  }

  async function init() {
    await Promise.all([loadSettings(), loadCache()]);
    rebuild();
    scan();

    new MutationObserver(scheduleScan).observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    api.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;
      // The tag cache is rewritten constantly; only real settings changes need a rescan
      if (Object.keys(changes).every((k) => k === "kwfTagCache")) {
        if (!changes.kwfTagCache.newValue) tagCache.clear(); // cache cleared from the settings page
        return;
      }
      loadSettings().then(() => {
        rebuild();
        scan();
      });
    });

    api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (!msg) return;
      if (msg.type === "kwf-count") sendResponse({ count: document.querySelectorAll("[data-kwf]").length });
      if (msg.type === "kwf-debug") sendResponse(debugInfo());
    });
  }

  init();
})();
