// `chrome` supports callbacks in both Chrome and Firefox
const api = globalThis.chrome ?? globalThis.browser;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "value" || k === "checked") el[k] = v;
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat()) if (kid != null) el.append(kid.nodeType ? kid : document.createTextNode(kid));
  return el;
}

let settings = kwfResolve(null);
let query = "";
const expanded = new Set();
const topicCountEls = new Map();
let matcherCache = null;

const fold = (s) => kwfFold(s).toLowerCase();

function save() {
  matcherCache = null;
  api.storage.local.set(settings);
  updateSummary();
  runTester();
}

function updateSummary() {
  const n = kwfActiveTerms(settings).length;
  const sites = kwfActiveSites(settings);
  const k = sites.domains.length + sites.words.length;
  $("#summary").textContent = `${n} term${n === 1 ? "" : "s"} active` + (k ? ` · ${k} site${k === 1 ? "" : "s"} blocked` : "");
}

function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

function switchEl(checked, onChange, title) {
  const input = h("input", { type: "checkbox" });
  input.checked = checked;
  input.addEventListener("change", () => onChange(input.checked));
  return h("label", { class: "switch", title: title || "" }, input, h("span", { class: "slider" }));
}

// ───────────────────────────── Filter lists

const isItemOff = (listId, item) => kwfDisabledSet(settings, listId).has(kwfLower(item));

function setItemsOff(listId, items, off) {
  const current = kwfDisabledSet(settings, listId);
  for (const item of items) {
    if (off) current.add(kwfLower(item));
    else current.delete(kwfLower(item));
  }
  // Keep the original spelling for readability in exports
  const byLower = new Map(kwfCatalogLists().find((l) => l.id === listId).items.map((i) => [kwfLower(i), i]));
  settings.disabledItems[listId] = [...current].map((k) => byLower.get(k) || k);
  if (!settings.disabledItems[listId].length) delete settings.disabledItems[listId];
}

function activeCount(list) {
  const off = kwfDisabledSet(settings, list.id);
  return list.items.filter((i) => !off.has(kwfLower(i))).length;
}

function updateTopicCounts() {
  for (const topic of KWF_CATALOG) {
    const el = topicCountEls.get(topic.id);
    if (!el) continue;
    const on = topic.lists.filter((l) => kwfListEnabled(settings, l)).length;
    el.textContent = `${on} of ${topic.lists.length} lists on`;
  }
}

function renderRow(list, visibleItems, searching) {
  const open = expanded.has(list.id) || (searching && visibleItems.length > 0);
  const row = h("div", { class: "list-row" + (open ? " open" : "") + (kwfListEnabled(settings, list) ? "" : " off") });

  const count = h("span", { class: "count" });
  const refreshCount = () => (count.textContent = `${activeCount(list)} / ${list.items.length}`);
  refreshCount();

  const sw = switchEl(
    kwfListEnabled(settings, list),
    (on) => {
      settings.lists[list.id] = on;
      row.classList.toggle("off", !on);
      updateTopicCounts();
      save();
    },
    "Use this list"
  );

  const toggle = h(
    "button",
    {
      class: "row-toggle",
      type: "button",
      onclick: () => {
        const nowOpen = row.classList.toggle("open");
        if (nowOpen) {
          expanded.add(list.id);
          buildBody();
        } else expanded.delete(list.id);
      }
    },
    h("span", { class: "chev" }, "▸"),
    h("span", { class: "row-name" }, list.name),
    h("span", { class: "badge" }, KWF_KINDS[list.kind] || list.kind)
  );

  const body = h("div", { class: "row-body" });
  let built = false;

  function buildBody() {
    if (built) return;
    built = true;
    const chips = h("div", { class: "chips" });
    const renderChips = () => {
      chips.textContent = "";
      for (const item of visibleItems) {
        const cs = list.kind !== "sites" && item.startsWith("=");
        const chip = h(
          "button",
          { class: "chip" + (isItemOff(list.id, item) ? " off" : ""), type: "button", title: cs ? "Case-sensitive. Click to include / exclude" : "Click to include / exclude" },
          cs ? item.slice(1) : item,
          cs ? h("sup", {}, " Aa") : null
        );
        chip.addEventListener("click", () => {
          setItemsOff(list.id, [item], !isItemOff(list.id, item));
          chip.classList.toggle("off", isItemOff(list.id, item));
          refreshCount();
          save();
        });
        chips.append(chip);
      }
    };
    renderChips();

    const bulk = (off) => () => {
      setItemsOff(list.id, visibleItems, off);
      renderChips();
      refreshCount();
      save();
    };

    body.append(
      h("p", { class: "row-desc" }, list.description || ""),
      h(
        "div",
        { class: "row-actions" },
        h("button", { type: "button", onclick: bulk(false) }, searching ? "Include shown" : "Include all"),
        h("button", { type: "button", onclick: bulk(true) }, searching ? "Exclude shown" : "Exclude all")
      ),
      chips
    );
  }
  if (open) buildBody();

  row.append(h("div", { class: "row-head" }, sw, toggle, count), body);
  return row;
}

