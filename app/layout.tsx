import type { Metadata } from 'next';
import { Cormorant, Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';
import './styles/globals.css';

const cormorant = Cormorant({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400'],
});

const notoSansKR = Noto_Sans_KR({
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
      className={`${cormorant.variable} ${notoSansKR.variable} ${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-noto">{children}</body>
    </html>
  );
}
