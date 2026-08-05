'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Pill, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCountdown } from '@/hooks/useCountdown';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

export function OtpVerification() {
  const {
    verifyOtp,
    checkIdentifier,
    forgotPassword,
    isLoading,
    serverError,
    pendingIdentifier,
    pendingPhone,
    pendingEmail,
    flowContext,
    setView,
  } = useAuth();

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const targetIdentifier = pendingIdentifier || pendingPhone || pendingEmail || '01700000000';
  const { secondsLeft, isActive, startCountdown } = useCountdown(60);

  // Start countdown on mount
  useEffect(() => {
    startCountdown(60);
  }, [startCountdown]);

  // Focus first digit input box on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    const fullOtp = newOtp.join('');
    if (fullOtp.length === 6) {
      handleVerify(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 6) {
      toast.error(isBn ? '৬ ডিজিটের ওটিপি কোড সম্পন্ন করুন' : 'Enter complete 6-digit OTP');
      return;
    }

    await verifyOtp({
      identifier: targetIdentifier,
      otpCode: code,
      flowContext,
    });
  };

  const handleResend = async () => {
    if (isActive) return;
    startCountdown(60);
    setOtp(['', '', '', '', '', '']);

    if (flowContext === 'reset') {
      await forgotPassword({ identifier: targetIdentifier });
    } else {
      await checkIdentifier(targetIdentifier);
    }
  };

  const formattedTimer = `00:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center text-center text-white w-full max-w-md mx-auto space-y-4 py-2">
      {/* Brand Header */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-primary font-extrabold shadow-sm">
            <Pill className="h-4 w-4" />
          </div>
          <span className="font-serif-title text-2xl font-black text-white">
            mediShop
          </span>
        </div>
        <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase pt-1">
          {isBn ? 'ওটিপি ভেরিফাই করুন' : 'VERIFY OTP'}
        </h2>
        <p className="text-[11px] text-white/80 max-w-xs">
          <span className="font-bold text-white">{targetIdentifier}</span>{' '}
          {isBn ? 'নম্বরে পাঠানো ৬ ডিজিটের কোডটি দিন' : 'Enter the 6-digit code sent to your device'}
        </p>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="w-full rounded-2xl bg-rose-500/20 border border-rose-300/40 p-2.5 text-left flex items-start gap-2 text-xs text-rose-100 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-200 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* 6-Digit OTP Box Grid */}
      <div className="grid grid-cols-6 gap-2 w-full my-1">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            className="h-12 w-full rounded-xl bg-white/20 border border-white/40 text-center font-serif-title text-xl font-bold text-white focus:bg-white/30 focus:border-white focus:outline-hidden shadow-inner transition-all"
          />
        ))}
      </div>

      {/* Action Row: Timer Box + Verify OTP Button */}
      <div className="flex items-center gap-3 w-full pt-1">
        {/* Timer / Resend Container */}
        <div className="bg-white text-primary font-extrabold text-xs px-3.5 py-3 rounded-2xl shadow-md min-w-[85px] shrink-0 flex items-center justify-center">
          {isActive ? (
            <span>{formattedTimer}</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading}
              className="text-primary underline hover:text-primary-dark cursor-pointer font-bold"
            >
              {isBn ? 'পুনরায় পাঠান' : 'Resend Code'}
            </button>
          )}
        </div>

        {/* Verify OTP Button */}
        <button
          type="button"
          onClick={() => handleVerify()}
          disabled={isLoading || otp.join('').length < 6}
          className="flex-1 rounded-2xl bg-white py-3 px-4 text-xs sm:text-sm font-extrabold text-primary shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <span>{isBn ? 'ওটিপি ভেরিফাই' : 'Verify OTP'}</span>
          )}
        </button>
      </div>

      {/* Back to identifier input button */}
      <button
        type="button"
        onClick={() => setView('signin')}
        className="flex items-center gap-1.5 text-xs text-white/90 hover:text-white font-semibold underline pt-2 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{isBn ? 'আইডেন্টিফায়ার পরিবর্তন করুন' : 'Change Phone / Email'}</span>
      </button>
    </div>
  );
}
