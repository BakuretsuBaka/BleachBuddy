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

// Copies what the filter sees on this page (card structure, tags found, lookup status) to the clipboard
$("debug").addEventListener("click", () => {
  api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || tab.id == null) return;
    api.tabs.sendMessage(tab.id, { type: "kwf-debug" }, (info) => {
      void api.runtime.lastError;
      const text = info ? JSON.stringify(info, null, 2) : "No data: the filter is not active on this page.";
      navigator.clipboard.writeText(text).then(
        () => ($("debug").textContent = "Copied to clipboard"),
        () => ($("debug").textContent = "Copy failed")
      );
    });
  });
});

// How many items the filter hid on the current tab (only works on supported sites)
api.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs && tabs[0];
  if (!tab || tab.id == null) return;
  api.tabs.sendMessage(tab.id, { type: "kwf-count" }, (resp) => {
    void api.runtime.lastError; // no content script on this page
    $("count").textContent = resp ? `Hidden on this page: ${resp.count}` : "Not active on this page";
  });
});
