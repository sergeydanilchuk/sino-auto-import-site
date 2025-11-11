export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: { id: string } };

// Получение одной детали
export async function GET(_req: Request, { params }: Ctx) {
  const item = await prisma.part.findUnique({
    where: { id: params.id },
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

  if (!item) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json({ item });
}

// Удаление детали по параметру пути
export async function DELETE(_req: Request, { params }: Ctx) {
  try {
    await prisma.part.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") return new NextResponse("Not found", { status: 404 });
    return new NextResponse(e?.message ?? "Bad Request", { status: 400 });
  }
}
