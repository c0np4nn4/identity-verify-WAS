'use client';

import Link from 'next/link';
import {useEffect} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import useUserStore from '@/stores/useUserStore';
import useWalletStore from '@/stores/useWalletStore';
import {getMe, postLogout} from '@/api/Auth';


export default function Header() {
  const {nickname, login, logout} = useUserStore();
  const {isInstalled, setInstalled} = useWalletStore();
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = async () => {
    try {
      const res = await postLogout();
      if (res.data.result) {
        console.log(res.data.message);
        logout();
        router.push('/');
      } else {
        console.error(res.data.message);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(function getMeEffect() {
    const fetch = async () => {
      const res = await getMe();
      const data = res.data;
      if (data.result) {
        console.log(data.data);
        login(data.data.id, data.data.nickname);
        if (pathname === '/login' || pathname === '/register') {
          router.push('/');
        }
      }
      console.log(data);
    };

    fetch();
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => {
      const element = document.getElementById(process.env.NEXT_PUBLIC_WALLET_EXTENSION_ID as string);
      if (element) {
        setInstalled(true);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (isInstalled) {
      console.log('installed');
    }
  }, [isInstalled]);

  const onConnectWallet = () => {
    alert('지갑 연결!');
  };

  const onInstallWallet = () => {
    alert('크롬 웹스토어로 이동합니다!');
  }

  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">Service Homepage</h1>
      <nav className={'flex gap-x-4 justify-center items-center'}>
        {nickname ?
          (<>
              <p>{nickname}</p>
              <button className={'p-2 bg-amber-200 rounded-2xl'} onClick={onLogout}>로그아웃</button>
            </>
          )
          : (<>
              <Link href="/register">회원가입</Link>
              <Link href="/login">로그인</Link></>
          )}
        {isInstalled ?
          <button className={'p-2 bg-black text-white rounded-2xl'} onClick={onConnectWallet}>Connect Wallet</button>
          : <button className={'p-2 bg-gray-200 rounded-2xl'} onClick={onInstallWallet}>Install Wallet</button>}
      </nav>
    </header>
  );
}