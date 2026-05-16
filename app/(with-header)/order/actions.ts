'use server';

import { createClient } from '@/lib/supabase/server';
import { SHIPPING_FEE } from './_lib/payment-info';

type CreateOrderInput = {
  savedSentenceId: string;
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  deliveryMessage: string;
};

type CreateOrderResult = { error: string } | { success: true; orderNumber: string };

const PHONE_REGEX = /^(010\d{8}|01[16789]\d{7,8})$/;

function generateOrderNumber(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 6; i += 1) {
    suffix += alphabet[bytes[i] % alphabet.length];
  }
  return `${yyyy}${mm}${dd}-${suffix}`;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const recipientName = input.recipientName.trim();
  const recipientPhone = input.recipientPhone.trim();
  const postalCode = input.postalCode.trim();
  const address = input.address.trim();
  const addressDetail = input.addressDetail.trim();
  const deliveryMessage = input.deliveryMessage.trim();

  if (!input.savedSentenceId) return { error: '주문 항목이 유효하지 않습니다.' };
  if (!recipientName) return { error: '이름을 입력해주세요.' };
  if (recipientName.length > 60) return { error: '이름은 60자 이하로 입력해주세요.' };
  if (!recipientPhone) return { error: '연락처를 입력해주세요.' };
  if (recipientPhone.length > 11 || !PHONE_REGEX.test(recipientPhone)) {
    return { error: '연락처 형식이 올바르지 않습니다.' };
  }
  if (!postalCode || postalCode.length > 10) return { error: '우편번호를 확인해주세요.' };
  if (!address) return { error: '주소를 입력해주세요.' };
  if (!addressDetail) return { error: '상세 주소를 입력해주세요.' };

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: '로그인이 필요합니다.' };
  }

  // 본인 소유 saved_sentence 인지 + 가격 위변조 방지를 위해 서버에서 재조회
  const { data: saved, error: savedError } = await supabase
    .from('saved_sentences')
    .select(`
      id,
      sentences (
        book_id,
        books ( id, price )
      )
    `)
    .eq('id', input.savedSentenceId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (savedError || !saved) {
    return { error: '주문 항목을 찾을 수 없습니다.' };
  }

  const book = saved.sentences?.books;
  if (!book) {
    return { error: '책 정보를 찾을 수 없습니다.' };
  }

  const itemPrice = book.price;
  const shippingFee = SHIPPING_FEE;
  const totalAmount = itemPrice + shippingFee;
  const orderNumber = generateOrderNumber();

  const { error: insertError } = await supabase.from('orders').insert({
    id: crypto.randomUUID(),
    order_number: orderNumber,
    user_id: user.id,
    book_id: book.id,
    saved_sentence_id: saved.id,
    item_price: itemPrice,
    shipping_fee: shippingFee,
    total_amount: totalAmount,
    recipient_name: recipientName,
    recipient_phone: recipientPhone,
    postal_code: postalCode,
    address,
    address_detail: addressDetail,
    delivery_message: deliveryMessage || null,
  });

  if (insertError) {
    return { error: '주문 생성에 실패했습니다. 다시 시도해주세요.' };
  }

  return { success: true, orderNumber };
}
