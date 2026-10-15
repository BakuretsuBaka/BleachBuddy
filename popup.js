const api = globalThis.chrome ?? globalThis.browser;
const $ = (id) => document.getElementById(id);

api.storage.local.get(null, (res) => {
  const s = kwfResolve(res);
  $("enabled").checked = s.enabled;
  $("mode").value = s.mode;
});

$("enabled").addEventListener("change", (e) => api.storage.local.set({ enabled: e.target.checked }));
$("mode").addEventListener("change", (e) => api.storage.local.set({ mode: e.target.value }));
$("open").addEventListener("click", () => {
  api.runtime.openOptionsPage();
  window.close();
});

const withTab = (fn) =>
  api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (tab && tab.id != null) fn(tab.id);
  });

// Copies what the filter sees on this page (card structure, tags found, lookup status) to the clipboard
$("debug").addEventListener("click", () => {
  withTab((id) => {
    api.tabs.sendMessage(id, { type: "kwf-debug" }, (info) => {
      void api.runtime.lastError;
      const text = info ? JSON.stringify(info, null, 2) : "No data: the filter is not active on this page.";
      navigator.clipboard.writeText(text).then(
        () => ($("debug").textContent = "Copied to clipboard"),
        () => ($("debug").textContent = "Copy failed")
      );
    });
  });
});

function showHits(tabId) {
  api.tabs.sendMessage(tabId, { type: "kwf-hits" }, (hits) => {
    void api.runtime.lastError;
    const list = $("hits");
    list.textContent = "";
    if (!hits || !hits.length) {
      const li = document.createElement("li");
      li.textContent = "Nothing hidden on this page.";
      list.append(li);
      return;
    }
    for (const hit of hits) {
      const li = document.createElement("li");
      const term = document.createElement("b");
      term.textContent = hit.why || "?";
      const text = document.createElement("span");
      text.textContent = hit.text;
      li.append(term, text);
      list.append(li);
    }
  });
}

// How many items the filter hid on the current tab (only works on supported sites)
withTab((tabId) => {
  api.tabs.sendMessage(tabId, { type: "kwf-count" }, (resp) => {
    void api.runtime.lastError; // no content script on this page
    $("count").textContent = resp ? `Hidden on this page: ${resp.count}` : "Not active on this page";
    if (!resp) return;

    // Pause the filter for this site only
    $("pauseRow").hidden = false;
    $("pauseLabel").textContent = `Pause on ${resp.host}`;
    $("pause").checked = resp.paused;
    $("pause").addEventListener("change", (e) => {
      api.storage.local.get("pausedSites", (res) => {
        const set = new Set(kwfResolve(res).pausedSites);
        if (e.target.checked) set.add(resp.host);
        else set.delete(resp.host);
        api.storage.local.set({ pausedSites: [...set] }, () => setTimeout(() => api.tabs.sendMessage(tabId, { type: "kwf-count" }, (r) => {
          void api.runtime.lastError;
          if (r) $("count").textContent = `Hidden on this page: ${r.count}`;
        }), 300));
      });
    });

    // Reveal / explain what was hidden
    $("hitTools").hidden = false;
    let revealed = !!resp.revealed;
    const label = () => ($("reveal").textContent = revealed ? "Hide them again" : "Show hidden items (outlined)");
    label();
    $("reveal").addEventListener("click", () => {
      revealed = !revealed;
      api.tabs.sendMessage(tabId, { type: "kwf-reveal", on: revealed }, () => void api.runtime.lastError);
      label();
    });
    $("why").addEventListener("toggle", () => {
      if ($("why").open) showHits(tabId);
    });
  });
});
