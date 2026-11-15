// Shared logic for the content script, popup and settings page (needs lists.js first).

const KWF_KINDS = { keywords: "Keywords", studios: "Studios", performers: "Performers", sites: "Whole sites" };

const KWF_DEFAULTS = {
  enabled: true,
  matchTitle: true,
  matchTags: true,
  wholeWord: true,
  deepTags: true,          // read tags from each video's own page (thumbnails rarely show them)
  holdUntilChecked: true,  // keep thumbnails invisible until their tags were checked
  mode: "hide", // "hide" | "blur"
  extraSites: [],          // extra domains the user added (content script registered by background.js)
  siteBlocking: true,      // block entire sites that belong to an enabled "sites" list
  nativeBlacklist: true,   // on Rule34 & co: also add the active image-board tags to the site's own blacklist
  badge: true,             // show how many items were hidden on the toolbar icon
  searchFilter: true,      // on search engines: hide web and image results from adult sites that match the lists
  pausedSites: [],         // hostnames the filter is switched off for (popup toggle)
  lists: {},          // listId -> true/false (missing = list default)
  disabledItems: {},  // listId -> [items the user switched off]
  customLists: []     // [{ id, name, enabled, items: [] }]
};

const kwfLower = (s) => String(s).trim().toLowerCase();

// Case/accent/width-insensitive form used for both terms and page text.
// Only the combining-diacritics block is stripped, so kana voicing marks survive.
function kwfFold(str) {
  return String(str).normalize("NFKC").normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// Scripts written without spaces (or with attached particles): match as substrings
const KWF_SUBSTRING_SCRIPTS =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Thai}\p{Script=Khmer}\p{Script=Lao}\p{Script=Myanmar}]/u;

function kwfResolve(stored) {
  const src = stored || {};
  // Only known settings keys; anything else in storage (e.g. the tag cache) is ignored
  const s = {};
  for (const key of Object.keys(KWF_DEFAULTS)) s[key] = src[key] !== undefined ? src[key] : KWF_DEFAULTS[key];
  s.lists = src.lists && typeof src.lists === "object" ? { ...src.lists } : {};
  s.disabledItems = src.disabledItems && typeof src.disabledItems === "object" ? { ...src.disabledItems } : {};
  s.customLists = Array.isArray(src.customLists) ? src.customLists : [];
  s.extraSites = Array.isArray(src.extraSites) ? src.extraSites : [];
  s.pausedSites = Array.isArray(src.pausedSites) ? src.pausedSites.map((d) => String(d).toLowerCase()) : [];
  return s;
}

function kwfCatalogLists() {
  return KWF_CATALOG.flatMap((topic) => topic.lists);
}

function kwfListEnabled(s, list) {
  return Object.prototype.hasOwnProperty.call(s.lists, list.id) ? !!s.lists[list.id] : list.default !== false;
}

function kwfDisabledSet(s, listId) {
  return new Set((s.disabledItems[listId] || []).map(kwfLower));
}

// Every active term: enabled catalog lists minus switched-off items, plus enabled custom lists
function kwfActiveTerms(s) {
  const out = [];
  for (const list of kwfCatalogLists()) {
    if (list.kind === "sites" || !kwfListEnabled(s, list)) continue;
    const off = kwfDisabledSet(s, list.id);
    for (const item of list.items) if (!off.has(kwfLower(item))) out.push(item);
  }
  for (const list of s.customLists) {
    if (list.enabled === false || list.kind === "sites") continue;
    out.push(...(list.items || []));
  }
  const seen = new Set();
  return out
    .map((t) => String(t).trim())
    .filter((t) => t && !seen.has(kwfLower(t)) && seen.add(kwfLower(t)));
}

// Exact image-board tags (e.g. "dark-skinned_male") of enabled lists, minus lists switched off
function kwfBooruTags(s) {
  const seen = new Set();
  const out = [];
  for (const list of kwfCatalogLists()) {
    if (!list.boorus || !kwfListEnabled(s, list)) continue;
    for (const t of list.boorus) if (!seen.has(t)) (seen.add(t), out.push(t));
  }
  return out;
}

// ── Whole-site blocking ─────────────────────────────────────────────────────
// Items of a "sites" list are domains ("blacked.com" = that domain and its subdomains) or
// *word* patterns (any site whose address contains the word).

