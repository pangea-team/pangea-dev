import { redirect } from 'next/navigation';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { PATH } from '@/constants/path';
import { getUser } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import BackgroundPath from './_components/BackgroundPath';

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.sub)
      .maybeSingle();

    if (!profile) {
      redirect(PATH.ONBOARDING);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <BackgroundPath />

      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
