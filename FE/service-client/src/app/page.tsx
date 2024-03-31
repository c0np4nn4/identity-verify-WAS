import Link from 'next/link';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-cetner p-24">
      <h1 className="text-4xl font-bold">Welcome to Service Client</h1>

      <nav className="flex mt-8">
        <Link href="/auth/signup" className="mr-4">회원가입</Link>
        <Link href="/auth/signin">로그인</Link>
      </nav>
    </main>
  );
}
