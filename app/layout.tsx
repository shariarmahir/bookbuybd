import './globals.css';
import type { Metadata } from 'next';
import LayoutClientWrapper from '@/components/LayoutClientWrapper';

export const metadata: Metadata = {
  title: 'BookBuyBD - Your Trusted Online Bookstore in Dhaka',
  description: 'Shop books online from Nilkhet, Dhaka. Wide collection of fiction, non-fiction, academic books, and custom printing services at affordable prices.',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <body>
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
