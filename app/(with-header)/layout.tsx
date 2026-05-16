import Header from '@/components/Header';

export default function WithHeaderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      {children}
    </div>
  );
}
