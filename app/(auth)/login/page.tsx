import type { Metadata } from 'next';
import KaKaoLoginView from './_components/KaKaoLoginView';
export const metadata: Metadata = {
  title: 'Login | Pangea',
};

export default function LoginPage() {
  return <KaKaoLoginView />;
}
