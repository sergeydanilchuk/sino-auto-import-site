import { getCurrentUser } from '@/lib/getCurrentUser';
import Link from 'next/link';

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="p-6 space-y-2">
        <p>Доступ запрещён.</p>
        <Link className="underline" href="/login">Войти</Link>
      </div>
    );
  }
  return <div className="p-6">Привет, админ {user.email}</div>;
}
