const INPUT_ID = "eventId";
const BTN_ID = "lookupButton";
const ERR_ID = "error";
const ENCYCLOPEDIA_ID = "openEncyclopedia";

const BASE_URL = "https://www.ultimatewindowssecurity.com/securitylog/encyclopedia/";
const EVENT_URL = `${BASE_URL}event.aspx?eventid=`;

function setError(msg) {
  document.getElementById(ERR_ID).textContent = msg || "";
}

function digitsOnly(raw) {
  return String(raw || "").replace(/[^\d]/g, "");
}

function normalizeEventId(raw) {
  // 1) keep digits only
  let d = digitsOnly(raw).trim();

  // 2) strip leading zeros but keep a single zero if it's all zeros
  //    "0004624" -> "4624", "0000" -> "0"
  d = d.replace(/^0+(?=\d)/, "");
  return d;
}

function isValidEventId(id) {
  if (!id) return false;
  if (!/^\d+$/.test(id)) return false;

  const n = Number(id);
  return Number.isFinite(n) && n >= 1 && n <= 999999;
}

async function openUrl(url) {
  await browser.tabs.create({ url });
  window.close();
}

async function doLookup() {
  setError("");

  const inputEl = document.getElementById(INPUT_ID);

  // Normalize right before lookup (final safety)
  const normalized = normalizeEventId(inputEl.value);
  inputEl.value = normalized;

  if (!isValidEventId(normalized)) {
    setError("Please enter a valid numeric Event ID (e.g., 4624).");
    return;
  }

  try {
    await openUrl(`${EVENT_URL}${encodeURIComponent(normalized)}`);
  } catch (e) {
    console.error("Failed to open tab:", e);
    setError("Could not open a new tab. Please try again.");
  }
}

function wireUp() {
  const inputEl = document.getElementById(INPUT_ID);
  const btn = document.getElementById(BTN_ID);
  const encyclopediaLink = document.getElementById(ENCYCLOPEDIA_ID);

  inputEl.focus();

  const refresh = () => {
    // sanitize + normalize as the user types
    const before = inputEl.value;
    const after = normalizeEventId(before);

    // Only rewrite if needed (prevents annoying cursor jumps)
    if (after !== before) inputEl.value = after;

    btn.disabled = !isValidEventId(after);
  };

  inputEl.addEventListener("input", () => {
    setError("");
    refresh();
  });

  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      doLookup();
    }
  });

  btn.addEventListener("click", doLookup);

  encyclopediaLink.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      await openUrl(BASE_URL);
    } catch (err) {
      console.error("Failed to open encyclopedia:", err);
      setError("Could not open the encyclopedia. Please try again.");
    }
  });

  refresh();
}

document.addEventListener("DOMContentLoaded", wireUp);