function renderTopic(topic, rows) {
  const countEl = h("span", { class: "count" });
  topicCountEls.set(topic.id, countEl);

  const master = switchEl(
    topic.lists.every((l) => kwfListEnabled(settings, l)),
    (on) => {
      for (const l of topic.lists) settings.lists[l.id] = on;
      save();
      renderCatalog();
    },
    "Turn every list in this topic on or off"
  );

  return h(
    "section",
    { class: "card" },
    h(
      "div",
      { class: "card-head" },
      h("div", { class: "grow" }, h("h2", {}, topic.name), h("p", {}, topic.description)),
      countEl,
      master
    ),
    rows
  );
}

function renderCatalog() {
  const root = $("#catalog");
  root.textContent = "";
  topicCountEls.clear();
  const q = fold(query).trim();
  let shown = 0;

  for (const topic of KWF_CATALOG) {
    const rows = [];
    for (const list of topic.lists) {
      const hits = q ? list.items.filter((i) => fold(i).replace(/^=/, "").includes(q)) : list.items;
      const nameHit = q && fold(list.name).includes(q);
      if (q && !hits.length && !nameHit) continue;
      rows.push(renderRow(list, q ? hits : list.items, !!q));
    }
    if (!rows.length) continue;
    shown++;
    root.append(renderTopic(topic, rows));
  }
  if (!shown) root.append(h("div", { class: "empty" }, "No lists or terms match your search."));
  updateTopicCounts();
}

// ───────────────────────────── My lists

const parseItems = (text) => {
  const seen = new Set();
  return text
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter((s) => s && !seen.has(s.toLowerCase()) && seen.add(s.toLowerCase()));
};

