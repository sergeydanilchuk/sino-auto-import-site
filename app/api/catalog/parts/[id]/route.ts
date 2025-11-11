// app/api/catalog/parts/[id]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { id: string };

// Получение одной детали
export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const item = await prisma.part.findUnique({
    where: { id },
    select: {
      id: true,
      sku: true,
      name: true,
      partNumber: true,
      price: true,
      stock: true,
      status: true,
      imageUrl: true,
      description: true,
      category: { select: { id: true, name: true } },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

// Удаление детали по параметру пути
export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  try {
    await prisma.part.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: e?.message ?? "Bad Request" }, { status: 400 });
  }
}
