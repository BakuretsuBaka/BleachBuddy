const api = globalThis.chrome ?? globalThis.browser;

// The blocked address arrives as "?u=<url>"; only its host is shown
try {
  const raw = location.search.replace(/^\?u=/, "") + location.hash;
  document.getElementById("host").textContent = new URL(raw).hostname;
} catch (e) { /* keep the generic text */ }

document.getElementById("back").addEventListener("click", () => {
  if (history.length > 1) history.back();
  else window.close();
});
document.getElementById("settings").addEventListener("click", () => api.runtime.openOptionsPage());
