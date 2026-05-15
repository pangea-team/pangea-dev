// app/(home)/layout.tsx
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import BackgroundPath from './_components/BackgroundPath';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <BackgroundPath />

      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
