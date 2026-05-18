import { createClient } from '@/lib/supabase/server';

export async function getOrderByNumber(orderNumber: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select(
      'id, order_number, total_amount, item_price, shipping_fee, recipient_name, payment_due_at',
    )
    .eq('order_number', orderNumber)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export type OrderSummary = NonNullable<Awaited<ReturnType<typeof getOrderByNumber>>>;
