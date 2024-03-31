export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <h1 className="text-2xl font-bold">Service Homepage</h1>
      <nav>
        <a href="/auth/signup" className="mr-4">회원가입</a>
        <a href="/auth/signin">로그인</a>
      </nav>
    </header>
  );
}