function kwfParseSite(raw) {
  let t = String(raw).trim().toLowerCase();
  if (!t) return null;
  const word = t.length > 2 && t.startsWith("*") && t.endsWith("*");
  t = t.replace(/^[a-z][a-z0-9+.-]*:\/\//, "").replace(/^\*+|\*+$/g, "").replace(/^www\./, "").split(/[\/?#]/)[0];
  if (!t || /\s/.test(t)) return null;
  return word ? { word: t } : { domain: t.replace(/:\d+$/, "").replace(/\.$/, "") };
}

function kwfActiveSites(s) {
  const out = [];
  for (const list of kwfCatalogLists()) {
    if (list.kind !== "sites" || !kwfListEnabled(s, list)) continue;
    const off = kwfDisabledSet(s, list.id);
    for (const item of list.items) if (!off.has(kwfLower(item))) out.push(item);
  }
  for (const list of s.customLists) {
    if (list.enabled === false || list.kind !== "sites") continue;
    out.push(...(list.items || []));
  }
  const domains = new Set();
  const words = new Set();
  for (const item of out) {
    const site = kwfParseSite(item);
    if (!site) continue;
    if (site.domain) domains.add(site.domain);
    else words.add(site.word);
  }
  return { domains: [...domains], words: [...words] };
}

const kwfReEscape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// declarativeNetRequest conditions for whole-site blocking. One big regex alternation exceeds Chrome's regex
// memory limit (then not a single rule is installed), so every site gets its own small regex. Chrome allows
// about 1000 regex rules; sites beyond 900 fall back to requestDomains rules (they cannot show the address on
// the "site blocked" page).
function kwfSiteConditions(sites, maxRegex = 900) {
  const tail = "(?::[0-9]+)?(?:[/?#].*)?$";
  const items = [];
  for (const d of sites.domains) {
    let h = "";
    try { h = new URL("http://" + d).hostname; } catch (e) { continue; }
    if (h && /^[a-z0-9.-]+$/.test(h) && !h.startsWith(".") && !h.endsWith(".")) items.push({ host: h });
  }
  for (const w of sites.words) items.push({ word: w });
  const out = [];
  const overflow = [];
  for (const it of items) {
    if (out.length >= maxRegex) {
      if (it.host) overflow.push(it.host);
      continue;
    }
    const regex = it.host
      ? `^https?://(?:[^/?#]*\\.)?${kwfReEscape(it.host)}${tail}`
      : `^https?://[^/?#]*${kwfReEscape(it.word)}[^/?#]*${tail}`;
    out.push({ regexFilter: regex, isUrlFilterCaseSensitive: false });
  }
  for (let i = 0; i < overflow.length; i += 500) out.push({ requestDomains: overflow.slice(i, i + 500) });
  return out;
}

// Returns { size, match(text) }. match() expects text already passed through kwfFold().
function kwfBuildMatcher(terms, wholeWord) {
  const latin = [];
  const substr = [];
  const exact = []; // case-sensitive terms ("=AI"): always whole-word
  const seen = new Set();
  for (const raw of terms) {
    const cs = String(raw).trim().startsWith("=");
    const t = kwfFold(cs ? String(raw).trim().slice(1) : raw).trim();
    const key = (cs ? "=" : "") + (cs ? t : t.toLowerCase());
    if (!t || seen.has(key)) continue;
    seen.add(key);
    if (cs) exact.push(t);
    else (KWF_SUBSTRING_SCRIPTS.test(t) ? substr : latin).push(t);
  }

  // A space inside a term matches any separator or none: "step mom" also catches step-mom / stepmom
  const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[\\s\\-_.]*");
  const longestFirst = (a, b) => b.length - a.length;

  let latinRe = null;
  let substrRe = null;
  let exactRe = null;

  if (latin.length) {
    const alt = latin.sort(longestFirst).map(esc).join("|");
    latinRe = wholeWord
      // One boundary check, then the alternation. A plural "s" still counts (Asians, Ladyboys).
      ? new RegExp(`(?<![\\p{L}\\p{N}\\p{M}])(?:${alt})s?(?![\\p{L}\\p{N}\\p{M}])`, "iu")
      : new RegExp(alt, "iu");
  }
  if (exact.length)
    exactRe = new RegExp(`(?<![\\p{L}\\p{N}\\p{M}])(?:${exact.sort(longestFirst).map(esc).join("|")})s?(?![\\p{L}\\p{N}\\p{M}])`, "u");
  if (substr.length) substrRe = new RegExp(substr.sort(longestFirst).map(esc).join("|"), "u");

  return {
    size: latin.length + substr.length + exact.length,
    match(text) {
      const a = latinRe && latinRe.exec(text);
      if (a) return a[0];
      const c = exactRe && exactRe.exec(text);
      if (c) return c[0];
      const b = substrRe && substrRe.exec(text);
      return b ? b[0] : null;
    }
  };
}

// ── Search-engine results ───────────────────────────────────────────────────
// search.js hides a result only when it comes from an adult site AND its title, snippet or address matches a term.

// Address a search result really points to (engines wrap links in redirects); "" when it cannot be told.
function kwfResultUrl(href, base) {
  let u;
  try { u = new URL(href, base || "https://search.invalid/"); } catch (e) { return ""; }
  if (!/^https?:$/.test(u.protocol)) return "";
  const host = u.hostname.toLowerCase();
  const q = u.searchParams;
  let target = "";
  if (/(^|\.)google\.[a-z.]+$/.test(host)) {
    if (u.pathname === "/url") target = q.get("q") || q.get("url") || "";
    else if (u.pathname === "/imgres") target = q.get("imgrefurl") || "";
  } else if (/(^|\.)duckduckgo\.com$/.test(host)) {
    target = q.get("uddg") || "";
  } else if (/(^|\.)bing\.com$/.test(host) && u.pathname.startsWith("/ck/")) {
    // u=a1<base64url of the address>
    const v = q.get("u") || "";
    if (/^a1/.test(v) && typeof atob === "function") {
      try { target = atob(v.slice(2).replace(/-/g, "+").replace(/_/g, "/")); } catch (e) { target = ""; }
    }
  } else if (/(^|\.)search\.yahoo\.com$/.test(host)) {
    const m = /\/RU=([^/]+)/.exec(u.pathname);
    if (m) { try { target = decodeURIComponent(m[1]); } catch (e) { target = ""; } }
  }
  if (!target) return u.href;
  try { const t = new URL(target); return /^https?:$/.test(t.protocol) ? t.href : ""; } catch (e) { return ""; }
}

// The address as words ("/video/step-mom_123?q=a+b" -> "video step mom 123 q a b"), so the matcher can read slugs
function kwfUrlText(url) {
  let u;
  try { u = new URL(url); } catch (e) { return ""; }
  let t = u.pathname + " " + u.search.replace(/^\?/, "").replace(/&/g, " ");
  try { t = decodeURIComponent(t); } catch (e) { /* keep the encoded form */ }
  return t.replace(/[-_+/.=]+/g, " ");
}

// Sites that look adult from their name alone (catches domains missing from KWF_ADULT_HOSTS)
const KWF_ADULT_HOST_HINT = /porn|hentai|xvideo|xnxx|xhamster|rule34|(^|[.-])(xxx|sex|nsfw|r34|nudes?|milf|fuck|bdsm)([.-]|$)|\.(xxx|porn|sex|adult)$/;

// Returns a function host -> boolean: is this an adult site? Covers the built-in list, sites the user added, the
// name hint and the sites of every enabled "Whole sites" list.
function kwfAdultHostTester(s) {
  const domains = new Set(typeof KWF_ADULT_HOSTS !== "undefined" ? KWF_ADULT_HOSTS : []);
  for (const d of (s && s.extraSites) || []) {
    const site = kwfParseSite(d);
    if (site && site.domain) domains.add(site.domain);
  }
  const words = [];
  if (s) {
    const sites = kwfActiveSites(s);
    for (const d of sites.domains) domains.add(d);
    words.push(...sites.words);
  }
  const cache = new Map();
  return (rawHost) => {
    const host = String(rawHost || "").toLowerCase().replace(/\.$/, "");
    if (!host) return false;
    if (cache.has(host)) return cache.get(host);
    let res = KWF_ADULT_HOST_HINT.test(host) || words.some((w) => host.includes(w));
    for (let h = host; !res && h.includes("."); h = h.slice(h.indexOf(".") + 1)) if (domains.has(h)) res = true;
    cache.set(host, res);
    return res;
  };
}
