// Shared logic for the content script, popup and settings page (needs lists.js first).

const KWF_KINDS = { keywords: "Keywords", studios: "Studios", performers: "Performers", sites: "Whole sites" };

const KWF_DEFAULTS = {
  enabled: true,
  matchTitle: true,
  matchTags: true,
  wholeWord: true,
  deepTags: true,          // read tags from each video's own page (thumbnails rarely show them)
  holdUntilChecked: false, // keep thumbnails invisible until their tags were checked
  mode: "hide", // "hide" | "blur"
  redditNsfwOnly: true,    // on Reddit, only filter posts marked NSFW
  extraSites: [],          // extra domains the user added (content script registered by background.js)
  siteBlocking: true,      // block entire sites that belong to an enabled "sites" list
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

// Regex strings (RE2-compatible, matching the whole URL) for declarativeNetRequest; chunked to stay small.
function kwfSiteRegexes(sites, chunk = 40) {
  const out = [];
  const tail = "(?::[0-9]+)?(?:[/?#].*)?$";
  for (let i = 0; i < sites.domains.length; i += chunk) {
    const alt = sites.domains.slice(i, i + chunk).map(kwfReEscape).join("|");
    out.push(`^https?://(?:[^/?#]*\\.)?(?:${alt})${tail}`);
  }
  for (let i = 0; i < sites.words.length; i += chunk) {
    const alt = sites.words.slice(i, i + chunk).map(kwfReEscape).join("|");
    out.push(`^https?://[^/?#]*(?:${alt})[^/?#]*${tail}`);
  }
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
