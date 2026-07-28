'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Stethoscope,
  ShoppingCart,
  User as UserIcon,
  Pill,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { toggleMobileMenu } from '@/store/slices/uiSlice';
import { toggleCartDrawer, selectTotalQuantity } from '@/store/slices/cartSlice';
import { openAuthModal } from '@/store/slices/authSlice';

export function MobileBottomNav() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const totalCartQuantity = useAppSelector(selectTotalQuantity);
  const language = useAppSelector((state) => state.ui.language);

  const isBn = language === 'bn';

  const [badgeAnimate, setBadgeAnimate] = useState(false);

  useEffect(() => {
    if (totalCartQuantity > 0) {
      setBadgeAnimate(true);
      const timer = setTimeout(() => setBadgeAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalCartQuantity]);

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      dispatch(openAuthModal('signin'));
    }
  };

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

        {/* 3. Center Floating Brand FAB */}
        <Link
          href="/upload-prescription"
          aria-label={isBn ? 'প্রেসক্রিপশন আপলোড' : 'Upload Prescription'}
          className="relative -top-4 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-tr from-primary via-primary-light to-sky-400 font-bold text-white shadow-lg ring-4 ring-background transition-transform active:scale-90 hover:scale-105"
        >
          <Pill className="h-6 w-6" />
        </Link>

        {/* 4. Cart Icon with Animated Badge */}
        <button
          onClick={() => dispatch(toggleCartDrawer())}
          aria-label={
            isBn
              ? `কার্ট - ${totalCartQuantity} টি আইটেম`
              : `Cart - ${totalCartQuantity} items`
          }
          className="relative flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalCartQuantity > 0 && (
              <motion.span
                animate={badgeAnimate ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                className="absolute -top-2 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-extrabold text-slate-900 shadow-xs"
              >
                {totalCartQuantity}
              </motion.span>
            )}
          </div>
          <span className="text-[10px] font-semibold">
            {isBn ? 'কার্ট' : 'Cart'}
          </span>
        </button>

        {/* 5. Account */}
        <button
          onClick={handleAccountClick}
          aria-label={isBn ? 'অ্যাাকাউন্ট' : 'Account'}
          className="flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary active:scale-95"
        >
          <UserIcon className="h-5 w-5" />
          <span className="text-[10px] font-semibold">
            {isAuthenticated
              ? isBn
                ? 'প্রোফাইল'
                : 'Profile'
              : isBn
              ? 'অ্যাকাউন্ট'
              : 'Account'}
          </span>
        </button>
      </div>
    </nav>
  );
}
