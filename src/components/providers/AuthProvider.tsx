'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, logout, setInitialized } from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';
import { clearAccessToken, getAccessToken } from '@/lib/apiClient';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/apiClient';
import { io } from 'socket.io-client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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

  useEffect(() => {
    const token = getAccessToken();
    const handleBlocked = (payload?: { message?: string }) => {
      clearAccessToken();
      dispatch(logout());
      toast.error(payload?.message || 'Account blocked. Access is restricted.');
      if (typeof window !== 'undefined') window.location.assign('/');
    };
    const handleBrowserBlocked = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      handleBlocked(detail);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('medishop:account-blocked', handleBrowserBlocked);
    }
    if (!token) {
      return () => window.removeEventListener('medishop:account-blocked', handleBrowserBlocked);
    }
    const socket = io(API_BASE_URL.replace(/\/api\/v1$/, ''), { auth: { token } });
    socket.on('account:blocked', handleBlocked);
    return () => {
      window.removeEventListener('medishop:account-blocked', handleBrowserBlocked);
      socket.off('account:blocked', handleBlocked);
      socket.disconnect();
    };
  }, [dispatch, isAuthenticated]);

  return <>{children}</>;
}
