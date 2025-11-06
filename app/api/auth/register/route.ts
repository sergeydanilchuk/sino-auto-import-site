export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { createSession, COOKIE_NAME } from '@/lib/auth';
export const runtime = 'nodejs';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { email, password, name } = schema.parse(await req.json());

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 409 });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, name },
      select: { id: true, email: true, role: true },
    });

    const token = await createSession(user);
    const res = NextResponse.json({ user });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60*60*24*30,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
}
