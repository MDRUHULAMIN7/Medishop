'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { AuthHeader } from './AuthHeader';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { OtpVerification } from './OtpVerification';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export function AuthModal() {
  const { isAuthModalOpen, authModalView, closeModal } = useAuth();

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            aria-hidden="true"
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
          >
            {/* Header */}
            <AuthHeader view={authModalView} onClose={closeModal} />

            {/* Dynamic Form View Container */}
            <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={authModalView}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {authModalView === 'signin' && <SignInForm />}
                  {authModalView === 'signup' && <SignUpForm />}
                  {authModalView === 'otp' && <OtpVerification />}
                  {authModalView === 'forgot' && <ForgotPasswordForm />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
