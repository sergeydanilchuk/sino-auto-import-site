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

// 🔹 Добавлен тип "profile-updated"
export type AuthBusEvent = "login" | "logout" | "register" | "profile-updated";

export function notifyAuth(event: AuthBusEvent) {
  const bus = getAuthBus();
  if (!bus) return;
  bus.postMessage({ event, ts: Date.now() });
}
