'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
    useEffect(() => {
        // 확장 앱으로부터 메시지를 받기 위한 이벤트 리스너
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'FROM_EXTENSION_TO_PAGE') {
                alert(`Message from extension: ${event.data.message}`);
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

    return (
        <main className="flex flex-col w-full h-full text-white items-center justify-center p-24 gap-y-24">
            <h1
                className="text-4xl font-bold animate-fadeIn opacity-0"
                style={{ animationDelay: '0.5s' }}
            >
                짝사랑 종이배
            </h1>
            <p
                className={'text-xl animate-fadeIn opacity-0'}
                style={{ animationDelay: '1.5s' }}
            >
                당신의 마음 속 짝사랑을 찾아보세요
            </p>
            <div
                className={'flex gap-x-4 animate-fadeIn opacity-0 mt-48'}
                style={{ animationDelay: '2.5s' }}
            >
                <Link href="/register">
                    <button
                        className={
                            'bg-white text-black px-8 py-4 rounded-6 animate-springAlways duration-300 transform ease-in-out'
                        }
                        style={{ animationDelay: '3s' }}
                    >
                        시작하기
                    </button>
                </Link>
            </div>
        </main>
    );
}
