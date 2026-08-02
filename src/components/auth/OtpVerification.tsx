'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Pill, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCountdown } from '@/hooks/useCountdown';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

export function OtpVerification() {
  const { verifyOtp, isLoading, pendingPhone, pendingEmail, setView } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const targetIdentifier = pendingPhone || pendingEmail || '01700000000';
  const { secondsLeft, isActive, startCountdown } = useCountdown(60);

  // Start countdown when view mounts
  useEffect(() => {
    startCountdown(60);
  }, [startCountdown]);

  // Focus first input box on mount
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
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
      toast.error(isBn ? '৬ ডিজিটের ওটিপি কোড সম্পূর্ণ করুন' : 'Enter complete 6-digit OTP');
      return;
    }

    await verifyOtp({
      identifier: targetIdentifier,
      otpCode: code,
    });
  };

  const handleResend = () => {
    if (isActive) return;
    startCountdown(60);
    toast.info(
      isBn
        ? `নতুন ওটিপি কোড ${targetIdentifier} নম্বরে পাঠানো হয়েছে (ডেমো: 123456)`
        : `New OTP sent to ${targetIdentifier} (Demo: 123456)`
    );
  };

  const formattedTimer = `00:${secondsLeft.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center text-center text-white w-full space-y-4">
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
        <h2 className="text-sm font-extrabold tracking-wider text-white/90 uppercase pt-2">
          {isBn ? 'ওটিপি ভেরিফাই করুন' : 'VERIFY OTP'}
        </h2>
        <p className="text-[11px] text-white/80">
          {targetIdentifier} {isBn ? 'নম্বরে পাঠানো ৬ ডিজিটের কোড দিন (ডেমো: 123456)' : 'Enter code sent (Demo: 123456)'}
        </p>
      </div>

      {/* 6-Digit OTP Box Grid (Matches Image 2) */}
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
            className="h-12 w-full rounded-xl bg-white/20 border border-white/40 text-center font-serif-title text-xl font-bold text-white focus:bg-white/30 focus:border-white focus:outline-hidden shadow-inner"
          />
        ))}
      </div>

      {/* Legal Disclaimer Link */}
      <p className="text-[10px] text-center text-white/80 leading-snug px-1">
        {isBn ? 'এগিয়ে যাওয়ার মাধ্যমে আপনি মেডিশপের ' : 'By continuing you agree to '}
        <Link href="/terms" className="underline hover:text-white font-semibold">
          {isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms & Conditions'}
        </Link>
        {', '}
        <Link href="/privacy" className="underline hover:text-white font-semibold">
          {isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
        </Link>
        {' & '}
        <Link href="/refund-policy" className="underline hover:text-white font-semibold">
          {isBn ? 'রিফান্ড নীতি' : 'Refund-Return Policy'}
        </Link>
      </p>

      {/* Action Row: Timer Box + Verify OTP Button (Matches Image 2) */}
      <div className="flex items-center gap-3 w-full">
        {/* Timer / Resend Container */}
        <div className="bg-white text-primary font-extrabold text-xs px-3.5 py-3 rounded-2xl shadow-md min-w-[85px] shrink-0 flex items-center justify-center">
          {isActive ? (
            <span>{formattedTimer}</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-primary underline hover:text-primary-dark"
            >
              {isBn ? 'পুনরায়' : 'Resend'}
            </button>
          )}
        </div>

        {/* Verify OTP Button */}
        <button
          type="button"
          onClick={() => handleVerify()}
          disabled={isLoading || otp.join('').length < 6}
          className="flex-1 rounded-2xl bg-white py-3 px-4 text-xs sm:text-sm font-extrabold text-primary shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <span>{isBn ? 'ওটিপি ভেরিফাই' : 'Verify OTP'}</span>
          )}
        </button>
      </div>

      {/* Back to phone input button */}
      <button
        type="button"
        onClick={() => setView('signin')}
        className="flex items-center gap-1 text-xs text-white/90 hover:text-white font-semibold underline pt-1"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{isBn ? 'নম্বর পরিবর্তন করুন' : 'Change Phone Number'}</span>
      </button>

      {/* Social Login Section */}
      <div className="w-full space-y-3 pt-2">
        <p className="text-[11px] text-white/80 font-medium">
          {isBn ? 'অথবা সামাজিক মাধ্যমে প্রবেশ করুন' : 'or continue with'}
        </p>
        <div className="flex items-center justify-center gap-3">
          {/* Facebook */}
          <button
            type="button"
            onClick={() => toast.info(isBn ? 'ফেসবুক লগইন পরবর্তী ফেজে যুক্ত করা হবে' : 'Facebook login coming soon')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1877F2] font-black text-lg shadow-md hover:scale-110 active:scale-95 transition-all"
            title="Facebook"
          >
            f
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={() => toast.info(isBn ? 'গুগল লগইন পরবর্তী ফেজে যুক্ত করা হবে' : 'Google login coming soon')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:scale-110 active:scale-95 transition-all"
            title="Google"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
