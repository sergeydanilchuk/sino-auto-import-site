"use client";

import { useEffect, useState } from "react";

export function useMe() {
  const [me, setMe] = useState<null | { id: string; email: string; role: "USER" | "ADMIN" }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (active) setMe(data.user ?? null);
      } catch {
        if (active) setMe(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return { me, loading, setMe };
}
