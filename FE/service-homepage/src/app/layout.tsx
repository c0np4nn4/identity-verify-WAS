import type { Metadata } from 'next';
import './globals.css';
import PaperBoatBackground from '/public/image/paper-boat-background.png';
import Image from 'next/image';

export const metadata: Metadata = {
    title: '짝사랑 종이배',
    description: '짝사랑에게 마음을 전하는 종이배를 띄워보세요',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body
                className={
                    'max-w-390 h-screen flex flex-col items-center bg-gray-200'
                }
            >
                <Image
                    src={PaperBoatBackground}
                    alt="background"
                    className="-z-[100] fixed max-w-390 h-full"
                />
                <div
                    className={
                        'relative w-full h-full overflow-y-auto overflow-x-hidden'
                    }
                >
                    {children}
                </div>
                <div id={'modal-root'} />
            </body>
        </html>
    );
}
