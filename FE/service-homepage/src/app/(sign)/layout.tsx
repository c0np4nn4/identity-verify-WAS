'use client';

import useUserInfoStore from '@/stores/useUserInfoStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/stores/useToastStore';

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const userInfo = useUserInfoStore((state) => state.userInfo);
    const openToast = useToast((state) => state.openToast);
    const router = useRouter();

    useEffect(
        function checkLoginEffect() {
            console.log('userInfo: ', userInfo);
            if (userInfo) {
                openToast('로그인됨', 'error', () => {
                    router.push('/pond');
                });
            }
        },
        [userInfo]
    );

    return <>{children}</>;
}
