'use client';

import useWalletStore from '@/stores/useWalletStore';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import useUserInfoStore from '@/stores/useUserInfoStore';
import { useRouter } from 'next/navigation';
import { postLogout } from '@/api/User';
import { useToast } from '@/stores/useToastStore';

export default function MyPagePage() {
    const router = useRouter();
    const { isInstalled, setInstalled } = useWalletStore();
    const toastStore = useToast();
    const { userInfo, logout } = useUserInfoStore((state) => state);
    const [proof, setProof] = useState<string>('');

    useEffect(() => {
        setTimeout(() => {
            const element = document.getElementById(
                process.env.NEXT_PUBLIC_WALLET_EXTENSION_ID as string
            );
            if (element) {
                setInstalled(true);
            }
        }, 1000);
    }, []);

    useEffect(() => {
        if (isInstalled) {
            console.log('wallet is installed');
        } else {
            console.log("wallet isn't installed");
        }
    }, [isInstalled]);

    const onConnectWallet = () => {
        alert('지갑 연결!');
        sendMessageToExtension();
    };

    const onInstallWallet = () => {
        alert('크롬 웹스토어로 이동합니다!');
    };

    useEffect(() => {
        // 확장 앱으로부터 메시지를 받기 위한 이벤트 리스너
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'FROM_EXTENSION_TO_PAGE') {
                console.log(JSON.parse(event.data.message));
                alert(`Message from extension: ${event.data.message}`);
                setProof(event.data.message);
            }
        });
    }, []);

    // 버튼 클릭시 메시지 보내기
    const sendMessageToExtension = () => {
        window.postMessage(
            { type: 'FROM_PAGE', text: 'Hello, extension!' },
            '*'
        );
    };

    const onLogout = async () => {
        logout();
        await postLogout();
        toastStore.openToast('로그아웃 되었습니다.', 'success', () => {
            router.push('/');
        });
    };

    return (
        <main className="flex flex-col items-center justify-center p-24">
            <h1 className="text-40 mt-24">마이페이지</h1>
            <section className="flex flex-col gap-y-12 mt-80 w-full">
                <ProfileInfo
                    label={'닉네임'}
                    value={userInfo?.nickname as string}
                />
                <ProfileInfo label={'대학교'} value={'부산대학교'} />
                <ProfileInfo
                    label={'2차 인증'}
                    value={
                        userInfo?.isVerifiedUser ? '2차 인증 완료' : '미인증'
                    }
                />
                <div>proof: {proof}</div>
                {/*    {isInstalled ? (*/}
                {/*    <button*/}
                {/*        className={*/}
                {/*            'p-2 bg-black text-white rounded-2xl ml-auto'*/}
                {/*        }*/}
                {/*        onClick={onConnectWallet}*/}
                {/*    >*/}
                {/*        2차 인증 하러가기*/}
                {/*    </button>*/}
                {/*) : (*/}
                {/*    <button*/}
                {/*        className={'p-2 bg-gray-200 rounded-2xl ml-auto'}*/}
                {/*        onClick={onInstallWallet}*/}
                {/*    >*/}
                {/*        지갑 설치하기*/}
                {/*    </button>*/}
                {/*)}*/}
            </section>
            <section
                id={'2nd-auth-banner'}
                className="flex flex-col gap-y-12 mt-80 w-full text-indigo-500 border-2 border-indigo-500 rounded-8 p-12"
            >
                <h2 className="text-24">2차 인증</h2>
                <div className="flex w-full gap-x-8">
                    <p>
                        짝사랑 종이배 만의 블록체인과 암호학 기반의 인증
                        로직으로 2차 인증을 수행해보세요!
                    </p>
                </div>
                <div className={'flex w-full gap-x-8'}>
                    <p
                        className={
                            'font-bold text-red-600 flex items-center gap-x-4'
                        }
                    >
                        +10 <FaHeart />
                    </p>
                    <button
                        className={'p-2 underline text-blue-500 ml-auto'}
                        onClick={onConnectWallet}
                    >
                        2차 인증 하러가기
                    </button>
                </div>
            </section>
            <div className="flex gap-x-4 mt-24">
                <button
                    className={'p-2 bg-gray-200 rounded-2xl'}
                    onClick={onLogout}
                >
                    로그아웃
                </button>
            </div>
        </main>
    );
}

function ProfileInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex w-full items-center justify-between">
            <span className="text-lg text-gray-400">{label}</span>
            <span className="text-lg">{value}</span>
        </div>
    );
}
