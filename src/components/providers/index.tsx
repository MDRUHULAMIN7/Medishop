'use client';

import React, { useEffect } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { getQueryClient } from '@/lib/queryClient';
import { AuthModal } from '@/components/auth/AuthModal';
import { CartDrawer } from '@/components/cart/CartDrawer';

import { FlyToCartProvider } from '@/context/FlyToCartContext';
import { FloatingCartWidget } from '@/components/cart/FloatingCartWidget';

interface ProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  useEffect(() => {
    const savedColor = localStorage.getItem('medishop_theme_primary');
    if (savedColor) {
      document.documentElement.style.setProperty('--color-primary', savedColor);
      document.documentElement.style.setProperty('--color-ring', savedColor);
    }
  }, []);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <FlyToCartProvider>
          {children}

          {/* Global Floating Cart Widget on Right Edge */}
          <FloatingCartWidget />

          {/* Global Non-Navigating Authentication Modal */}
          <AuthModal />
          
          {/* Global Cart Slide-over Drawer */}
          <CartDrawer />
          
          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={3500}
            toastOptions={{
              style: {
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
              },
            }}
          />
        </FlyToCartProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
