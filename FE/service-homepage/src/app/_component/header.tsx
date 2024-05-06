'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import useUserInfoStore from '@/stores/useUserInfoStore';
import { getUserInfo, postLogout } from '@/api/User';

export default function Header() {
    const { userInfo, logout } = useUserInfoStore();

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
    };

    useEffect(
        function getMeEffect() {
            const fetch = async () => {
                const res = await getUserInfo();
                const data = res.data;
                if (data.result) {
                    console.log(data.data);
                    if (pathname === '/login' || pathname === '/register') {
                        router.push('/');
                    }
                }
                console.log(data);
            };

            fetch();
        },
        [pathname]
    );

    return (
        <header className="flex flex-col w-full items-end p-4">
            <nav className={'flex gap-x-4 items-end'}>
                <p>안녕하세요, {userInfo!.nickname}님!</p>
            </nav>
        </header>
    );
}
