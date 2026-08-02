'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pill, Search, ShieldCheck, Upload, MessageSquare, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { OtpVerification } from './OtpVerification';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export function AuthModal() {
  const { isAuthModalOpen, authModalView, closeModal } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeModal]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthModalOpen]);

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            aria-hidden="true"
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Main Split Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-background shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[520px]"
          >
            {/* Left Side: Hero Banner & Phone Graphic Mockup (Desktop / Tablet) */}
            <div className="hidden md:flex md:col-span-7 flex-col justify-between p-6 lg:p-8 bg-gradient-to-br from-sky-50 via-teal-50/80 to-cyan-100 border-r border-teal-100/60 relative overflow-hidden">
              {/* Decorative Background Glow Circles */}
              <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-cyan-200/40 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-teal-200/40 blur-3xl" />

              {/* Top Badge */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-xs">
                  <Pill className="h-4 w-4" />
                </div>
                <span className="font-serif-title text-lg font-extrabold text-primary">
                  mediShop
                </span>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary ml-auto">
                  {isBn ? 'ডিজিডিএ অনুমোদিত' : 'DGDA Certified'}
                </span>
              </div>

              {/* Middle Section: Phone Mockup & App Preview */}
              <div className="relative z-10 my-auto py-4 flex items-center justify-center gap-6">
                {/* CSS/SVG Phone Graphic Mockup */}
                <div className="relative w-44 h-80 rounded-[32px] border-4 border-slate-800 bg-slate-900 p-2 shadow-2xl shrink-0 transition-transform hover:scale-102">
                  {/* Speaker Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-800 rounded-b-xl z-20" />

                  {/* Phone Screen Display */}
                  <div className="w-full h-full rounded-[24px] bg-background overflow-hidden flex flex-col text-[9px] pt-3">
                    {/* App Header & Search Bar */}
                    <div className="bg-primary p-2 text-white space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span>mediShop</span>
                        <ShieldCheck className="h-3 w-3 text-accent" />
                      </div>
                      <div className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-[8px] text-white/90">
                        <Search className="h-2.5 w-2.5 text-white/80" />
                        <span>{isBn ? 'ওষুধ খুঁজুন...' : 'Search medicine...'}</span>
                      </div>
                    </div>

                    {/* Quick Services Icons */}
                    <div className="grid grid-cols-3 gap-1 p-2 bg-muted/30 text-center text-[7px] font-bold text-foreground">
                      <div className="flex flex-col items-center p-1 rounded-lg bg-background shadow-2xs">
                        <Video className="h-3 w-3 text-cyan-600 mb-0.5" />
                        <span>{isBn ? 'ডাক্তার' : 'Doctor'}</span>
                      </div>
                      <div className="flex flex-col items-center p-1 rounded-lg bg-background shadow-2xs">
                        <Upload className="h-3 w-3 text-primary mb-0.5" />
                        <span>{isBn ? 'আপলোড' : 'Rx Upload'}</span>
                      </div>
                      <div className="flex flex-col items-center p-1 rounded-lg bg-background shadow-2xs">
                        <MessageSquare className="h-3 w-3 text-emerald-600 mb-0.5" />
                        <span>{isBn ? 'চ্যাট' : 'Chat'}</span>
                      </div>
                    </div>

                    {/* Mini Product Cards Preview */}
                    <div className="px-2 space-y-1 overflow-hidden flex-1">
                      <div className="flex justify-between font-bold text-[8px] text-foreground">
                        <span>{isBn ? 'জনপ্রিয় ওষুধ' : 'Popular OTC'}</span>
                        <span className="text-primary">{isBn ? 'সবগুলো' : 'View all'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="rounded-md border border-border p-1 bg-background space-y-0.5">
                          <div className="h-10 w-full rounded bg-sky-100 flex items-center justify-center font-bold text-primary text-[8px]">Rx</div>
                          <p className="font-bold text-[8px] truncate">Napa Extra</p>
                          <p className="text-[7px] font-bold text-primary">৳25</p>
                        </div>
                        <div className="rounded-md border border-border p-1 bg-background space-y-0.5">
                          <div className="h-10 w-full rounded bg-amber-100 flex items-center justify-center font-bold text-amber-700 text-[8px]">OTC</div>
                          <p className="font-bold text-[8px] truncate">Sergel 20mg</p>
                          <p className="text-[7px] font-bold text-primary">৳70</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slogan Text Beside Phone */}
                <div className="space-y-3 max-w-[200px]">
                  <div>
                    <h3 className="text-2xl font-black leading-tight bg-gradient-to-r from-[#00A3DA] via-primary to-teal-700 bg-clip-text text-transparent">
                      {isBn ? 'দেশের সেরা' : 'Best in BD'}
                    </h3>
                    <p className="text-xs font-extrabold text-foreground leading-snug mt-0.5">
                      {isBn ? 'ও সবচেয়ে নির্ভরযোগ্য ডিজিটাল হেলথ প্ল্যাটফর্ম' : 'Most Trusted Digital Health Platform'}
                    </p>
                  </div>

                  <div className="inline-block rounded-full bg-[#00A3DA]/10 border border-[#00A3DA]/30 px-3 py-1 text-[11px] font-extrabold text-[#00A3DA]">
                    {isBn ? 'এক অ্যাপেই পাবেন সব সমাধান' : 'All Solutions in One App'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Vibrant Cyan Sign-In Box (Col 5) */}
            <div className="col-span-12 md:col-span-5 relative bg-gradient-to-b from-[#00A3DA] to-[#008BBF] p-6 sm:p-8 flex flex-col justify-between text-white">
              {/* Red Close Button Top Right */}
              <button
                type="button"
                onClick={closeModal}
                aria-label={isBn ? 'বন্ধ করুন' : 'Close Modal'}
                className="absolute top-4 right-4 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white text-red-600 shadow-md transition-transform hover:scale-110 active:scale-95"
              >
                <X className="h-4 w-4 stroke-[3]" />
              </button>

              {/* Dynamic View Forms (SignIn, SignUp, OTP, Forgot) */}
              <div className="w-full flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authModalView}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="w-full"
                  >
                    {authModalView === 'signin' && <SignInForm />}
                    {authModalView === 'signup' && <SignUpForm />}
                    {authModalView === 'otp' && <OtpVerification />}
                    {authModalView === 'forgot' && <ForgotPasswordForm />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
