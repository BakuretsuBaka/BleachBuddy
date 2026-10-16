// Whole-site blocking: turns the active "sites" lists into declarativeNetRequest rules.
// Chrome runs this as a service worker, Firefox as an event page (it loads lists.js and shared.js itself).
if (typeof importScripts === "function") importScripts("lists.js", "shared.js");

const api = globalThis.chrome ?? globalThis.browser;
const call = (fn, ...args) => new Promise((resolve) => fn(...args, (res) => { void api.runtime.lastError; resolve(res); }));

let running = false;
let again = false;

async function sync() {
  if (running) { again = true; return; }
  running = true;
  try {
    const stored = await call(api.storage.local.get.bind(api.storage.local), null);
    const s = kwfResolve(stored);
    const dnr = api.declarativeNetRequest;
    if (!dnr) return;

    const existing = (await call(dnr.getDynamicRules.bind(dnr))) || [];
    const removeRuleIds = existing.map((r) => r.id);

    const addRules = [];
    if (s.enabled && s.siteBlocking) {
      // Always a plain block. The "Site blocked" page is shown by swapping the tab (see below), because some
      // browsers (Brave) refuse a redirect from a web address to an extension page.
      const action = { type: "block" };
      let id = 1;
      for (const cond of kwfSiteConditions(kwfActiveSites(s))) {
        if (cond.regexFilter) {
          // one rule the browser cannot compile must not take the others down with it
          const ok = await call(dnr.isRegexSupported.bind(dnr), { regex: cond.regexFilter, isCaseSensitive: false });
          if (!ok || !ok.isSupported) continue;
        }
        addRules.push({ id: id++, priority: 1, action, condition: { ...cond, resourceTypes: ["main_frame"] } });
      }
    }
    await call(dnr.updateDynamicRules.bind(dnr), { removeRuleIds, addRules });
  } finally {
    running = false;
    if (again) { again = false; sync(); }
  }
}

// "Site blocked" page: with the optional permission, a tab whose address matches a blocked site is switched to
// our own page by the extension itself (an extension may open its own pages in any browser).
let matcher = null;
async function loadMatcher() {
  const s = kwfResolve(await call(api.storage.local.get.bind(api.storage.local), null));
  if (!s.enabled || !s.siteBlocking) return (matcher = []);
  const hasPerm = !!(await call(api.permissions.contains.bind(api.permissions), { origins: ["<all_urls>"] }));
  if (!hasPerm) return (matcher = []);
  const list = [];
  for (const c of kwfSiteConditions(kwfActiveSites(s))) {
    if (c.regexFilter) list.push(new RegExp(c.regexFilter, "i"));
    else for (const d of c.requestDomains) list.push(new RegExp(`^https?://(?:[^/?#]*\\.)?${kwfReEscape(d)}(?::[0-9]+)?(?:[/?#]|$)`, "i"));
  }
  matcher = list;
}
api.tabs.onUpdated.addListener(async (tabId, change, tab) => {
  const url = change.url || (change.status ? tab.url : "");
  if (!url || !/^https?:/i.test(url)) return;
  if (!matcher) await loadMatcher();
  if (!matcher.length || !matcher.some((re) => re.test(url))) return;
  api.tabs.update(tabId, { url: api.runtime.getURL("blocked.html") + "?u=" + url }, () => void api.runtime.lastError);
});

// Extra sites the user added: register the content script for the ones whose permission was granted
async function syncExtraSites() {
  const scripting = api.scripting;
  if (!scripting || !scripting.registerContentScripts) return;
  try {
    const stored = await call(api.storage.local.get.bind(api.storage.local), "extraSites");
    const domains = Array.isArray(stored && stored.extraSites) ? stored.extraSites : [];
    const matches = [];
    for (const d of domains) {
      const pattern = `*://*.${d}/*`;
      if (await call(api.permissions.contains.bind(api.permissions), { origins: [pattern] })) matches.push(pattern);
    }
    const existing = (await call(scripting.getRegisteredContentScripts.bind(scripting), { ids: ["kwf-extra"] })) || [];
    if (existing.length) await call(scripting.unregisterContentScripts.bind(scripting), { ids: ["kwf-extra"] });
    if (matches.length) {
      await call(scripting.registerContentScripts.bind(scripting), [
        { id: "kwf-extra", matches, js: ["lists.js", "shared.js", "content.js"], css: ["content.css"], runAt: "document_idle", persistAcrossSessions: true }
      ]);
    }
  } catch (e) { /* best effort */ }
}

// Toolbar badge: how many items the content script hid in that tab
api.runtime.onMessage.addListener((msg, sender) => {
  if (!msg || msg.type !== "kwf-badge" || !sender.tab || sender.tab.id == null) return;
  const tabId = sender.tab.id;
  const action = api.action;
  if (!action || !action.setBadgeText) return;
  const text = msg.count > 0 ? (msg.count > 999 ? "999+" : String(msg.count)) : "";
  try {
    action.setBadgeText({ tabId, text }, () => void api.runtime.lastError);
    if (text) action.setBadgeBackgroundColor({ tabId, color: "#2f6fed" }, () => void api.runtime.lastError);
  } catch (e) { /* tab already closed */ }
});

function syncAll() { matcher = null; sync(); syncExtraSites(); }

api.runtime.onInstalled.addListener(syncAll);
api.runtime.onStartup.addListener(syncAll);
api.permissions.onAdded && api.permissions.onAdded.addListener(syncAll);
api.permissions.onRemoved && api.permissions.onRemoved.addListener(syncAll);
api.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  // Ignore cache-only writes (tag cache)
  if (Object.keys(changes).some((k) => Object.prototype.hasOwnProperty.call(KWF_DEFAULTS, k))) syncAll();
});
syncAll();
