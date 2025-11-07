"use client";

let channel: BroadcastChannel | null = null;

export function getAuthBus(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!channel) {
    try {
      channel = new BroadcastChannel("auth");
    } catch {
      channel = null;
    }
  }
  return channel;
}

export function notifyAuth(event: "login" | "logout" | "register") {
  const bus = getAuthBus();
  if (!bus) return;
  bus.postMessage({ event, ts: Date.now() });
}
