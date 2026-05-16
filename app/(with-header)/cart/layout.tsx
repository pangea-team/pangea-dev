import Footer from '@/components/Footer';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
