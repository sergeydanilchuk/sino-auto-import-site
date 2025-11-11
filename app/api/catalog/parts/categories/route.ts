// app/api/catalog/parts/categories/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  const items = await prisma.partCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body as { name?: string })?.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const created = await prisma.partCategory.upsert({
    where: { name },
    update: {},
    create: { name },
    select: { id: true, name: true },
  });

  return NextResponse.json(created, { status: 201 });
}