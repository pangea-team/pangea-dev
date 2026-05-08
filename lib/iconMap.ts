import Instagram from '@/public/icons/icon-instagram.svg';
import Kakao from '@/public/icons/icon-kakao.svg';
import Menubar from '@/public/icons/menubar.svg';

export const iconMap = {
  menubar: Menubar,
  kakao: Kakao,
  instagram: Instagram,
} as const;

export type IconName = keyof typeof iconMap;
