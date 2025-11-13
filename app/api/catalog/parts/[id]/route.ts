// app/api/catalog/parts/[id]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { id: string };

// Получение одной детали
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
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

// Частичное обновление детали (редактирование)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    name,
    sku,
    price,
    stock,
    status,
    categoryId,
    partNumber,
    description,
  } = body as {
    name?: string;
    sku?: string;
    price?: number;
    stock?: number;
    status?: "IN_STOCK" | "ON_ORDER";
    categoryId?: string | null;
    partNumber?: string;
    description?: string;
  };

  const data: any = {};

  if (typeof name === "string") data.name = name.trim();
  if (typeof sku === "string") data.sku = sku.trim();
  if (typeof partNumber === "string") data.partNumber = partNumber.trim();
  if (typeof description === "string") data.description = description.trim();

  if (typeof price === "number" && !Number.isNaN(price)) {
    data.price = price;
  }
  if (typeof stock === "number" && Number.isInteger(stock)) {
    data.stock = stock;
  }
  if (status === "IN_STOCK" || status === "ON_ORDER") {
    data.status = status;
  }

  // categoryId: строка -> привязать к категории, null -> "без категории"
  if (categoryId === null) {
    data.categoryId = null;
  } else if (typeof categoryId === "string" && categoryId.trim()) {
    data.categoryId = categoryId;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No fields to update" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.part.update({
      where: { id },
      data,
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

    return NextResponse.json({ item: updated });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Bad Request" },
      { status: 400 }
    );
  }
}

// Удаление детали по параметру пути
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { id } = await params;

  try {
    await prisma.part.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: e?.message ?? "Bad Request" },
      { status: 400 }
    );
  }
}
