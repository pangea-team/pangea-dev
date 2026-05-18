import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type AppSettings = {
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  paymentDeadlineDays: number;
};

export const getAppSettings = cache(async (): Promise<AppSettings> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('app_settings')
    .select('key, value')
    .in('key', [
      'bank_name',
      'bank_account_number',
      'bank_account_holder',
      'payment_deadline_days',
    ]);

  if (error) throw error;

  const map = Object.fromEntries(data.map((r) => [r.key, r.value]));

  return {
    bankName: map.bank_name as string,
    bankAccountNumber: map.bank_account_number as string,
    bankAccountHolder: map.bank_account_holder as string,
    paymentDeadlineDays: map.payment_deadline_days as number,
  };
});
