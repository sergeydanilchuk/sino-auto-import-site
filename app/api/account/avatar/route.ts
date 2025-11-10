import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Not image" }, { status: 415 });
  if (file.size > 2_000_000) return NextResponse.json({ error: "Too large" }, { status: 413 });

  const prev = await prisma.user.findUnique({ where: { id: me.id }, select: { avatarUrl: true } });
  const key = `avatars/${me.id}/${Date.now()}`;
  const blob = await put(key, file, { access: "public" });

  await prisma.user.update({ where: { id: me.id }, data: { avatarUrl: blob.url } });

  if (prev?.avatarUrl?.includes("blob.vercel-storage.com")) {
    try { await del(prev.avatarUrl); } catch {}
  }

  return NextResponse.json({ url: blob.url, ok: true });
}
