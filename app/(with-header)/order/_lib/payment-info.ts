import 'server-only';

export const BANK_INFO = {
  bankName: process.env.BANK_NAME!,
  accountNumber: process.env.BANK_ACCOUNT_NUMBER!,
  accountHolder: process.env.BANK_ACCOUNT_HOLDER!,
} as const;

export const PAYMENT_DEADLINE_DAYS = Number(process.env.PAYMENT_DEADLINE_DAYS ?? 3);
export const SHIPPING_FEE = Number(process.env.SHIPPING_FEE ?? 3000);
