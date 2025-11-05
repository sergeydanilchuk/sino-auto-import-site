'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const r = useRouter();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [name,setName]=useState('');
  const [err,setErr]=useState('');

  async function submit(e: any){
    e.preventDefault(); setErr('');
    const res = await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,name})});
    if(res.ok) r.push('/'); else setErr((await res.json()).error||'Ошибка');
  }

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto p-6 space-y-3">
      <h1 className="text-xl font-semibold">Регистрация</h1>
      <input className="w-full border p-2 rounded" placeholder="Имя" value={name} onChange={e=>setName(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border p-2 rounded" type="password" placeholder="Пароль (мин. 6)" value={password} onChange={e=>setPassword(e.target.value)} />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button className="w-full border p-2 rounded">Создать аккаунт</button>
    </form>
  );
}
