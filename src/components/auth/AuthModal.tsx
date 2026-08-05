'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pill, Search, ShieldCheck, Upload, MessageSquare, Video, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';

import { IdentifierForm } from './IdentifierForm';
import { PasswordLoginForm } from './PasswordLoginForm';
import { OtpVerification } from './OtpVerification';
import { CompleteRegistrationForm } from './CompleteRegistrationForm';
import { ResetPasswordForm } from './ResetPasswordForm';

export function AuthModal() {
  const { isAuthModalOpen, authModalView, closeModal, flowContext } = useAuth();
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

  // Helper for rendering progressive stage indicator
  const getStageStep = () => {
    switch (authModalView) {
      case 'identifier':
        return 1;
      case 'password_login':
        return 2;
      case 'verify_otp':
        return 2;
      case 'complete_registration':
        return 3;
      case 'reset_password':
        return 3;
      default:
        return 1;
    }
  };

  const currentStep = getStageStep();

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
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-background shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[530px]"
          >
            {/* Left Side: Hero Banner & Phone Graphic Mockup */}
            <div className="hidden md:flex md:col-span-7 flex-col justify-between p-6 lg:p-8 bg-gradient-to-br from-primary-soft via-muted/50 to-primary-soft/80 border-r border-border relative overflow-hidden">
              {/* Decorative Background Glow Circles */}
              <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-primary/15 blur-3xl" />

              {/* Top Badge */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-xs">
                  <Pill className="h-4.5 w-4.5" />
                </div>
                <span className="font-serif-title text-xl font-extrabold text-primary">
                  mediShop
                </span>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary ml-auto flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
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
                        <Video className="h-3 w-3 text-primary mb-0.5" />
                        <span>{isBn ? 'ডাক্তার' : 'Doctor'}</span>
                      </div>
                      <div className="flex flex-col items-center p-1 rounded-lg bg-background shadow-2xs">
                        <Upload className="h-3 w-3 text-primary mb-0.5" />
                        <span>{isBn ? 'আপলোড' : 'Rx Upload'}</span>
                      </div>
                      <div className="flex flex-col items-center p-1 rounded-lg bg-background shadow-2xs">
                        <MessageSquare className="h-3 w-3 text-success mb-0.5" />
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
                          <div className="h-10 w-full rounded bg-primary-soft flex items-center justify-center font-bold text-primary text-[8px]">Rx</div>
                          <p className="font-bold text-[8px] truncate">Napa Extra</p>
                          <p className="text-[7px] font-bold text-primary">৳25</p>
                        </div>
                        <div className="rounded-md border border-border p-1 bg-background space-y-0.5">
                          <div className="h-10 w-full rounded bg-accent-light flex items-center justify-center font-bold text-accent-dark text-[8px]">OTC</div>
                          <p className="font-bold text-[8px] truncate">Sergel 20mg</p>
                          <p className="text-[7px] font-bold text-primary">৳70</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Slogan Text Beside Phone */}
                <div className="space-y-4 max-w-[280px]">
                  <div>
                    <h3 className="text-4xl lg:text-5xl font-black leading-none text-primary tracking-tight">
                      {isBn ? 'দেশের সেরা' : 'Best in BD'}
                    </h3>
                    <p className="text-base lg:text-lg font-bold text-foreground leading-snug mt-2">
                      {isBn ? 'ও সবচেয়ে নির্ভরযোগ্য ডিজিটাল হেলথ প্ল্যাটফর্ম' : 'Most Trusted Digital Health Platform'}
                    </p>
                  </div>

                  <div className="inline-block rounded-full bg-primary/10 border border-primary/30 px-4 py-2 text-sm lg:text-base font-black text-primary">
                    {isBn ? 'এক অ্যাপেই পাবেন সব সমাধান' : 'All Solutions in One App'}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Staged Progressive Auth Container (Col 5) */}
            <div className="col-span-12 md:col-span-5 relative bg-gradient-to-b from-primary to-primary-dark p-6 sm:p-8 flex flex-col justify-between text-white">
              {/* Top Navigation & Step Pills */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                      currentStep >= 1 ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                  <div
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                      currentStep >= 2 ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                  <div
                    className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                      currentStep >= 3 ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                </div>

                {/* Close Button Top Right */}
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label={isBn ? 'বন্ধ করুন' : 'Close Modal'}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white hover:text-primary transition-all active:scale-95 shadow-md cursor-pointer"
                >
                  <X className="h-4 w-4 stroke-[3]" />
                </button>
              </div>

              {/* Dynamic View Forms with Smooth Framer Motion Transitions */}
              <div className="w-full flex-1 flex flex-col justify-center my-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authModalView}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="w-full"
                  >
                    {(authModalView === 'identifier' ||
                      authModalView === 'signin' ||
                      authModalView === 'signup' ||
                      authModalView === 'forgot') && <IdentifierForm />}

                    {authModalView === 'password_login' && <PasswordLoginForm />}

                    {(authModalView === 'verify_otp' || authModalView === 'otp') && (
                      <OtpVerification />
                    )}

                    {authModalView === 'complete_registration' && <CompleteRegistrationForm />}

                    {authModalView === 'reset_password' && <ResetPasswordForm />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Bottom Security Footer */}
              <div className="pt-3 text-[10px] text-center text-white/70 border-t border-white/10 mt-auto">
                {isBn ? '🔒 ২৫৬-বিট এনক্রিপশনের মাধ্যমে সুরক্ষিত' : '🔒 Secured with 256-Bit SSL Encryption'}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
