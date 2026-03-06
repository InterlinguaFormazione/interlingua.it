import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

let sessionId: string | null = null;
function getSessionId(): string {
  if (!sessionId) {
    sessionId = sessionStorage.getItem("pv_sid") || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("pv_sid", sessionId);
  }
  return sessionId;
}

export function usePageTracker() {
  const [location] = useLocation();
  const lastTracked = useRef("");

  useEffect(() => {
    if (location === lastTracked.current) return;
    if (location.startsWith("/admin")) return;
    lastTracked.current = location;

    const controller = new AbortController();
    fetch("/api/track-pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: location, sessionId: getSessionId() }),
      signal: controller.signal,
    }).catch(() => {});

    return () => controller.abort();
  }, [location]);
}
