const MENU_ID = "lookupWindowsEvent";
const BASE_URL = "https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/";
const EVENT_URL = `${BASE_URL}event.aspx?eventid=`;

function normalizeEventId(raw) {
  // keep digits only
  let d = String(raw || "").replace(/[^\d]/g, "").trim();

  // strip leading zeros but keep a single zero if it's all zeros
  d = d.replace(/^0+(?=\d)/, "");
  return d;
}

function isValidEventId(id) {
  if (!id) return false;
  if (!/^\d+$/.test(id)) return false;

  const n = Number(id);
  return Number.isFinite(n) && n >= 1 && n <= 999999;
}

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.removeAll().catch(() => {}).finally(() => {
    browser.contextMenus.create({
      id: MENU_ID,
      title: "Lookup Windows Event ID",
      contexts: ["selection"]
    });
  });
});

browser.contextMenus.onClicked.addListener((info) => {
  const normalized = normalizeEventId(info.selectionText);

  // Ignore invalid selections (no tab)
  if (!isValidEventId(normalized)) return;

  browser.tabs.create({
    url: `${EVENT_URL}${encodeURIComponent(normalized)}`
  });
});
