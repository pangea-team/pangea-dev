'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PATH } from '@/constants/path';
import { createClient } from '@/lib/supabase/server';

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect(PATH.LANDING);
}
