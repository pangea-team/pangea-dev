import Logo from '@/public/icons/logo.svg';
import Menubar from '@/public/icons/menubar.svg';

export const iconMap = {
  logo: Logo,
  menubar: Menubar,
} as const;

export type IconName = keyof typeof iconMap;
