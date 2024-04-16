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
        <main className="flex flex-col items-center justify-cetner p-24">
            <h1 className="text-4xl font-bold">Welcome to Service Client</h1>
            <p className="text-lg">This is a Home Page.</p>
            <button
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={sendMessageToExtension}
            >
                크롬 지갑과 통신하기
            </button>
        </main>
    );
}
