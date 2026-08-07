'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Phone,
  MessageSquare,
  ShieldCheck,
  Upload,
  User as UserIcon,
  Pill,
  Stethoscope,
  Activity,
  Heart,
  Baby,
  ShieldPlus,
  Sparkles,
  Apple,
  LayoutDashboard,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setMobileMenu, setLanguage } from '@/store/slices/uiSlice';
import { openAuthModal } from '@/store/slices/authSlice';
import { MOCK_CATEGORIES } from '@/mocks';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ReactNode> = {
  Pill: <Pill className="h-5 w-5 text-primary" />,
  Stethoscope: <Stethoscope className="h-5 w-5 text-primary" />,
  Activity: <Activity className="h-5 w-5 text-primary" />,
  Heart: <Heart className="h-5 w-5 text-primary" />,
  Baby: <Baby className="h-5 w-5 text-primary" />,
  ShieldPlus: <ShieldPlus className="h-5 w-5 text-primary" />,
  Sparkles: <Sparkles className="h-5 w-5 text-primary" />,
  Apple: <Apple className="h-5 w-5 text-primary" />,
};

export function MobileMenuDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const language = useAppSelector((state) => state.ui.language);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const isBn = language === 'bn';

  // Close menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(setMobileMenu(false));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dispatch]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => dispatch(setMobileMenu(false));

  const handleAuthClick = () => {
    handleClose();
    if (!isAuthenticated) {
      dispatch(openAuthModal('signin'));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          />

          {/* Drawer Container */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            role="dialog"
            aria-modal="true"
            aria-label={isBn ? 'মোবাইল নেভিগেশন মেনু' : 'Mobile Navigation Menu'}
            className="fixed top-0 left-0 bottom-0 z-50 flex w-[300px] max-w-[85vw] flex-col bg-background shadow-xl md:hidden"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4 bg-primary/5">
              <Link
                href="/"
                onClick={handleClose}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                  m
                </div>
                <span className="font-serif-title text-xl font-bold text-primary">
                  mediShop
                </span>
              </Link>
              <button
                onClick={handleClose}
                aria-label={isBn ? 'মেনু বন্ধ করুন' : 'Close Menu'}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {/* User Greeting / Auth Status */}
              <div className="mb-6 rounded-xl bg-muted/60 p-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-white">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user?.name || (isBn ? 'গ্রাহক' : 'Customer')}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.phone || user?.email || (isBn ? 'লগইন আছে' : 'Logged in')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                      <Link
                        href="/dashboard"
                        onClick={handleClose}
                        className="flex items-center justify-center gap-1.5 rounded-lg bg-primary py-2 px-3 text-xs font-bold text-white shadow-xs"
                      >
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        <span>{isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={handleClose}
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-border bg-background py-2 px-3 text-xs font-bold text-foreground hover:bg-muted"
                      >
                        <UserIcon className="h-3.5 w-3.5 text-primary" />
                        <span>{isBn ? 'প্রোফাইল' : 'Profile'}</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {isBn
                        ? 'মেডিশপে স্বাগতম!'
                        : 'Welcome to mediShop!'}
                    </p>
                    <button
                      onClick={handleAuthClick}
                      className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                    >
                      <UserIcon className="h-4 w-4" />
                      {isBn ? 'লগইন / সাইন আপ' : 'Login / Register'}
                    </button>
                  </div>
                )}
              </div>

              {/* Language Switcher */}
              <div className="mb-6 flex items-center justify-between rounded-lg border border-border p-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {isBn ? 'ভাষা নির্বাচন করুন' : 'Select Language'}
                </span>
                <div className="flex rounded-md bg-muted p-1 text-xs font-semibold">
                  <button
                    onClick={() => dispatch(setLanguage('bn'))}
                    className={cn(
                      'rounded px-2.5 py-1 transition-colors',
                      isBn ? 'bg-primary text-white' : 'text-muted-foreground'
                    )}
                  >
                    বাংলা
                  </button>
                  <button
                    onClick={() => dispatch(setLanguage('en'))}
                    className={cn(
                      'rounded px-2.5 py-1 transition-colors',
                      !isBn ? 'bg-primary text-white' : 'text-muted-foreground'
                    )}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-6 flex flex-col gap-2">
                <Link
                  href="/upload-prescription"
                  onClick={handleClose}
                  className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm font-semibold text-primary hover:bg-primary/10"
                >
                  <Upload className="h-5 w-5" />
                  {isBn ? 'প্রেসক্রিপশন আপলোড করুন' : 'Upload Prescription'}
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/about"
                    onClick={handleClose}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border p-2 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    <span>{isBn ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={handleClose}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border p-2 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    <span>{isBn ? 'যোগাযোগ' : 'Contact Us'}</span>
                  </Link>
                </div>
              </div>

              {/* Categories Section */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'ওষুধের ক্যাটাগরি' : 'Medicine Categories'}
                </h3>
                <nav className="flex flex-col gap-1">
                  {MOCK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={handleClose}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      {ICON_MAP[cat.iconName] || <Pill className="h-5 w-5 text-primary" />}
                      <span>{isBn ? cat.nameBn : cat.nameEn}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* General Pages & Information */}
              <div className="mb-6 border-t border-border pt-4">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'অন্যান্য তথ্য' : 'Information & Support'}
                </h3>
                <nav className="flex flex-col gap-1.5 text-xs text-foreground">
                  <Link href="/faq" onClick={handleClose} className="hover:text-primary py-1">
                    {isBn ? 'সাহায্য ও প্রশ্ন (FAQ)' : 'Help & FAQs'}
                  </Link>
                  <Link href="/delivery-policy" onClick={handleClose} className="hover:text-primary py-1">
                    {isBn ? 'ডেলিভারি নীতি' : 'Delivery Policy'}
                  </Link>
                  <Link href="/refund-policy" onClick={handleClose} className="hover:text-primary py-1">
                    {isBn ? 'ফেরত ও রিফান্ড নীতি' : 'Return & Refund Policy'}
                  </Link>
                  <Link href="/privacy" onClick={handleClose} className="hover:text-primary py-1">
                    {isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                  </Link>
                  <Link href="/terms" onClick={handleClose} className="hover:text-primary py-1">
                    {isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms & Conditions'}
                  </Link>
                </nav>
              </div>

              {/* Quick Hotline Contact */}
              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'জরুরি অর্ডার ও সহায়তা' : 'Emergency Order & Support'}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  <a
                    href="tel:+8801742643763"
                    className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-xs font-bold text-foreground hover:bg-muted/80"
                  >
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <span>+880 1742-643763</span>
                  </a>
                  <a
                    href="https://wa.me/8801742643763"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                  >
                    <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>WhatsApp Order</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Footer License Indicator */}
            <div className="border-t border-border bg-muted/40 p-3 text-center">
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>DGDA Reg. #DAR-2026-BD</span>
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
