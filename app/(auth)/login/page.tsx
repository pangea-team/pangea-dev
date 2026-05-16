import Header from '@/components/Header';
import LoginSentencePage from './_components/LoginSentencePage';

export default function Page() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <LoginSentencePage />
    </div>
  );
}
