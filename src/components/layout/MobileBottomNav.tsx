'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutGrid,
  Stethoscope,
  Home,
  FileText,
  User as UserIcon,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleMobileMenu } from '@/store/slices/uiSlice';
import { openAuthModal } from '@/store/slices/authSlice';

export function MobileBottomNav() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const language = useAppSelector((state) => state.ui.language);

  const isBn = language === 'bn';

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/98 backdrop-blur-md shadow-lg md:hidden"
    >
      <div className="flex h-16 items-center justify-around px-2">
        {/* 1. Categories */}
        <button
          onClick={() => dispatch(toggleMobileMenu())}
          aria-label={isBn ? 'ক্যাটাগরি' : 'Categories'}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        >
          <LayoutGrid className="h-5 w-5" />
          <span className="text-[10px] font-semibold">
            {isBn ? 'ক্যাটাগরি' : 'Categories'}
          </span>
        </button>

        {/* 2. Doctor Consultation */}
        <Link
          href="/consultation"
          aria-label={isBn ? 'ডাক্তার' : 'Doctor'}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        >
          <Stethoscope className="h-5 w-5" />
          <span className="text-[10px] font-semibold">
            {isBn ? 'ডাক্তার' : 'Doctor'}
          </span>
        </Link>

        {/* 3. Center Floating FAB - Home */}
        <Link
          href="/"
          aria-label={isBn ? 'হোম' : 'Home'}
          className="relative -top-4 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-primary via-primary-light to-sky-400 font-bold text-white shadow-lg ring-4 ring-background transition-transform active:scale-90 hover:scale-105"
        >
          <Home className="h-6 w-6" />
        </Link>

        {/* 4. Upload Prescription */}
        <Link
          href="/upload-prescription"
          aria-label={isBn ? 'প্রেসক্রিপশন আপলোড' : 'Upload Prescription'}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        >
          <FileText className="h-5 w-5" />
          <span className="text-[10px] font-semibold">
            {isBn ? 'প্রেসক্রিপশন' : 'Prescription'}
          </span>
        </Link>

        {/* 5. Account / Profile */}
        <Link
          href="/profile"
          aria-label={isBn ? 'প্রোফাইল' : 'Profile'}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        >
          <UserIcon className="h-5 w-5" />
          <span className="text-[10px] font-semibold">
            {isBn ? 'প্রোফাইল' : 'Profile'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
