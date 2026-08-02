import { Inter, Noto_Sans_Bengali } from 'next/font/google';

export const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const fontNotoBengali = Noto_Sans_Bengali({
  subsets: ['bengali', 'latin'],
  variable: '--font-noto-bengali',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

