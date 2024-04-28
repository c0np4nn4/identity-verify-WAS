'use client';

import NavFooter from '@/app/_component/NavFooter';
import useUserInfoStore from '@/stores/useUserInfoStore';
import { useToast } from '@/stores/useToastStore';
import { useRouter } from 'next/navigation';
import Toast from '@/app/_component/Toast';

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userInfo = useUserInfoStore((state) => state.userInfo);
    const openToast = useToast((state) => state.openToast);
    const router = useRouter();

    if (!userInfo)
        [
            openToast('로그인이 필요합니다!', 'error', () => {
                router.push('/login');
            }),
        ];

    return (
        <>
            {' '}
            <Toast />
            {children}
            <NavFooter />
        </>
    );
}
