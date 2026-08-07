import type { Metadata, Viewport } from 'next';
import React from 'react';
import { fontInter, fontNotoBengali } from '@/lib/fonts';
import { AppProviders } from '@/components/providers';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'mediShop — Online Pharmacy & Digital Healthcare Platform',
    template: '%s | mediShop',
  },
  description:
    'mediShop is Bangladesh’s trusted digital pharmacy. Order 100% authentic medicines, OTC products, and healthcare equipment with express same-day delivery in Dhaka.',
  keywords: [
    'mediShop',
    'online pharmacy BD',
    'buy medicine Bangladesh',
    'MedEasy alternative',
    'express medicine delivery Dhaka',
    'DGDA licensed pharmacy',
    'bKash medicine order',
  ],
  authors: [{ name: 'mediShop Healthcare Team' }],
  creator: 'mediShop',
  publisher: 'mediShop Ltd.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'mediShop — Online Pharmacy & Digital Healthcare Platform',
    description:
      'Order authentic medicines, OTC healthcare items, and upload prescriptions online in Bangladesh.',
    url: 'https://medishop.com.bd',
    siteName: 'mediShop',
    locale: 'bn_BD',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1D4ED8',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${fontInter.variable} ${fontNotoBengali.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="https://fonts.maateen.me/solaiman-lipi/font.css" />
      </head>
      <body
        className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary"
        suppressHydrationWarning
      >
        <AppProviders>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProviders>
      </body>
    </html>
  );
}
