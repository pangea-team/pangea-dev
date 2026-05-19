import Footer from '@/components/Footer';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col">
      {/* <BackgroundPath /> */}
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
