"use client";

import { useEffect } from "react";

// Marks the duplicate history entry pushed so the back button can be intercepted.
const SENTINEL_KEY = "__leaveGuard";

// Asks for confirmation before the user leaves the page while `active` is true.
// Covers reloads/tab closes, in-app link clicks, and the browser back button.
export function useLeaveGuard(active: boolean, message: string) {
  useEffect(() => {
    if (!active) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    // Capture phase, so this runs before next/link starts a client-side navigation.
    const handleLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      // External links unload the page, which beforeunload already covers.
      if (anchor.origin !== window.location.origin) return;
      if (
        anchor.pathname === window.location.pathname &&
        anchor.search === window.location.search
      ) {
        return;
      }
      if (!window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // The browser back button is a client-side navigation too, so beforeunload never
    // fires, and the app router's popstate listener (registered first, and flushed
    // synchronously by React) has already swapped the page out before ours runs.
    // So park a duplicate entry for this page on top of history: back then only pops
    // to this same page, and we decide whether to really go back.
    const guardedUrl = window.location.href;
    const baseState = window.history.state;
    if (!baseState?.[SENTINEL_KEY]) {
      window.history.pushState({ ...baseState, [SENTINEL_KEY]: true }, "", guardedUrl);
    }
    let leaving = false;
    const handlePopState = (event: PopStateEvent) => {
      // Only react to stepping off our duplicate entry onto this same page.
      if (leaving || window.location.href !== guardedUrl || event.state?.[SENTINEL_KEY]) {
        return;
      }
      if (window.confirm(message)) {
        leaving = true;
        window.history.back();
      } else {
        window.history.pushState({ ...event.state, [SENTINEL_KEY]: true }, "", guardedUrl);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleLinkClick, true);
    window.addEventListener("popstate", handlePopState, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick, true);
      window.removeEventListener("popstate", handlePopState, true);
    };
  }, [active, message]);
}
