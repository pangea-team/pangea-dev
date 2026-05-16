import { redirect } from 'next/navigation';
import { PATH } from '@/constants/path';

/** 이전 `/login` URL 호환 — 프로필 작성은 onboarding */
export default function LoginRedirectPage() {
  redirect(PATH.ONBOARDING);
}
