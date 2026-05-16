import type { Metadata } from 'next';
import { Cormorant, Noto_Serif_KR } from 'next/font/google';
import localFont from 'next/font/local';
import { QueryProvider } from '@/components/QueryProvider';
import './styles/globals.css';

const cormorant = Cormorant({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400'],
});

const notoSerifKR = Noto_Serif_KR({
  variable: '--font-noto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const pretendard = localFont({
  variable: '--font-pretendard',
  src: [
    {
      path: '../public/fonts/Pretendard-Light.subset.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PANGEA',
  description: '사람이 설명이 아니라 흔적으로 이해되는 세계를 만든다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`h-full antialiased ${cormorant.variable} ${notoSerifKR.variable} ${pretendard.variable}`}
    >
      <body className="min-h-full flex flex-col font-noto">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
