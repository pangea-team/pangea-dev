import type { ReactNode } from 'react';

type Props = {
  readonly children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return <div className="min-h-full w-full min-w-0">{children}</div>;
}
