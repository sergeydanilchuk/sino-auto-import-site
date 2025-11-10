export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';


import { getCurrentUser } from '@/lib/getCurrentUser';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect("/");
  return <div className="p-6">Привет, админ {user.email}</div>;
}
