import type { Metadata } from 'next';

import KakaoLoginScreen from '@/app/(auth)/login/_components/kakao-login-screen';

export const metadata: Metadata = {
  title: 'Login | Pangea',
};

export default function LoginPage() {
  return <KakaoLoginScreen />;
}
