import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Pangea',
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-xl font-medium text-zinc-900">Login</h1>
      <p className="mt-2 text-sm text-zinc-500">로그인 화면 (스캐폴드)</p>
    </div>
  );
}
