import Image from 'next/image';
import Link from 'next/link';
import HeaderMenuDrawer from '@/components/HeaderMenuDrawer';
import LogoutButton from '@/components/LogoutButton';
import { PATH } from '@/constants/path';
import { getUser } from '@/lib/supabase/auth';
import logo from '@/public/images/logo.webp';

export default async function Header() {
  const user = await getUser();

  return (
    <header className="flex h-15 shrink-0 items-center justify-between px-4 py-4">
      <Link href={PATH.HOME} className="flex items-center ">
        <Image src={logo} alt="" width={60} height={60} className="shrink-0" priority />
        <span className="whitespace-nowrap uppercase text-cormorant-logo">PANGEA</span>
      </Link>
      <div className="flex items-center gap-2">
        {user ? (
          <LogoutButton />
        ) : (
          <Link
            href={PATH.ONBOARDING}
            className="whitespace-nowrap  text-noto-subtitle-2 items-center px-3 py-2 text-center"
          >
            Login
          </Link>
        )}
        <HeaderMenuDrawer />
      </div>
    </header>
  );
}
