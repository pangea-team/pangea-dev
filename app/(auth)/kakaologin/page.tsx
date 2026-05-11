import type { Metadata } from 'next';
import KakaoLoginView from './_components/KakaoLoginView';

export const metadata: Metadata = {
  title: '카카오 로그인 | Pangea',
};

export default function KakaoLoginPage() {
  return <KakaoLoginView />;
}
