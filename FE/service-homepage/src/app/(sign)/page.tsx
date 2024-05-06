import Link from 'next/link';

export default function Home() {
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
                className={
                    'flex flex-col gap-y-4 animate-fadeIn opacity-0 mt-48'
                }
                style={{ animationDelay: '2.5s' }}
            >
                <Link href="/register">
                    <button
                        className={
                            'bg-white text-black w-80 py-4 rounded-6 animate-springAlways duration-300 transform ease-in-out'
                        }
                        style={{ animationDelay: '3.0s' }}
                    >
                        시작하기
                    </button>
                </Link>
                <Link href="/login">
                    <button
                        className={
                            'bg-white text-black w-80 py-4 rounded-6 animate-springAlways duration-300 transform ease-in-out'
                        }
                        style={{ animationDelay: '3.0s' }}
                    >
                        로그인
                    </button>
                </Link>
            </div>
        </main>
    );
}
