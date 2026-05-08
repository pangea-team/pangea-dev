import type { Metadata } from 'next';
import KaKaoLoginPage from './_components/KaKaoLoginPage';
export const metadata: Metadata = {
  title: 'Login | Pangea',
};

export default function KaKaoLogin() {
  return <KaKaoLoginPage />;
}
