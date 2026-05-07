import Instagram from '@/public/icons/icon-instagram.svg';
import Kakao from '@/public/icons/icon-kakao.svg';
import Logo from '@/public/icons/logo.svg';
import Menubar from '@/public/icons/menubar.svg';

export const iconMap = {
  logo: Logo,
  menubar: Menubar,
  kakao: Kakao,
  instagram: Instagram,
} as const;

export type IconName = keyof typeof iconMap;
