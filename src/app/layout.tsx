import type { Metadata, Viewport } from 'next';
import React from 'react';
import { fontInter, fontNotoBengali } from '@/lib/fonts';
import { AppProviders } from '@/components/providers';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import '@/app/globals.css';

import { settingsService } from '@/services/settings.service';

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
    'express medicine delivery Dhaka',
    'DGDA licensed pharmacy',
  ],
  authors: [{ name: 'mediShop Healthcare Team' }],
  creator: 'mediShop',
  publisher: 'mediShop Ltd.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1D4ED8',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await settingsService.getPublicSettings();
  const primaryColor = settings.branding?.primaryColor || '#1D4ED8';
  const accentColor = settings.branding?.accentColor || '#F59E0B';

  return (
    <html
      lang="bn"
      className={`${fontInter.variable} ${fontNotoBengali.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href={settings.general?.favicon || '/favicon.ico'} />
        <link rel="shortcut icon" href={settings.general?.favicon || '/favicon.ico'} />
        <link rel="stylesheet" href="https://fonts.maateen.me/solaiman-lipi/font.css" />
        <style
          id="dynamic-branding"
          dangerouslySetInnerHTML={{
            __html: `:root { --site-primary: ${primaryColor}; --site-accent: ${accentColor}; }`,
          }}
        />
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
