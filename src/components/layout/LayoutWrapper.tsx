'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ONLY /dashboard sub-routes use standalone full-screen dashboard layout
  const isDashboardRoute = Boolean(pathname?.startsWith('/dashboard'));

  if (isDashboardRoute) {
    // Render clean standalone Dashboard without main shop Navbar, Footer, or Floating Buttons
    return (
      <main id="main-content" className="min-h-screen w-full bg-background">
        {children}
      </main>
    );
  }

  // E-commerce Public Store Layout (Including /profile and all store pages)
  return (
    <>
      {/* Header Landmark */}
      <Navbar />

      {/* Main Content Landmark with safe mobile bottom padding */}
      <main id="main-content" className="flex-1 pb-16 md:pb-0">
        {children}
      </main>

      {/* Footer Landmark */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppButton />
    </>
  );
}
