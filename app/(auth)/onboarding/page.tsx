import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import { PATH } from '@/constants/path';
import { getUser } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import OnboardingPage from './_components/OnboardingPage';

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect(PATH.KAKAO_LOGIN);
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.sub)
    .maybeSingle();

  if (profile) {
    redirect(PATH.LANDING);
  }

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <Header />
      <OnboardingPage />
    </div>
  );
}