function newCustomList(name, items, kind) {
  const list = { id: "custom-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), name, enabled: true, kind: kind || "keywords", items };
  settings.customLists.push(list);
  save();
  renderCustom();
  return list;
}

function renderCustom() {
  const root = $("#customLists");
  root.textContent = "";
  if (!settings.customLists.length) {
    root.append(h("div", { class: "empty" }, "No lists yet. Create one with “New list”."));
    return;
  }

  for (const list of settings.customLists) {
    const count = h("span", { class: "count" }, `${list.items.length} ${list.kind === "sites" ? "sites" : "terms"}`);
    const name = h("input", { type: "text", placeholder: "List name" });
    name.value = list.name;
    name.addEventListener(
      "input",
      debounce(() => {
        list.name = name.value.trim() || "Untitled list";
        save();
      }, 300)
    );

    const kindSel = h(
      "select",
      { title: "What the entries are" },
      h("option", { value: "keywords" }, "Keywords, names"),
      h("option", { value: "sites" }, "Whole sites")
    );
    kindSel.value = list.kind === "sites" ? "sites" : "keywords";
    const placeholders = {
      keywords: "One term per line, e.g.\nsome keyword\nSome Studio\nStage Name\n=CaseSensitive",
      sites: "One site per line, e.g.\nexample.com\n*somewords*"
    };
    const area = h("textarea", { placeholder: placeholders[kindSel.value], spellcheck: "false" });
    kindSel.addEventListener("change", () => {
      list.kind = kindSel.value;
      area.placeholder = placeholders[list.kind];
      save();
    });
    area.value = list.items.join("\n");
    area.addEventListener(
      "input",
      debounce(() => {
        list.items = parseItems(area.value);
        count.textContent = `${list.items.length} ${list.kind === "sites" ? "sites" : "terms"}`;
        save();
      }, 400)
    );

    const sw = switchEl(list.enabled !== false, (on) => {
      list.enabled = on;
      save();
    }, "Use this list");

    const del = h(
      "button",
      {
        class: "danger",
        type: "button",
        onclick: () => {
          if (!confirm(`Delete the list “${list.name}”?`)) return;
          settings.customLists = settings.customLists.filter((l) => l.id !== list.id);
          save();
          renderCustom();
        }
      },
      "Delete"
    );

    root.append(
      h(
        "section",
        { class: "card pad" },
        h("div", { class: "custom-head" }, sw, name, kindSel, del),
        area,
        h("div", { class: "custom-foot" }, count)
      )
    );
  }
}

// ───────────────────────────── Matching

function getMatcher() {
  if (!matcherCache) matcherCache = kwfBuildMatcher(kwfActiveTerms(settings), settings.wholeWord);
  return matcherCache;
}

function runTester() {
  const input = $("#tester");
  const out = $("#testerResult");
  if (!input || !out) return;
  const text = input.value;
  out.className = "tester-result";
  if (!text.trim()) {
    out.classList.add("muted");
    out.textContent = "Nothing entered yet.";
    return;
  }
  const hit = getMatcher().match(kwfFold(text));
  if (hit) {
    out.classList.add("hit");
    out.textContent = `Would be filtered (matched “${hit}”).`;
  } else {
    out.classList.add("ok");
    out.textContent = "Not filtered by your current lists.";
  }
}

function syncControls() {
  $("#enabled").checked = settings.enabled;
  $("#matchTitle").checked = settings.matchTitle;
  $("#matchTags").checked = settings.matchTags;
  $("#wholeWord").checked = settings.wholeWord;
  $("#deepTags").checked = settings.deepTags;
  $("#redditNsfwOnly").checked = settings.redditNsfwOnly;
  $("#extraSites").value = settings.extraSites.join("\n");
  $("#siteBlocking").checked = settings.siteBlocking;
  $("#holdUntilChecked").checked = settings.holdUntilChecked;
  $$("input[name=mode]").forEach((r) => (r.checked = r.value === settings.mode));
  updateSummary();
}

function renderAll() {
  syncControls();
  renderCatalog();
  renderCustom();
  runTester();
}

// ───────────────────────────── Backup

function download(filename, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = h("a", { href: url, download: filename });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsText(file);
  });
}

// ───────────────────────────── Wiring

$$("#tabs button").forEach((btn) =>
  btn.addEventListener("click", () => {
    $$("#tabs button").forEach((b) => b.classList.toggle("active", b === btn));
    $$(".tab").forEach((t) => t.classList.toggle("active", t.id === "tab-" + btn.dataset.tab));
  })
);

$("#enabled").addEventListener("change", (e) => {
  settings.enabled = e.target.checked;
  save();
});
$("#clearCache").addEventListener("click", () => {
  api.storage.local.remove("kwfTagCache", () => {
    $("#clearCache").textContent = "Cleared";
    setTimeout(() => ($("#clearCache").textContent = "Clear cached tags"), 1500);
  });
});
["matchTitle", "matchTags", "wholeWord", "deepTags", "holdUntilChecked", "siteBlocking", "redditNsfwOnly"].forEach((id) =>
  $("#" + id).addEventListener("change", (e) => {
    settings[id] = e.target.checked;
    save();
  })
);
$$("input[name=mode]").forEach((r) =>
  r.addEventListener("change", () => {
    if (r.checked) {
      settings.mode = r.value;
      save();
    }
  })
);

$("#search").addEventListener(
  "input",
  debounce((e) => {
    query = e.target.value;
    renderCatalog();
  }, 150)
);

const setAllLists = (on) => {
  for (const l of kwfCatalogLists()) settings.lists[l.id] = on;
  save();
  renderCatalog();
};
$("#enableAll").addEventListener("click", () => setAllLists(true));
$("#disableAll").addEventListener("click", () => setAllLists(false));

$("#newList").addEventListener("click", () => {
  newCustomList("My list", []);
  const areas = $$("#customLists textarea");
  if (areas.length) areas[areas.length - 1].focus();
});
$("#importList").addEventListener("click", () => $("#importListFile").click());
$("#importListFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  newCustomList(file.name.replace(/\.[^.]+$/, "") || "Imported list", parseItems(await readFile(file)));
});

