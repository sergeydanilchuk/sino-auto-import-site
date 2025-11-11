import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const items = await prisma.partCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name || !String(name).trim()) {
    return new NextResponse("name is required", { status: 400 });
  }
  const created = await prisma.partCategory.upsert({
    where: { name },
    update: {},
    create: { name },
    select: { id: true, name: true },
  });
  return NextResponse.json(created, { status: 201 });
}
