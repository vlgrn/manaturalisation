// Thin gtag wrapper for client components. The base Google tag (G-3ZX54ZFR16)
// is loaded in app/layout.tsx; these helpers fire events into it.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fires a gtag event. Returns true if the tag was ready and the event was sent,
// false otherwise (server-side, or gtag not yet loaded).
export function trackEvent(name: string, params: Record<string, unknown> = {}): boolean {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return false;
  window.gtag("event", name, params);
  return true;
}

// Fires `name` at most once per `dedupeKey` (persisted in localStorage), so a
// conversion isn't re-counted on every refresh. The dedupe flag is only stored
// once the event actually fires, so a not-yet-loaded tag retries next mount.
export function trackOnce(
  name: string,
  dedupeKey: string,
  params: Record<string, unknown> = {},
): void {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(dedupeKey)) return;
  } catch {
    // localStorage unavailable (private mode); fire without dedupe.
  }
  if (trackEvent(name, params)) {
    try {
      localStorage.setItem(dedupeKey, "1");
    } catch {
      // ignore persistence failure
    }
  }
}

export {};
