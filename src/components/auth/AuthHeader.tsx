'use client';

import React from 'react';
import { Pill, X } from 'lucide-react';
import { useAppSelector } from '@/store';
import { AuthModalView } from '@/types';

interface AuthHeaderProps {
  view: AuthModalView;
  onClose: () => void;
}

export function AuthHeader({ view, onClose }: AuthHeaderProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const TITLES: Record<AuthModalView, { bn: string; en: string; subtitleBn: string; subtitleEn: string }> = {
    signin: {
      bn: 'মেডিশপে স্বাগতম!',
      en: 'Welcome to mediShop!',
      subtitleBn: 'আপনার অ্যাকাউন্ট থাকলে লগইন করুন',
      subtitleEn: 'Sign in to access your orders & prescriptions',
    },
    signup: {
      bn: 'নতুন অ্যাকাউন্ট তৈরি করুন',
      en: 'Create a New Account',
      subtitleBn: 'সহজে ওষুধ ও স্বাস্থ্যসেবা পেতে রেজিস্ট্রেশন করুন',
      subtitleEn: 'Register to order authentic medicines easily',
    },
    otp: {
      bn: 'ওটিপি ভেরিফিকেশন',
      en: 'OTP Verification',
      subtitleBn: 'আপনার মোবাইল/ইমেইলে পাঠানো ৬ ডিজিটের কোড দিন',
      subtitleEn: 'Enter 6-digit code sent to your mobile/email',
    },
    forgot: {
      bn: 'পাসওয়ার্ড রিকভারি',
      en: 'Forgot Password',
      subtitleBn: 'পাসওয়ার্ড রিসেট লিংক পেতে তথ্য দিন',
      subtitleEn: 'Enter information to receive reset instructions',
    },
  };

  const currentInfo = TITLES[view];

  return (
    <div className="relative border-b border-border bg-gradient-to-r from-primary/5 via-sky-50/40 to-teal-50/40 p-5 sm:p-6 text-center">
      {/* Brand Icon */}
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-xs">
        <Pill className="h-5 w-5" />
      </div>

      <h2 className="font-serif-title text-lg sm:text-xl font-bold text-foreground">
        {isBn ? currentInfo.bn : currentInfo.en}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        {isBn ? currentInfo.subtitleBn : currentInfo.subtitleEn}
      </p>

      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label={isBn ? 'বন্ধ করুন' : 'Close Modal'}
        className="absolute top-4 right-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
