import { redirect } from 'next/navigation';
import BackgroundPath from '@/components/BackgroundPath';
import Footer from '@/components/Footer';
import { PATH } from '@/constants/path';
import { getUser } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

export default async function BooksLayout({ children }: { children: React.ReactNode }) {
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
    <div className="relative flex flex-1 flex-col">
      <BackgroundPath />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
