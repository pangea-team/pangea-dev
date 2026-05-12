import type { Metadata } from 'next';
import KakaoLoginPage from './_components/KakaoLoginPage';

export const metadata: Metadata = {
  title: '카카오 로그인 | Pangea',
};

export default function KakaoLogin() {
  return <KakaoLoginPage />;
}
