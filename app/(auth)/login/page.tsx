import type { Metadata } from 'next';
import LoginSentenceView from './_components/LoginSentenceView';

export const metadata: Metadata = {
  title: '로그인 | Pangea',
};

export default function LoginPage() {
  return <LoginSentenceView />;
}
