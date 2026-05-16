import Header from '@/components/Header';
import OnboardingPage from './_components/OnboardingPage';

export default function Page() {
  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <OnboardingPage />
    </div>
  );
}
