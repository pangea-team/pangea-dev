import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PATH } from '@/constants/path';
import { getUser } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';
import PostLoginStartPage from './_components/PostLoginStartPage';

export const metadata: Metadata = {
  title: '시작 | Pangea',
};

export default async function PostLoginStart() {
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
    redirect(PATH.HOME);
  }

  return <PostLoginStartPage />;
}
