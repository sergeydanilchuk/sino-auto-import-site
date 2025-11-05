import { cookies } from 'next/headers';
import { COOKIE_NAME, verifySession } from './auth';

export async function getCurrentUser() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try { return await verifySession(token); } catch { return null; }
}
