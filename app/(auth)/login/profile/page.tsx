import type { Metadata } from 'next';

import ProfileSetupForm from '@/app/(auth)/login/_components/profile-setup-form';
import SiteHeader from '@/components/site-header';

export const metadata: Metadata = {
  title: '프로필 작성 | Pangea',
};

export default function ProfileSetupPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <SiteHeader />
      <ProfileSetupForm />
    </div>
  );
}
