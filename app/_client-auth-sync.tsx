"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthBus } from "@/lib/authBus";

export default function AuthSync() {
  const router = useRouter();

  useEffect(() => {
    const bus = getAuthBus();
    if (!bus) return;

    const onMsg = () => {
      router.refresh();
    };

    bus.addEventListener("message", onMsg);
    return () => bus.removeEventListener("message", onMsg);
  }, [router]);

  return null;
}
