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
    "shreddit-post", "div.thing.link",
    // Booru image boards (Rule34, Gelbooru, Danbooru, e621, Moebooru sites, Shimmie)
    "span.thumb", "article.thumbnail-preview", "article.post-preview", "article.thumbnail", ".shm-thumb",
    "ul#post-list-posts > li"
  ].join(",");

  // Sites above with hand-written selectors. Everywhere else (and here, when the selectors find nothing)
  // thumbnails are detected automatically.
  const HOST = location.hostname;
  const PRIMARY = /(^|\.)(pornhub\.com|xvideos\.com|xnxx\.com|xhamster\.(com|desi)|redtube\.com|youporn\.com|spankbang\.com|eporner\.com)$/.test(HOST);
  const IS_BOORU = /(^|\.)(rule34\.xxx|gelbooru\.com|danbooru\.donmai\.us|realbooru\.com|rule34\.paheal\.net|e621\.net|yande\.re|konachan\.(com|net)|hypnohub\.net|tbib\.org|xbooru\.com)$/.test(HOST);
  const IS_REDDIT = /(^|\.)reddit\.com$/.test(HOST);

  // 4chan: only the adult boards. The script is loaded on all of boards.4chan.org, so the board is checked here.
  const FOURCHAN_BOARDS = /^\/(s|hc|hm|h|e|u|d|y|t|hr|gif|aco)(\/|$)/;
  const IS_4CHAN = HOST === "boards.4chan.org" && FOURCHAN_BOARDS.test(location.pathname);

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
  const MAX_THROTTLE_RETRIES = 3;
  const MAX_STORED_TEXT = 2000; // per video; keeps the stored cache well inside the extension's storage quota

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
  const stats = { fetched: 0, failed: 0, throttled: 0, gaveUp: 0 };
  const retries = new Map(); // url -> how often the site pushed back on this lookup

  const SITE = HOST.replace(/^www\./, "");
  let paused = false;   // switched off for this site from the popup
  let revealed = false; // popup's "Show hidden items": outline instead of hiding
  let applied = new WeakSet(); // cards already judged under the current settings
  const dirty = new Set();     // cards whose content changed since they were judged
  let cardSet = new Set();
  const cardWhy = new WeakMap(); // card -> the term that matched
  let lastBadge = -1;

  // Booru sites list tags as "word_word" tokens, so words are matched as whole tags, not as parts of them
  let tagSet = new Set();
  let tagMulti = null;
  const tagNorm = (t) => kwfFold(t).toLowerCase().trim().replace(/[\s\-_.]+/g, "_");

  function rebuild() {
    const terms = kwfActiveTerms(settings);
    matcher = kwfBuildMatcher(terms, settings.wholeWord);
    tagSet = new Set();
    const multi = [];
    for (const raw of terms) {
      if (raw.startsWith("=") || KWF_SUBSTRING_SCRIPTS.test(raw)) continue;
      const t = tagNorm(raw);
      if (!t) continue;
      if (t.includes("_")) multi.push(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      else tagSet.add(t);
    }
    tagMulti = multi.length ? new RegExp(`(?:^|_)(?:${multi.join("|")})s?(?:_|$)`) : null;
    for (const t of kwfBooruTags(settings)) tagSet.add(tagNorm(t)); // exact tags, e.g. dark-skinned_male
  }

  // Sites on the Gelbooru 0.2 engine keep a guest's blacklist in the "tag_blacklist" cookie
  // (space-separated, URL-encoded; 100 tags max). Rule34.xxx and Gelbooru verified in their own scripts, the others run the same engine.
  const NATIVE_BLACKLIST = /(^|\.)(rule34\.xxx|gelbooru\.com|tbib\.org|xbooru\.com|hypnohub\.net|realbooru\.com)$/.test(HOST);
  const SKIP = new Set(((typeof KWF_BOORU_SKIP !== "undefined" && KWF_BOORU_SKIP[HOST.replace(/^www\./, "")]) || []).map((t) => t.toLowerCase()));

  function syncNativeBlacklist() {
    if (!NATIVE_BLACKLIST) return;
    try {
      const m = document.cookie.match(/(?:^|;\s*)tag_blacklist=([^;]*)/);
      let current = [];
      if (m) {
        let raw = m[1];
        try { raw = decodeURIComponent(decodeURI(raw)); } catch {}
        current = raw.split(" ").filter(Boolean);
      }
      api.storage.local.get("kwfNativeAdded", (res) => {
        const added = (res && res.kwfNativeAdded && res.kwfNativeAdded[HOST]) || [];
        const want = settings.enabled && !paused && settings.nativeBlacklist ? kwfBooruTags(settings).filter((t) => !SKIP.has(t.toLowerCase())) : [];
        const wantLower = new Set(want.map((t) => t.toLowerCase()));
        // Drop tags we added earlier that are no longer wanted; keep everything the user put there
        const addedLower = new Set(added.map((t) => t.toLowerCase()));
        let next = current.filter((t) => !addedLower.has(t.toLowerCase()) || wantLower.has(t.toLowerCase()));
        const have = new Set(next.map((t) => t.toLowerCase()));
        const ours = [];
        for (const t of want) {
          if (have.has(t.toLowerCase())) { if (addedLower.has(t.toLowerCase())) ours.push(t); continue; }
          if (next.length >= 100) break;
          next.push(t);
          ours.push(t);
        }
        if (next.join(" ") !== current.join(" ")) {
          document.cookie = `tag_blacklist=${encodeURIComponent(next.join(" "))}; path=/; max-age=31536000; SameSite=Lax`;
        }
        if (ours.join(" ") !== added.join(" ")) {
          const all = { ...((res && res.kwfNativeAdded) || {}), [HOST]: ours };
          api.storage.local.set({ kwfNativeAdded: all });
        }
      });
    } catch {}
  }

  function boorusHit(card) {
    const chunks = [card.getAttribute("data-tags") || ""];
    card.querySelectorAll("img[title], img[alt], a[title], [data-tags]").forEach((el) => {
      chunks.push(el.getAttribute("title") || "", el.getAttribute("alt") || "", el.getAttribute("data-tags") || "");
    });
    // Some boards write the tags as "black coat, blue eyes, 1girl" (comma separated, spaces inside a tag).
    // Splitting that on spaces would turn "black coat" into the tags "black" and "coat", so such lists
    // are split on the commas and the spaces inside a tag become underscores.
    const tokens = [];
    for (const chunk of chunks) {
      if (chunk.includes(",")) {
        for (let part of chunk.split(",")) {
          part = part.slice(part.lastIndexOf("|") + 1).trim();
          if (part) tokens.push(part.replace(/\s+/g, "_"));
        }
      } else {
        tokens.push(...chunk.split(/\s+/));
      }
    }
    for (const raw of tokens) {
      if (!raw || raw.includes(":")) continue; // score:12, rating:explicit
      const t = raw.toLowerCase().replace(/-/g, "_");
      if (tagSet.has(t) || (t.endsWith("s") && tagSet.has(t.slice(0, -1)))) return t;
      if (tagMulti && tagMulti.test(kwfFold(t))) return t;
    }
    return null;
  }

  // ───────────── Text on the card itself

  const fullText = new WeakSet(); // auto-detected cards and Reddit posts: read all of their text

  // Text of an element with line breaks turned into spaces ("black<br>cock" must not become "blackcock")
  function textWithBreaks(el, out = []) {
    for (const n of el.childNodes) {
      if (n.nodeType === 3) out.push(n.nodeValue);
      else if (n.nodeType === 1) {
        if (n.tagName === "BR" || n.tagName === "WBR") out.push(" ");
        else textWithBreaks(n, out);
      }
    }
    return out;
  }

  // 4chan posts and catalog tiles: the file name, the subject and the post text
  function fourchanText(card) {
    const chunks = [];
    // On a board page a thread card holds the whole thread; the thread is judged by its first post
    const op = card.classList.contains("thread") ? card.querySelector(":scope > .opContainer") : null;
    const root = op || card;
    root.querySelectorAll(".fileText, .file-info, .fileThumb").forEach((el) => {
      chunks.push(el.textContent || "", el.getAttribute("title") || "", el.getAttribute("data-filename") || "");
    });
    // Long file names are shortened in the link text; the whole name is in the title
    root.querySelectorAll("a[title], a[download], a[data-filename]").forEach((el) => {
      chunks.push(el.getAttribute("title") || "", el.getAttribute("download") || "", el.getAttribute("data-filename") || "");
    });
    root.querySelectorAll(".subject, .postMessage, .teaser").forEach((el) => chunks.push(textWithBreaks(el).join("")));
    // Catalog tiles and layouts changed by userscripts: fall back to the text of the whole element
    if (!chunks.some((c) => c.trim())) chunks.push((root.textContent || "").slice(0, 1200));
    return kwfFold(chunks.join(" \n "));
  }

  function collectText(card) {
    const chunks = [];

    if (IS_4CHAN) return fourchanText(card);

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
    tagCache.set(url, { ts, text: text.slice(0, MAX_STORED_TEXT) });
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
        const tries = (retries.get(url) || 0) + 1;
        retries.set(url, tries);
        if (tries <= MAX_THROTTLE_RETRIES) {
          // Back off a little longer each time (1, 2, 4 minutes)
          pausedUntil = Date.now() + THROTTLE_PAUSE_MS * 2 ** (tries - 1);
          queued.delete(url);
          enqueue(url);
          return;
        }
        // The page keeps answering with an error (a login wall or bot check, say): stop asking and judge by what the thumbnail shows
        retries.delete(url);
        stats.gaveUp++;
        storeTags(url, "", true);
      } else if (!res.ok) {
        stats.failed++;
        storeTags(url, "", true);
      } else {
        stats.fetched++;
        retries.delete(url);
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
    reportBadge();
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
      try {
        // Other tabs write to the same cache: merge instead of overwriting their entries
        api.storage.local.get("kwfTagCache", (res) => {
          void api.runtime.lastError;
          const now = Date.now();
          const merged = new Map();
          for (const [url, v] of Object.entries((res && res.kwfTagCache) || {})) {
            if (Array.isArray(v) && now - v[0] < TTL_MS) merged.set(url, { ts: v[0], text: String(v[1] || "") });
          }
          for (const [url, v] of tagCache) {
            const old = merged.get(url);
            if (!old || old.ts < v.ts) merged.set(url, v);
          }
          let entries = [...merged.entries()].sort((x, y) => y[1].ts - x[1].ts);
          if (entries.length > MAX_CACHE) entries = entries.slice(0, MAX_CACHE - 1000); // keep the newest
          tagCache.clear();
          for (const [k, v] of entries) tagCache.set(k, v);

          const write = (list, retry) => {
            const out = {};
            for (const [url, v] of list) out[url] = [v.ts, v.text];
            api.storage.local.set({ kwfTagCache: out }, () => {
              // Over quota: keep the newest half and try once more
              if (api.runtime.lastError && retry) write(list.slice(0, Math.ceil(list.length / 2)), false);
            });
          };
          write(entries, true);
        });
      } catch {
        /* storage may be unavailable while the extension reloads */
      }
    }, 3000);
  }

  // ───────────── Applying the filter

  function setState(card, hit, pending) {
    card.classList.toggle("kwf-hide", hit && !revealed && settings.mode === "hide");
    card.classList.toggle("kwf-blur", hit && !revealed && settings.mode === "blur");
    card.classList.toggle("kwf-revealed", hit && revealed);
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
    if (!matcher || !matcher.size || !settings.enabled || paused) {
      card.classList.remove("kwf-hide", "kwf-blur", "kwf-pending", "kwf-revealed");
      card.removeAttribute("data-kwf");
      return;
    }

    let why = IS_BOORU ? boorusHit(card) : matcher.match(collectText(card));
    let pending = false;

    if (!why && settings.deepTags && settings.matchTags && !IS_REDDIT && !IS_BOORU && !IS_4CHAN) {
      const url = videoUrl(card);
      if (url) {
        const text = cachedTags(url);
        if (text !== null) why = matcher.match(text);
        else {
          pending = true;
          watchCard(card, url);
        }
      }
    }
    if (why) cardWhy.set(card, why);
    setState(card, !!why, pending);
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
    if (hit) hit.classList.remove("kwf-hide", "kwf-blur", "kwf-pending", "kwf-revealed");

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

  // Thread pages: every post. Board index: whole threads and the replies shown under them. Catalog: the tiles.
  function fourchanCards() {
    if (/\/thread\//.test(location.pathname)) return [...document.querySelectorAll(".postContainer")];
    return [...document.querySelectorAll("#threads > .thread, .board > .thread, .thread > .replyContainer")];
  }

  function currentCards() {
    if (IS_4CHAN) return fourchanCards();
    const specific = [...document.querySelectorAll(CARD_SELECTORS)].filter(
      (c) => !(c.parentElement && c.parentElement.closest(CARD_SELECTORS))
    );
    if (specific.length || IS_REDDIT) return specific;
    const found = new Set();
    for (const img of document.querySelectorAll("a[href] img")) {
      const card = autoCardFor(img);
      if (card) found.add(card);
    }
    // Real thumbnail grids repeat: ignore lone logos and banners (groups of fewer than 3 similar elements)
    const groups = new Map();
    for (const c of found) {
      const key = c.tagName + "." + [...c.classList].filter((x) => !x.startsWith("kwf-")).slice(0, 2).join(".");
      (groups.get(key) || groups.set(key, []).get(key)).push(c);
    }
    const kept = [];
    for (const g of groups.values()) if (g.length >= 3) kept.push(...g);
    const keptSet = new Set(kept);
    for (const c of found) if (!keptSet.has(c)) c.classList.remove("kwf-hide", "kwf-blur", "kwf-pending", "kwf-revealed");
    kept.forEach((c) => fullText.add(c));
    return kept;
  }

  // Only cards that are new, or whose content changed, are judged again; `all` re-judges everything (settings changed)
  function scan(all) {
    if (all) applied = new WeakSet();
    lastCards = currentCards();
    cardSet = new Set(lastCards);
    for (const card of lastCards) {
      if (applied.has(card) && !dirty.has(card)) continue;
      applied.add(card);
      applyCard(card);
    }
    dirty.clear();
    reportBadge();
  }

  // Number of hidden items for the toolbar badge
  function reportBadge() {
    const count = settings.enabled && !paused && settings.badge ? document.querySelectorAll("[data-kwf]").length : 0;
    if (count === lastBadge) return;
    lastBadge = count;
    try {
      api.runtime.sendMessage({ type: "kwf-badge", count }, () => void api.runtime.lastError);
    } catch {
      /* extension reloaded */
    }
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
          paused = settings.pausedSites.some((p) => SITE === p || SITE.endsWith("." + p));
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
      mode: IS_REDDIT ? "reddit" : IS_4CHAN ? "4chan" : document.querySelector(CARD_SELECTORS) ? "selectors" : "auto-detect",
      settings: { enabled: settings.enabled, paused, deepTags: settings.deepTags, matchTags: settings.matchTags, mode: settings.mode },
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

  // What was filtered on this page and which term matched, for the popup
  function hitList() {
    const out = [];
    for (const el of document.querySelectorAll("[data-kwf]")) {
      if (out.length >= 60) break;
      let text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) {
        const img = el.querySelector("img[alt], img[title], a[title]");
        text = img ? img.getAttribute("alt") || img.getAttribute("title") || "" : "";
      }
      out.push({ why: cardWhy.get(el) || "", text: text.slice(0, 90) });
    }
    return out;
  }

  async function init() {
    if (HOST === "boards.4chan.org" && !IS_4CHAN) return; // only the listed adult boards
    await Promise.all([loadSettings(), loadCache()]);
    rebuild();
    syncNativeBlacklist();
    scan();

    new MutationObserver((records) => {
      // Remember which known cards changed, so the next scan judges only those (and new ones)
      for (const r of records) {
        let n = r.target.nodeType === 1 ? r.target : r.target.parentElement;
        for (let i = 0; n && i < 12; i++, n = n.parentElement) {
          if (cardSet.has(n)) {
            dirty.add(n);
            break;
          }
        }
      }
      scheduleScan();
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["alt", "title", "data-tags", "data-tag", "href"]
    });

    api.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;
      // The tag cache is rewritten constantly; only real settings changes need a rescan
      if (Object.keys(changes).every((k) => k === "kwfTagCache" || k === "kwfNativeAdded")) {
        if (changes.kwfTagCache && !changes.kwfTagCache.newValue) tagCache.clear(); // cache cleared from the settings page
        return;
      }
      loadSettings().then(() => {
        rebuild();
        syncNativeBlacklist();
        lastBadge = -1;
        scan(true);
      });
    });

    api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (!msg) return;
      if (msg.type === "kwf-count") sendResponse({ count: document.querySelectorAll("[data-kwf]").length, host: SITE, paused, revealed });
      if (msg.type === "kwf-debug") sendResponse(debugInfo());
      if (msg.type === "kwf-hits") sendResponse(hitList());
      if (msg.type === "kwf-reveal") {
        revealed = !!msg.on;
        scan(true);
        sendResponse({ revealed });
      }
    });
  }

  init();
})();
