import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '育英館大学 単位管理システム',
  description: '育英館大学の学生向け単位管理・卒業要件チェックシステム',
  keywords: '育英館大学, 単位管理, 卒業要件, 履修管理',
  authors: [{ name: '育英館大学' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'noindex, nofollow', // 個人情報を含む可能性があるため
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}