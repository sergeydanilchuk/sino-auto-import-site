"use client";

import useSWR from "swr";

type Me = {
  id: string;
  email: string;
  name?: string | null;
  role: "USER" | "ADMIN";
  avatarUrl?: string | null;
};

const fetcher = (url: string) =>
  fetch(url, { credentials: "include", cache: "no-store" }).then((res) => res.json());

export function useMe() {
  const { data, isLoading, mutate } = useSWR<{ user: Me | null }>(
    "/api/auth/me",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    me: data?.user ?? null,
    loading: isLoading,
    setMe: (next: Me | null) => mutate({ user: next }, { revalidate: false }),
    mutate,
  };
}
