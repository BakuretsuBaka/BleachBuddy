// Unit tests for the matcher, list resolution and site-blocking logic (run with `npm test`).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ctx = vm.createContext({ console });
for (const file of ["lists.js", "shared.js"]) {
  vm.runInContext(fs.readFileSync(path.join(__dirname, "..", file), "utf8"), ctx, { filename: file });
}
// `const` declarations are not properties of the context: read them out explicitly
const g = vm.runInContext(
  `({ KWF_CATALOG, KWF_DEFAULTS, kwfFold, kwfResolve, kwfActiveTerms, kwfActiveSites, kwfBuildMatcher, kwfParseSite, kwfSiteRegexes, kwfBooruTags, kwfCatalogLists, kwfListEnabled })`,
  ctx
);
const { kwfFold, kwfResolve, kwfActiveTerms, kwfActiveSites, kwfBuildMatcher, kwfParseSite, kwfSiteRegexes } = g;

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
  const [re] = kwfSiteRegexes({ domains: ["blacked.com"], words: [] }).map((r) => new RegExp(r, "i"));
  assert.ok(re.test("https://blacked.com/"));
  assert.ok(re.test("https://www.blacked.com/x?y=1#z"));
  assert.ok(re.test("http://a.b.blacked.com:8080/"));
  assert.equal(re.test("https://notblacked.com/"), false);
  assert.equal(re.test("https://blacked.com.evil.org/"), false);
  assert.equal(re.test("https://example.org/blacked.com"), false);
});

test("word patterns match inside the host only", () => {
  const re = new RegExp(kwfSiteRegexes({ domains: [], words: ["interracial"] })[0], "i");
  assert.ok(re.test("https://best-interracial-tube.net/"));
  assert.equal(re.test("https://example.org/interracial"), false);
});

test("site rules stay small enough for the browser's regex limit", () => {
  const sites = kwfActiveSites(kwfResolve(null));
  for (const r of kwfSiteRegexes(sites)) assert.ok(r.length < 1500, `regex of ${r.length} chars`);
});
