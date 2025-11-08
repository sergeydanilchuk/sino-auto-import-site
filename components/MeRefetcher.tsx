"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMe } from "@/lib/useMe";
import { notifyAuth } from "@/lib/authBus";

export default function MeRefetcher() {
  const sp = useSearchParams();
  const { mutate } = useMe();
  useEffect(() => {
    if (sp.get("refresh") === "1") {
      mutate();
      notifyAuth("profile-updated");
    }
  }, [sp, mutate]);
  return null;
}
