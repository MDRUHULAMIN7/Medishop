'use client';

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { getQueryClient } from '@/lib/queryClient';
import { AuthModal } from '@/components/auth/AuthModal';

interface ProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Global Non-Navigating Authentication Modal */}
        <AuthModal />
        
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
      </QueryClientProvider>
    </ReduxProvider>
  );
}