$("#tester").addEventListener("input", runTester);

$("#export").addEventListener("click", () =>
  download("bleachbuddy-settings.json", JSON.stringify({ keywordFilter: 1, settings }, null, 2), "application/json")
);
$("#import").addEventListener("click", () => $("#importFile").click());
$("#importFile").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  try {
    const parsed = JSON.parse(await readFile(file));
    settings = kwfResolve(parsed.settings || parsed);
    save();
    renderAll();
  } catch {
    alert("That file could not be read as BleachBuddy settings.");
  }
});
$("#reset").addEventListener("click", () => {
  if (!confirm("Reset all settings and delete your own lists?")) return;
  api.storage.local.clear(() => {
    settings = kwfResolve(null);
    matcherCache = null;
    renderAll();
  });
});

// Optional permission that lets blocked sites show the "Site blocked" page
function refreshRedirectState() {
  if (!api.permissions || !api.permissions.contains) return;
  api.permissions.contains({ origins: ["<all_urls>"] }, (ok) => {
    void api.runtime.lastError;
    $("#siteRedirect").checked = !!ok;
    $("#grantRedirect").hidden = !!ok;
  });
}
$("#grantRedirect").addEventListener("click", () => {
  api.permissions.request({ origins: ["<all_urls>"] }, () => {
    void api.runtime.lastError;
    refreshRedirectState();
  });
});
refreshRedirectState();

// Booru-style tag export
function boorusTags() {
  const seen = new Set();
  for (const raw of kwfActiveTerms(settings)) {
    if (raw.startsWith("=") || KWF_SUBSTRING_SCRIPTS.test(raw)) continue;
    const t = kwfFold(raw).toLowerCase().trim().replace(/[\s]+/g, "_");
    if (/^[a-z0-9_()'.!\-]+$/.test(t)) seen.add(t);
  }
  return [...seen];
}
const copyTags = (sep) => () => {
  const tags = boorusTags();
  navigator.clipboard.writeText(tags.join(sep)).then(
    () => ($("#tagStatus").textContent = `Copied ${tags.length} tags.`),
    () => ($("#tagStatus").textContent = "Copy failed.")
  );
};
$("#copyTags").addEventListener("click", copyTags("\n"));
$("#copyTagsSpace").addEventListener("click", copyTags(" "));

// Supported sites
const manifestSites = (api.runtime.getManifest().content_scripts || []).flatMap((c) => c.matches || []);
const siteNames = [...new Set(manifestSites.map((m) => m.replace(/^\*:\/\/\*\./, "").replace(/\/\*$/, "")))].sort();
$("#siteCount").textContent = `${siteNames.length} sites`;
siteNames.forEach((n) => $("#builtinSites").append(h("span", { class: "chip", style: "cursor:default" }, n)));

const parseDomains = (text) => [
  ...new Set(
    text
      .split(/[\s,;]+/)
      .map((d) => d.trim().toLowerCase().replace(/^[a-z]+:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, ""))
      .filter((d) => /^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d))
  )
];

$("#saveExtra").addEventListener("click", () => {
  const domains = parseDomains($("#extraSites").value);
  const status = $("#extraStatus");
  const finish = (msg) => {
    status.textContent = msg;
    $("#extraSites").value = settings.extraSites.join("\n");
  };
  const origins = domains.map((d) => `*://*.${d}/*`);
  const store = (granted) => {
    settings.extraSites = domains.filter((d, i) => granted[i]);
    save();
    finish(domains.length && !settings.extraSites.length ? "Permission was not granted." : `${settings.extraSites.length} extra site(s) saved.`);
  };
  if (!origins.length) return store([]);
  api.permissions.request({ origins }, (ok) => {
    void api.runtime.lastError;
    if (ok) return store(origins.map(() => true));
    // Fall back to whatever was granted before
    Promise.all(origins.map((o) => new Promise((res) => api.permissions.contains({ origins: [o] }, (r) => res(!!r))))).then(store);
  });
});

// The popup can change the master switch and mode; keep the page in sync
api.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  for (const key of ["enabled", "mode"]) if (changes[key]) settings[key] = changes[key].newValue;
  syncControls();
});

api.storage.local.get(null, (res) => {
  settings = kwfResolve(res);
  renderAll();
});
