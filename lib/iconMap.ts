import Instagram from '@/public/icons/Icon_instagram.svg';
import Kakao from '@/public/icons/Icon_kakao.svg';
import Logo from '@/public/icons/logo.svg';
import Menubar from '@/public/icons/menubar.svg';

export const iconMap = {
  logo: Logo,
  menubar: Menubar,
  kakao: Kakao,
  instagram: Instagram,
} as const;

export type IconName = keyof typeof iconMap;
