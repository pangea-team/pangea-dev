import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-full w-full min-w-0">{children}</div>;
}
