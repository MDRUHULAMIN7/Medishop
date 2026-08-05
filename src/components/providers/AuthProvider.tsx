'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store';
import { setUser, logout, setInitialized } from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // Attempt to fetch current user profile using access token or refresh cookie
        const user = await AuthService.me();
        if (isMounted && user) {
          dispatch(setUser(user));
        } else if (isMounted) {
          dispatch(setInitialized(true));
        }
      } catch (err: any) {
        if (isMounted) {
          // If access token failed, try silent refresh
          try {
            const refreshRes = await AuthService.refresh();
            if (refreshRes && refreshRes.user) {
              dispatch(setUser(refreshRes.user));
              return;
            }
          } catch (refreshErr) {
            // No valid session
          }
          dispatch(logout());
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return <>{children}</>;
}
