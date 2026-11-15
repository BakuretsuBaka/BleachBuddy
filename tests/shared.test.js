// Unit tests for the matcher, list resolution and site-blocking logic (run with `npm test`).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ctx = vm.createContext({ console, URL });
for (const file of ["lists.js", "adult-sites.js", "shared.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), ctx, { filename: file });
}
// `const` declarations are not properties of the context: read them out explicitly
const g = vm.runInContext(
  `({ KWF_CATALOG, KWF_DEFAULTS, kwfFold, kwfResolve, kwfActiveTerms, kwfActiveSites, kwfBuildMatcher, kwfParseSite, kwfSiteConditions, kwfBooruTags, kwfCatalogLists, kwfListEnabled, kwfResultUrl, kwfUrlText, kwfAdultHostTester, KWF_ADULT_HOSTS, kwfActiveExceptions })`,
  ctx
);
const { kwfActiveExceptions, kwfResultUrl, kwfUrlText, kwfAdultHostTester, KWF_ADULT_HOSTS, kwfFold, kwfResolve, kwfActiveTerms, kwfActiveSites, kwfBuildMatcher, kwfParseSite, kwfSiteConditions } = g;

// Objects from the vm context have another prototype: compare plain copies
const plain = (x) => JSON.parse(JSON.stringify(x));
const matcher = (terms, whole = true) => kwfBuildMatcher(terms, whole);
const hit = (m, text) => m.match(kwfFold(text));

test("whole words, plurals and case", () => {
  const m = matcher(["Asian", "step mom"]);
  assert.equal(hit(m, "Hot ASIAN girl"), "ASIAN");
  assert.equal(hit(m, "two Asians"), "Asians");
  assert.equal(hit(m, "Caucasian"), null);
  assert.ok(hit(m, "stepmom"));
  assert.ok(hit(m, "step-mom"));
  assert.ok(hit(m, "Step Mom"));
});

test("accents and width are ignored", () => {
  const m = matcher(["Café"]);
  assert.ok(hit(m, "CAFE"));
  assert.ok(hit(matcher(["cafe"]), "Café"));
  assert.ok(hit(matcher(["ＢＢＣ"]), "bbc"));
});

test("case-sensitive terms start with =", () => {
  const m = matcher(["=AI"]);
  assert.ok(hit(m, "an AI video"));
  assert.equal(hit(m, "a mail video"), null);
  assert.equal(hit(m, "ai video"), null);
});

test("CJK terms match as substrings", () => {
  const m = matcher(["異人種"]);
  assert.ok(hit(m, "異人種間ドラマ"));
});

test("whole word can be switched off", () => {
  assert.ok(hit(matcher(["asian"], false), "Caucasian"));
});

test("regex characters in terms are literal", () => {
  const m = matcher(["a+b", "(x)"]);
  assert.ok(hit(m, "a+b"));
  assert.equal(hit(m, "aab"), null);
});

test("every built-in term compiles and the catalog has no duplicate list ids", () => {
  const s = kwfResolve(null);
  assert.doesNotThrow(() => kwfBuildMatcher(kwfActiveTerms(s), true));
  const ids = g.kwfCatalogLists().map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("settings resolution ignores unknown keys and fixes bad types", () => {
  const s = kwfResolve({ enabled: false, tagCache: 1, lists: "x", extraSites: null, pausedSites: ["WWW.Example.com", 5] });
  assert.equal(s.enabled, false);
  assert.equal("tagCache" in s, false);
  assert.deepEqual(plain(s.lists), {});
  assert.deepEqual(plain(s.extraSites), []);
  assert.deepEqual(plain(s.pausedSites), ["www.example.com", "5"]);
  assert.equal(kwfResolve(null).badge, true);
});

test("switched-off items and lists are left out", () => {
  const list = g.kwfCatalogLists().find((l) => l.kind === "keywords");
  const item = list.items[0];
  const on = kwfActiveTerms(kwfResolve({ lists: { [list.id]: true } }));
  assert.ok(on.some((t) => t.toLowerCase() === item.toLowerCase()));
  const off = kwfActiveTerms(kwfResolve({ lists: { [list.id]: true }, disabledItems: { [list.id]: [item] } }));
  assert.ok(!off.includes(item));
  const none = kwfActiveTerms(kwfResolve({ lists: { [list.id]: false } }));
  assert.ok(!none.includes(item) || g.kwfCatalogLists().some((l) => l.id !== list.id && l.items.includes(item)));
});

test("custom lists count unless switched off", () => {
  const s = kwfResolve({ customLists: [{ id: "c", name: "c", enabled: true, items: ["zzzterm"] }, { id: "d", name: "d", enabled: false, items: ["offterm"] }] });
  const terms = kwfActiveTerms(s);
  assert.ok(terms.includes("zzzterm"));
  assert.ok(!terms.includes("offterm"));
});

test("site entries are parsed", () => {
  assert.deepEqual(plain(kwfParseSite("https://www.Blacked.com/videos?x=1")), { domain: "blacked.com" });
  assert.deepEqual(plain(kwfParseSite("*interracial*")), { word: "interracial" });
  assert.equal(kwfParseSite("  "), null);
  assert.equal(kwfParseSite("two words.com"), null);
});

test("site regexes match the domain and its subdomains only", () => {
  const [re] = kwfSiteConditions({ domains: ["blacked.com"], words: [] }).map((c) => new RegExp(c.regexFilter, "i"));
  assert.ok(re.test("https://blacked.com/"));
  assert.ok(re.test("https://www.blacked.com/x?y=1#z"));
  assert.ok(re.test("http://a.b.blacked.com:8080/"));
  assert.equal(re.test("https://notblacked.com/"), false);
  assert.equal(re.test("https://blacked.com.evil.org/"), false);
  assert.equal(re.test("https://example.org/blacked.com"), false);
});

test("word patterns match inside the host only", () => {
  const re = new RegExp(kwfSiteConditions({ domains: [], words: ["interracial"] })[0].regexFilter, "i");
  assert.ok(re.test("https://best-interracial-tube.net/"));
  assert.equal(re.test("https://example.org/interracial"), false);
});

test("site rules stay small enough for the browser's regex limit", () => {
  const sites = kwfActiveSites(kwfResolve(null));
  // every regex stays tiny (the browser rejects a whole rule set if one regex exceeds its memory limit)
  for (const c of kwfSiteConditions(sites)) assert.ok(!c.regexFilter || c.regexFilter.length < 200, `regex of ${c.regexFilter.length} chars`);
});

test("sites beyond the regex limit fall back to requestDomains rules", () => {
  const conds = kwfSiteConditions({ domains: ["a.com", "b.com", "c.com"], words: [] }, 1);
  assert.equal(conds.length, 2);
  assert.ok(conds[0].regexFilter);
  assert.deepEqual(plain(conds[1].requestDomains), ["b.com", "c.com"]);
});

// ── Search-engine results ──

test("redirect links of search engines are unwrapped", () => {
  const g = "https://www.google.com/search?q=x";
  assert.equal(kwfResultUrl("/url?sa=t&q=https%3A%2F%2Fwww.pornhub.com%2Fview%3Fa%3D1&ved=2", g), "https://www.pornhub.com/view?a=1");
  assert.equal(kwfResultUrl("/imgres?imgurl=https%3A%2F%2Fi.x.com%2Fa.jpg&imgrefurl=https%3A%2F%2Fxvideos.com%2Fv1", g), "https://xvideos.com/v1");
  assert.equal(kwfResultUrl("//duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.org%2Fp&rut=abc", "https://duckduckgo.com/?q=x"), "https://example.org/p");
  const b64 = Buffer.from("https://spankbang.com/a/video").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  ctx.atob = (v) => Buffer.from(v, "base64").toString("binary");
  assert.equal(kwfResultUrl("https://www.bing.com/ck/a?!&&p=1&u=a1" + b64 + "&ntb=1", "https://www.bing.com/search?q=x"), "https://spankbang.com/a/video");
  assert.equal(kwfResultUrl("https://r.search.yahoo.com/_ylt=A/RV=2/RE=1/RO=10/RU=https%3a%2f%2fxnxx.com%2fv/RK=2/RS=z", "https://search.yahoo.com/"), "https://xnxx.com/v");
  assert.equal(kwfResultUrl("https://example.org/a", "https://search.brave.com/"), "https://example.org/a");
  assert.equal(kwfResultUrl("javascript:void(0)", "https://www.google.com/"), "");
});

test("address text exposes the slug to the matcher", () => {
  const m = matcher(["step mom", "interracial"]);
  assert.ok(hit(m, kwfUrlText("https://x.com/video/step-mom_123?q=a+b")));
  assert.ok(hit(m, kwfUrlText("https://x.com/watch?v=Interracial%20Fun")));
});

test("adult sites are told apart from other sites", () => {
  const is = kwfAdultHostTester(kwfResolve(null));
  for (const h of ["pornhub.com", "www.pornhub.com", "de.pornhub.com", "xvideos.es", "rule34.xxx", "some-new-porn-tube.net", "foo.xxx", "sex.com"]) assert.ok(is(h), h);
  for (const h of ["wikipedia.org", "essex.ac.uk", "reddit.com", "youtube.com", "notpornhub.example.org.evil", "", "sextant.org", "blackpool.gov.uk"]) assert.equal(is(h), h.startsWith("notporn"), h);
});

test("user-added sites and whole-site lists count as adult", () => {
  const s = kwfResolve({ extraSites: ["mytube.example"], customLists: [{ id: "c", enabled: true, kind: "sites", items: ["*spicy*", "secret.net"] }] });
  const is = kwfAdultHostTester(s);
  assert.ok(is("www.mytube.example"));
  assert.ok(is("best-spicy-tube.org"));
  assert.ok(is("a.secret.net"));
  assert.equal(is("other.net"), false);
});

test("the adult-site list matches the supported sites in manifest.json", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8"));
  const skip = new Set(["reddit.com", "boards.4chan.org"]);
  const expected = manifest.content_scripts[0].matches.map((p) => p.replace(/^\*:\/\/(\*\.)?/, "").replace(/\/\*$/, "")).filter((h) => !skip.has(h));
  assert.deepEqual([...KWF_ADULT_HOSTS].sort(), [...new Set(expected)].sort());
});

test("manifest loads the search script on every engine", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8"));
  const entry = manifest.content_scripts.find((c) => c.js.includes("search.js"));
  assert.ok(entry);
  assert.deepEqual(entry.js.slice(0, 3), ["lists.js", "adult-sites.js", "shared.js"]);
  for (const host of ["google.com", "bing.com", "duckduckgo.com", "search.brave.com", "search.yahoo.com"]) assert.ok(entry.matches.some((m) => m.includes(host)), host);
});

// ── Exceptions ──

test("'black' before a hair or clothing word is not a match, in any capitalization", () => {
  const m = kwfBuildMatcher(["Black", "Black girl", "Big Black Cock"], true, kwfActiveExceptions(kwfResolve(null)));
  for (const t of ["black hair", "a black dress", "black stockings", "black-haired girl", "black t-shirt", "black thong", "black_hair", "black   boots", "Black hair", "BLACK HAIR", "Black Dress", "black latex", "black leather", "Black Lace", "black silk", "black satin", "Black Denim"])
    assert.equal(hit(m, t), null, t);
  for (const t of ["black", "black guy", "black girl", "black cock", "Black Guy", "black hairy", "Big Black Cock"])
    assert.ok(hit(m, t), t);
});

test("a later 'black' still matches after an excepted one", () => {
  const m = kwfBuildMatcher(["Black"], true, kwfActiveExceptions(kwfResolve(null)));
  assert.equal(hit(m, "black hair and black guy"), "black");
  assert.equal(hit(m, "black dress, black socks"), null);
});

test("without the Black list the exception is gone", () => {
  assert.ok(kwfActiveExceptions(kwfResolve(null)).length >= 1);
  assert.equal(kwfActiveExceptions(kwfResolve({ lists: { "ib-black": false } })).length, 0);
  const m = kwfBuildMatcher(["Black"], true, []);
  assert.ok(hit(m, "black hair"));
});

test("exceptions work in other languages (full default catalog)", () => {
  const s = kwfResolve(null);
  const m = kwfBuildMatcher(kwfActiveTerms(s), true, kwfActiveExceptions(s));
  const none = [
    "schwarze Haare", "Schwarze Strümpfe", "schwarzes Kleid".replace("schwarzes", "schwarze"),
    "pelo negro", "vestido negro", "botas negras", "lencería negra", "medias negras",
    "robe noire", "bottes noires", "lingerie noire",
    "capelli neri", "vestito nero", "calze nere",
    "cabelo preto", "vestido preto", "meias pretas",
    "zwart haar", "zwarte jurk", "zwarte laarzen",
    "чёрные волосы", "Чёрная юбка", "чёрные чулки",
    "czarne włosy", "czarna sukienka",
    "siyah saç", "siyah elbise",
    "ブラックドレス", "ブラックストッキング", "ブラックヘア",
    "شعر أسود", "فستان أسود", "ملابس داخلية سوداء",
    "rambut hitam", "gaun hitam", "celana dalam hitam"
  ];
  const some = [
    "schwarze Frau", "mujer negra", "femme noire", "ragazza nera", "mulher preta", "zwarte man", "чёрная девушка",
    "czarna dziewczyna", "siyah kadın", "ブラック", "رجل أسود", "pria hitam", "hombre negro"
  ];
  for (const t of none) assert.equal(hit(m, t), null, t);
  for (const t of some) assert.ok(hit(m, t), t);
});

test("a rule can look at the word before a term", () => {
  const rules = [{ terms: ["Negra"], prev: ["pelo", "ropa interior"] }];
  const m = kwfBuildMatcher(["Negra"], true, rules);
  assert.equal(hit(m, "pelo negra"), null);
  assert.equal(hit(m, "ropa-interior negra"), null);
  assert.ok(hit(m, "mujer negra"));
  assert.ok(hit(m, "pelopelo negra".replace("pelopelo", "superpelo")));
});

test("a few descriptive words may sit between 'black' and the clothing word", () => {
  const s = kwfResolve(null);
  const m = kwfBuildMatcher(["Black", "Black girl", "Black guy"], true, kwfActiveExceptions(s));
  for (const t of ["black seamed stockings", "Black Seamed Stockings", "black long hair", "black sheer lace trimmed panties", "black and white stockings", "black thigh high boots"])
    assert.equal(hit(m, t), null, t);
  for (const t of ["black guy in stockings", "black man wearing stockings", "black cock in stockings", "black woman with long hair", "black girl in black stockings", "black very very very long stockings", "black guy"])
    assert.ok(hit(m, t), t);
});

test("trans slang compounds and phrasings are caught (full default catalog)", () => {
  const s = kwfResolve(null);
  const m = kwfBuildMatcher(kwfActiveTerms(s), true, kwfActiveExceptions(s));
  for (const x of ["babecock", "Babe cock", "girlcock", "Girl-cock compilation", "femcock", "ladycock", "shecock", "girldick", "dickgirl",
    "cuntboy", "chicks with dicks", "chix with dix", "girl with a dick", "woman with a cock", "tgirl", "T-Girl", "T girl", "transfem",
    "Transmasc", "trans man", "transbabe", "MTF", "FTM", "kathoey", "hermaphrodite", "chica con pene", "TS Madison", "trap", "Traps", "hot trap"])
    assert.ok(hit(m, x), x);
  for (const x of ["babe cocktail", "girl cockatoo", "mtf", "ts", "Ts", "trapeze", "trapped", "transformer", "the girl dickens"])
    assert.equal(hit(m, x), null, x);
});
