export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json(
    { ok: true, user: null },
    { headers: { "Cache-Control": "no-store" } }
  );

  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return res;
}

