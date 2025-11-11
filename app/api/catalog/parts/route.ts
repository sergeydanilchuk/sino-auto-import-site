export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { put } from "@vercel/blob";

// GET /api/catalog/parts?q=&status=&category=
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const status = url.searchParams.get("status"); // "IN_STOCK" | "ON_ORDER" | null
  const category = url.searchParams.get("category"); // categoryId | null

  const where: any = {};
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { sku: { contains: q, mode: "insensitive" } },
      { partNumber: { contains: q, mode: "insensitive" } },
    ];
  }
  if (status && (status === "IN_STOCK" || status === "ON_ORDER")) where.status = status;
  if (category && category !== "all") where.categoryId = category;

  const items = await prisma.part.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      sku: true,
      price: true,
      stock: true,
      status: true,
      imageUrl: true,
      category: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ items });
}

// POST /api/catalog/parts  (JSON или multipart/form-data)
export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    let body:
      | {
          name: string;
          partNumber?: string | null;
          categoryId?: string | null;
          newCategoryName?: string | null;
          imageUrl?: string | null;
          price: string | number;
          stock?: string | number;
          status: "IN_STOCK" | "ON_ORDER";
          description?: string | null;
        }
      | null = null;

    let file: File | null = null;

    if (ct.includes("multipart/form-data")) {
      const fd = await req.formData();
      body = {
        name: String(fd.get("name") ?? ""),
        partNumber: fd.get("partNumber") ? String(fd.get("partNumber")) : null,
        categoryId: fd.get("categoryId") ? String(fd.get("categoryId")) : null,
        newCategoryName: fd.get("newCategoryName") ? String(fd.get("newCategoryName")) : null,
        imageUrl: null,
        price: String(fd.get("price") ?? "0"),
        stock: String(fd.get("stock") ?? "0"),
        status: (fd.get("status") === "IN_STOCK" ? "IN_STOCK" : "ON_ORDER") as any,
        description: fd.get("description") ? String(fd.get("description")) : null,
      };
      const maybe = fd.get("file");
      if (maybe instanceof File && maybe.size > 0) file = maybe;
    } else {
      body = (await req.json()) as any;
    }

    if (!body?.name) return new NextResponse("name is required", { status: 400 });
    if (body.categoryId && body.newCategoryName) {
      return new NextResponse("Укажите либо categoryId, либо newCategoryName, но не оба", { status: 400 });
    }

    if (file) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const { url } = await put(`parts/${crypto.randomUUID()}.${ext}`, file, {
        access: "public",
        addRandomSuffix: false,
      });
      body.imageUrl = url;
    }

    const data: any = {
      name: String(body.name),
      partNumber: body.partNumber ? String(body.partNumber) : null,
      imageUrl: body.imageUrl ? String(body.imageUrl) : null,
      price: new Prisma.Decimal(String(body.price)),
      stock: Number(body.stock ?? 0),
      status: body.status === "IN_STOCK" ? "IN_STOCK" : "ON_ORDER",
      description: body.description ? String(body.description) : null,
    };

    if (body.categoryId) {
      data.categoryId = String(body.categoryId);
    } else if (body.newCategoryName) {
      const name = String(body.newCategoryName).trim();
      if (!name) return new NextResponse("Пустое имя категории", { status: 400 });
      data.category = { connectOrCreate: { where: { name }, create: { name } } };
    }

    const created = await prisma.part.create({
      data,
      select: { id: true, sku: true },
    });

    return NextResponse.json({ id: created.id, sku: created.sku }, { status: 201 });
  } catch (e: any) {
    return new NextResponse(e?.message ?? "Bad Request", { status: 400 });
  }
}

// DELETE /api/catalog/parts  (совместимость со старым клиентом): body { id }
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json().catch(() => ({} as any));
    if (!id) return new NextResponse("id is required", { status: 400 });

    await prisma.part.delete({ where: { id: String(id) } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "P2025") return new NextResponse("Not found", { status: 404 });
    return new NextResponse(e?.message ?? "Bad Request", { status: 400 });
  }
}
