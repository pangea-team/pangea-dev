import type { Metadata } from 'next';

import LoginStartScreen from '@/app/(auth)/login/_components/login-start-screen';

export const metadata: Metadata = {
  title: '시작하기 | Pangea',
};

export default function LoginStartPage() {
  return <LoginStartScreen />;
}
