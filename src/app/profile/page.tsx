'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserProfileModule } from '@/components/profile/UserProfileModule';
import { ChevronRight, Loader2, Lock, LogIn } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openAuthModal } from '@/store/slices/authSlice';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const isBn = language === 'bn';

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      dispatch(openAuthModal('signin'));
    }
  }, [isInitialized, isAuthenticated, dispatch]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 bg-muted/20">
        <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 text-center shadow-lg space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-foreground font-serif-title">
            {isBn ? 'লগইন আবশ্যক' : 'Login Required'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'আপনার প্রোফাইল, অর্ডার হিস্টোরি ও ডেলিভারি ঠিকানা দেখতে দয়া করে লগইন করুন।'
              : 'Please log in to view your profile, order history, and saved addresses.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => dispatch(openAuthModal('signin'))}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-primary px-6 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{isBn ? 'লগইন / সাইন আপ করুন' : 'Sign In / Register'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-bold text-foreground">{isBn ? 'মাই প্রোফাইল ও ঠিকানা' : 'My Profile & Addresses'}</span>
        </nav>

        {/* Profile & Address Container Module */}
        <Suspense
          fallback={
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <UserProfileModule isBn={isBn} />
        </Suspense>
      </div>
    </div>
  );
}
