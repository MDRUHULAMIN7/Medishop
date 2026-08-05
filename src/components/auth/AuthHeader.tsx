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
    identifier: {
      bn: 'মেডিশপে স্বাগতম!',
      en: 'Welcome to mediShop!',
      subtitleBn: 'আপনার মোবাইল/ইমেইল দিয়ে শুরু করুন',
      subtitleEn: 'Enter your mobile or email to proceed',
    },
    password_login: {
      bn: 'পাসওয়ার্ড প্রদান করুন',
      en: 'Enter Password',
      subtitleBn: 'আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন',
      subtitleEn: 'Enter your password to sign in',
    },
    verify_otp: {
      bn: 'ওটিপি ভেরিফিকেশন',
      en: 'OTP Verification',
      subtitleBn: 'আপনার নম্বর/ইমেইলে পাঠানো ৬ ডিজিটের কোড দিন',
      subtitleEn: 'Enter 6-digit code sent to your device',
    },
    complete_registration: {
      bn: 'অ্যাকাউন্ট তৈরি সম্পূর্ণ করুন',
      en: 'Complete Registration',
      subtitleBn: 'আপনার নাম ও পাসওয়ার্ড সেট করুন',
      subtitleEn: 'Set your name and password',
    },
    reset_password: {
      bn: 'নতুন পাসওয়ার্ড সেট করুন',
      en: 'Set New Password',
      subtitleBn: 'আপনার নতুন পাসওয়ার্ড সেট করুন',
      subtitleEn: 'Create a new password for your account',
    },
    signin: {
      bn: 'মেডিশপে স্বাগতম!',
      en: 'Welcome to mediShop!',
      subtitleBn: 'আপনার অ্যাকাউন্ট থাকলে লগইন করুন',
      subtitleEn: 'Sign in to access your account',
    },
    signup: {
      bn: 'নতুন অ্যাকাউন্ট তৈরি করুন',
      en: 'Create a New Account',
      subtitleBn: 'সহজে রেজিস্ট্রেশন করুন',
      subtitleEn: 'Register easily',
    },
    otp: {
      bn: 'ওটিপি ভেরিফিকেশন',
      en: 'OTP Verification',
      subtitleBn: '৬ ডিজিটের কোড দিন',
      subtitleEn: 'Enter 6-digit code',
    },
    forgot: {
      bn: 'পাসওয়ার্ড রিকভারি',
      en: 'Forgot Password',
      subtitleBn: 'পাসওয়ার্ড রিসেট করুন',
      subtitleEn: 'Reset password',
    },
  };

  const currentInfo = TITLES[view] || TITLES.identifier;

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
