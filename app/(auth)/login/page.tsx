import type { Metadata } from 'next';
import LoginSentencePage from './_components/LoginSentencePage';

export const metadata: Metadata = {
  title: '로그인 | Pangea',
};

export default function Login() {
  return <LoginSentencePage />;
}
