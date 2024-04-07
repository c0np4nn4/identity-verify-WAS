import Link from 'next/link';


export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">Service Homepage</h1>
      <nav>
        <Link href="/register" className="mr-4">회원가입</Link>
        <Link href="/login">로그인</Link>
      </nav>
    </header>
  );
}