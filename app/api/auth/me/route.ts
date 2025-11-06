export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from '@/lib/auth';


export const revalidate = 0; // не кэшируем маршрут

export async function GET() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null }, { headers: { 'Cache-Control': 'no-store' } });
  }
  try {
    const user = await verifySession(token);
    return NextResponse.json({ user }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ user: null }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
