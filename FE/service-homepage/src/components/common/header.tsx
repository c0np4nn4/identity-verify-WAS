'use client';

import Link from 'next/link';
import useUserStore from '@/api/stores/useUserStore';


export default function Header() {
  const {nickname, logout} = useUserStore();

  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">Service Homepage</h1>
      {nickname ?
       (<nav className={'flex gap-x-4'}>
         <p>{nickname}</p>
         <button className={'p-2 bg-amber-200 rounded-2xl'} onClick={logout}>로그아웃</button>
       </nav>)
        : (<nav className={'flex gap-x-4'}>
          <Link href="/register">회원가입</Link>
          <Link href="/login">로그인</Link>
        </nav>)}
    </header>
  );
}