import type { Metadata } from 'next';
import './globals.css';
import PaperBoatBackground from '/public/image/paper-boat-background.png';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
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
                    'w-screen h-screen flex flex-col items-center bg-gray-200'
                }
            >
                <div
                    className={
                        'relative w-380 h-full overflow-y-auto overflow-x-hidden'
                    }
                >
                    <Image
                        src={PaperBoatBackground}
                        alt="background"
                        className="-z-[100]"
                        layout={'fill'}
                        objectFit={'cover'}
                    />
                    {children}
                </div>
            </body>
        </html>
    );
}
