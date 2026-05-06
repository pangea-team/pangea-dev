import { iconMap } from '@/lib/iconMap';

type IconName = keyof typeof iconMap;

type Props = {
  name: IconName;
  width?: number;
  height?: number;
  className?: string;
  title?: string;
};

export default function Icon({ name, width, height, className, title }: Props) {
  const SvgIcon = iconMap[name];

  if (title) {
    return (
      <SvgIcon width={width} height={height} className={className} role="img" aria-label={title} />
    );
  }

  return <SvgIcon width={width} height={height} className={className} aria-hidden="true" />;
}
