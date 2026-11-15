// Search-engine filter: hides web and image results that come from an adult site AND match your lists.
// Results from other sites are never touched, whatever they say. Loaded on the engines in manifest.json.
(() => {
  "use strict";

  const api = globalThis.chrome ?? globalThis.browser;
  const HOST = location.hostname.toLowerCase();
  const SITE = HOST.replace(/^www\./, "");

  // ───────────── Engines
  // Each extractor returns [{ el, href, text }]: the element to hide, the address the result points to and
  // the text to match. Several selectors per engine, because engines rename their classes now and then.

  const abs = (h) => {
    try { return new URL(h, location.href).href; } catch { return ""; }
  };
  const ownHost = (href) => {
    try { return new URL(href).hostname.replace(/^www\./, "") === SITE; } catch { return true; }
  };
  const attr = (el, name) => (el && el.getAttribute(name)) || "";
  const imgText = (el) => [...el.querySelectorAll("img")].map((i) => `${attr(i, "alt")} ${attr(i, "title")}`).join(" ");

  // Only the innermost element of nested matches, so one result never hides its neighbours
  function innermost(list) {
    const set = new Set(list);
    return list.filter((el) => ![...set].some((o) => o !== el && el.contains(o)));
  }

  // First link of a result that points off the engine (the result's own address)
  function resultLink(el, linkSel) {
    const cands = linkSel ? [...el.querySelectorAll(linkSel)] : [];
    cands.push(...el.querySelectorAll("a[href]"));
    for (const a of cands) {
      const url = kwfResultUrl(a.getAttribute("href"), location.href);
      if (url && !ownHost(url)) return url;
    }
    // Google wraps links in opaque /goto?url=… tokens; the visible address line ("https://site.tld › path") still names the site
    for (const c of el.querySelectorAll("cite")) {
      const first = c.textContent.trim().split(/[\s›]/)[0];
      if (!first) continue;
      const url = abs(/^[a-z][a-z0-9+.-]*:\/\//i.test(first) ? first : "https://" + first);
      if (/^https?:\/\/[^/]+\.[^/]+/.test(url) && !ownHost(url)) return url;
    }
    return "";
  }

  const web = (itemSel, linkSel) => () =>
    innermost([...document.querySelectorAll(itemSel)]).map((el) => {
      const href = resultLink(el, linkSel);
      return { el, href, text: el.textContent + " " + kwfUrlText(href) };
    });

  const ENGINES = [
    {
      id: "google",
      host: /(^|\.)google\.[a-z.]+$/,
      extract: [
        web("#rso div.g, #search div.g, #rso div.MjjYud, #rso div[data-hveid][data-ved]", "a:has(h3), a[jsname]"),
        () =>
          // Tiles are nested: div[data-docid] > … > div[data-docid][data-lpage=source page] (checked on the live site).
          // The outermost one is hidden so no empty cell is left.
          [...document.querySelectorAll("div[data-docid], div[data-id][data-ri]")]
            .filter((el) => !el.parentElement || !el.parentElement.closest("div[data-docid], div[data-id][data-ri]"))
            .map((el) => {
            const lp = el.matches("[data-lpage]") ? el : el.querySelector("[data-lpage]");
            let href = attr(lp, "data-lpage");
            if (!href) {
              for (const a of el.querySelectorAll("a[href]")) {
                const u = kwfResultUrl(a.getAttribute("href"), location.href);
                if (u && !ownHost(u)) { href = u; break; }
              }
            }
            return { el, href, text: `${imgText(el)} ${el.textContent} ${kwfUrlText(href)}` };
          })
      ]
    },
    {
      id: "bing",
      host: /(^|\.)bing\.com$/,
      extract: [
        web("li.b_algo", "h2 a"),
        () =>
          [...document.querySelectorAll("a.iusc[m]")].map((a) => {
            let m = {};
            try { m = JSON.parse(a.getAttribute("m")); } catch { /* unreadable tile */ }
            const href = m.purl || "";
            return { el: a.closest("li") || a.parentElement, href, text: `${m.t || ""} ${m.desc || ""} ${imgText(a)} ${kwfUrlText(href)}` };
          })
      ]
    },
    {
      id: "duckduckgo",
      host: /(^|\.)duckduckgo\.com$/,
      extract: [
        web("article[data-testid='result'], li[data-layout='organic'], div.result, div.web-result", "a[data-testid='result-title-a'], a.result__a"),
        () =>
          // Image grid: <li><figure><img>…</figure></li> with a link to the source page (checked on the live site);
          // the older .tile--img markup is kept for the lite versions
          innermost([
            ...document.querySelectorAll(".tile--img, [class*='tile--img']:not([class*='__'])"),
            ...[...document.querySelectorAll("li > figure")].filter((f) => f.querySelector("img") && f.querySelector("a[href]")).map((f) => f.parentElement)
          ]).map((el) => {
            const href = resultLink(el, "a.tile--img__sub, a[href]");
            return { el, href, text: `${imgText(el)} ${el.textContent} ${kwfUrlText(href)}` };
          })
      ]
    },
    {
      id: "brave",
      host: /(^|\.)search\.brave\.com$/,
      extract: [
        web("div.snippet[data-type='web'], div.snippet[data-type='video']", "a[href]"),
        // Image tiles are link-less buttons whose text starts with the source host: "en.wikipedia.org A tabby cat…"
        () =>
          [...document.querySelectorAll("button.image-result")].map((el) => {
            const first = el.textContent.trim().split(/\s/)[0];
            const href = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(first) ? "https://" + first.toLowerCase() + "/" : "";
            return { el, href, text: `${imgText(el)} ${el.textContent}` };
          })
      ]
    },
    {
      id: "yahoo",
      host: /(^|\.)search\.yahoo\.com$/,
      extract: [
        web("#web li div.dd, #web div.algo, div.algo-sr", "h3 a, a[href]"),
        () =>
          [...document.querySelectorAll("li[data-bns='API'], #sres li, #resg li")]
            .filter((el) => el.querySelector("img"))
            .map((el) => {
              const href = resultLink(el, "a[href]");
              return { el, href, text: `${imgText(el)} ${el.textContent} ${kwfUrlText(href)}` };
            })
      ]
    },
    { id: "startpage", host: /(^|\.)startpage\.com$/, extract: [web("div.result, .w-gl__result", "a.result-link, a.result-title, a[href]")] },
    { id: "ecosia", host: /(^|\.)ecosia\.org$/, extract: [web("[data-test-id='organic-result'], article.result, .result", "a[href]")] },
    { id: "qwant", host: /(^|\.)qwant\.com$/, extract: [web("[data-testid='webResult'], [data-testid='sectionWeb'] > div", "a[href]")] },
    { id: "yandex", host: /(^|\.)yandex\.[a-z.]+$/, extract: [web("li.serp-item", "a.OrganicTitle-Link, a[href]")] },
    { id: "kagi", host: /(^|\.)kagi\.com$/, extract: [web(".search-result, ._0_SRI", "a[href]")] },
    { id: "mojeek", host: /(^|\.)mojeek\.com$/, extract: [web("ul.results-standard > li", "a.title, a[href]")] }
  ];

  const engine = ENGINES.find((e) => e.host.test(HOST));
  if (!engine) return;

  // ───────────── State

  let settings = kwfResolve(null);
  let matcher = null;
  let isAdult = () => false;
  let paused = false;
  let revealed = false;
  let scheduled = false;
  let lastBadge = -1;
  const why = new WeakMap();

  function rebuild() {
    matcher = kwfBuildMatcher(kwfActiveTerms(settings), settings.wholeWord);
    isAdult = kwfAdultHostTester(settings);
  }

  function setState(el, hit) {
    el.classList.toggle("kwf-hide", hit && !revealed && settings.mode === "hide");
    el.classList.toggle("kwf-blur", hit && !revealed && settings.mode === "blur");
    el.classList.toggle("kwf-revealed", hit && revealed);
    if (hit) el.setAttribute("data-kwf", "1");
    else el.removeAttribute("data-kwf");
  }

  function scan() {
    const off = !settings.enabled || !settings.searchFilter || paused || !matcher || !matcher.size;
    const seen = new Set();
    for (const extract of engine.extract) {
      let results = [];
      try { results = extract(); } catch { /* layout changed: skip this extractor */ }
      for (const { el, href, text } of results) {
        if (!el || seen.has(el)) continue;
        seen.add(el);
        let term = null;
        if (!off && href) {
          let host = "";
          try { host = new URL(href).hostname; } catch { /* no address */ }
          // Only results from adult sites are ever checked
          if (isAdult(host)) term = matcher.match(kwfFold(text.replace(/\s+/g, " ")));
        }
        if (term) why.set(el, term);
        setState(el, !!term);
      }
    }
    // Results that disappeared from the extractors (layout change, other settings) must not stay hidden
    for (const el of document.querySelectorAll("[data-kwf]")) if (!seen.has(el)) setState(el, false);
    reportBadge();
  }

  function reportBadge() {
    const count = settings.enabled && settings.searchFilter && !paused && settings.badge ? document.querySelectorAll("[data-kwf]").length : 0;
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
    setTimeout(() => {
      scheduled = false;
      scan();
    }, 150);
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

  function hitList() {
    const out = [];
    for (const el of document.querySelectorAll("[data-kwf]")) {
      if (out.length >= 60) break;
      const text = ((el.textContent || "").replace(/\s+/g, " ").trim() || imgText(el)).slice(0, 90);
      out.push({ why: why.get(el) || "", text });
    }
    return out;
  }

  async function init() {
    await loadSettings();
    rebuild();
    scan();

    // Results arrive while scrolling and when the engine switches between web and image view without a reload
    new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });

    api.storage.onChanged.addListener((changes, area) => {
      if (area !== "local" || !Object.keys(changes).some((k) => Object.prototype.hasOwnProperty.call(KWF_DEFAULTS, k))) return;
      loadSettings().then(() => {
        rebuild();
        lastBadge = -1;
        scan();
      });
    });

    api.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (!msg) return;
      if (msg.type === "kwf-count") sendResponse({ count: document.querySelectorAll("[data-kwf]").length, host: SITE, paused, revealed });
      if (msg.type === "kwf-hits") sendResponse(hitList());
      if (msg.type === "kwf-debug") {
        const found = engine.extract.flatMap((fn) => { try { return fn(); } catch { return []; } });
        sendResponse({
          url: location.href,
          engine: engine.id,
          settings: { enabled: settings.enabled, searchFilter: settings.searchFilter, paused },
          terms: matcher ? matcher.size : 0,
          resultsFound: found.length,
          hidden: document.querySelectorAll("[data-kwf]").length,
          sample: found.slice(0, 5).map((r) => ({ href: r.href, adult: isAdult((() => { try { return new URL(r.href).hostname; } catch { return ""; } })()), text: r.text.replace(/\s+/g, " ").slice(0, 120) }))
        });
      }
      if (msg.type === "kwf-reveal") {
        revealed = !!msg.on;
        scan();
        sendResponse({ revealed });
      }
    });
  }

  init();
})();
