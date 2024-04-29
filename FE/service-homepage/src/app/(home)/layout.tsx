'use client';

import NavFooter from '@/app/_component/NavFooter';
import useUserInfoStore from '@/stores/useUserInfoStore';
import { useToast } from '@/stores/useToastStore';
import { useRouter } from 'next/navigation';
import Toast from '@/app/_component/Toast';
import { useEffect } from 'react';
import { getCheckLogin, getUserInfo } from '@/api/Auth';
import { IUserInfo } from '@/types/auth';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userState = useUserInfoStore((state) => state);
    const openToast = useToast((state) => state.openToast);
    const router = useRouter();

    useEffect(
        function checkLoginEffect() {
            const fetchMe = async () => {
                const res = await getUserInfo();
                if (res.status <= 200) {
                    console.log(res.data.data);
                    return res.data.data.userInfo;
                }
                return null;
            };

            const fetchCheckLogin = async () => {
                const res = await getCheckLogin();
                if (res.status <= 300) {
                    console.log(res.data.data);
                    const res2 = await fetchMe();
                    console.log(res2);
                    if (res2) {
                        userState.login(res2 as IUserInfo);
                    }
                } else {
                    openToast('로그인이 필요합니다!', 'error', () => {
                        router.push('/login');
                    });
                }
            };

            if (!userState.userInfo) {
                fetchCheckLogin();
            }
        },
        [userState.userInfo]
    );

    return (
        <>
            <Toast />
            {children}
            <NavFooter />
        </>
    );
}
