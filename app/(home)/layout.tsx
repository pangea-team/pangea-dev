// app/(home)/layout.tsx
import BackgroundPath from './_components/BackgroundPath';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <BackgroundPath />

      <div className="z-10">{children}</div>
    </div>
  );
}
