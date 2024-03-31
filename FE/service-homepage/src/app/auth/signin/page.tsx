export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-cetner p-24">
      <h1 className="text-4xl font-bold">Welcome to Service Client</h1>
      <p className="text-lg">This is a 로그인 Page.</p>
      <form className="flex flex-col w-1/3 mt-8">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border border-gray-300 rounded-md mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border border-gray-300 rounded-md mb-4"
        />
        <button className="bg-blue-500 text-white p-2 rounded-md">
          Signup
        </button>
      </form>
    </main>
  );
}
