// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// THE MATRIX AWAKENS — Visitor Tracker
// Fires immediately on load so every visit is captured.
// Updates with session + click data on page close.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

let sessionStart  = Date.now();
let clickCount    = 0;
const clickTargets: string[] = [];
let initialized   = false;

function getApiUrl(): string {
  try {
    return (import.meta as any).env?.VITE_API_URL ?? "";
  } catch {
    return "";
  }
}

// ── Fire immediately on load — guarantees visit is recorded ──
function trackVisit() {
  const url = getApiUrl() + "/api/track";
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionDuration: 0,
      clickCount: 0,
      clickTargets: [],
    }),
  }).catch(() => {});
}

// ── Fire on unload — updates with real session data ──
function trackUnload() {
  const url = getApiUrl() + "/api/track";
  const payload = JSON.stringify({
    sessionDuration: Date.now() - sessionStart,
    clickCount,
    clickTargets,
  });
  try {
    // Use keepalive fetch — works across browsers, no CORS blob issue
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch { /* silent */ }
}

function handleClick(e: Event) {
  clickCount += 1;
  const target = e.target as HTMLElement;
  const label =
    target.closest("a")?.getAttribute("href") ||
    target.closest("button")?.textContent?.trim()?.substring(0, 40) ||
    target.closest("[id]")?.id ||
    target.tagName.toLowerCase();
  if (label && clickTargets.length < 50) clickTargets.push(label);
}

export function useTracker() {
  if (initialized) return;
  initialized = true;

  sessionStart  = Date.now();
  clickCount    = 0;
  clickTargets.length = 0;

  // Fire immediately — captures the visit right now
  trackVisit();

  // Track clicks throughout the session
  document.addEventListener("click", handleClick);

  // Update record on page close with real session data
  window.addEventListener("pagehide", trackUnload);
  window.addEventListener("beforeunload", trackUnload);
}