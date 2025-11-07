export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const noStore = { headers: { "Cache-Control": "no-store" } };

  if (!token) return NextResponse.json({ user: null }, noStore);

  try {
    const s = await verifySession(token);
    if (!s?.id) return NextResponse.json({ user: null }, noStore);

    const user = await prisma.user.findUnique({
      where: { id: s.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json({ user }, noStore);
  } catch (e) {
    console.error("Auth check failed:", e);
    return NextResponse.json({ user: null }, noStore);
  }
}
