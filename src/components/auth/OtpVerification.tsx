'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Loader2, CheckCircle2, RefreshCw, ArrowLeft } from 'lucide-react';
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

  return (
    <div className="flex flex-col items-center gap-5 w-full py-2">
      {/* Target Identifier Notice */}
      <div className="rounded-2xl bg-primary/10 border border-primary/20 p-3.5 text-center w-full">
        <p className="text-xs text-muted-foreground">
          {isBn
            ? 'আমরা ৬ ডিজিটের ভেরিফিকেশন কোড পাঠিয়েছি:'
            : 'We sent a 6-digit verification code to:'}
        </p>
        <p className="text-sm font-bold text-primary mt-0.5">
          {targetIdentifier}
        </p>
        <p className="text-[11px] text-accent-dark font-semibold mt-1">
          {isBn ? '💡 ডেমো ওটিপি কোড: 123456' : '💡 Demo OTP Code: 123456'}
        </p>
      </div>

      {/* 6 Digit beUI OTP Inputs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 w-full my-2">
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
            className="h-12 w-10 sm:h-14 sm:w-12 rounded-2xl border-2 border-border bg-muted/20 text-center font-serif-title text-xl font-bold text-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={() => handleVerify()}
        disabled={isLoading || otp.join('').length < 6}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark active:scale-98 disabled:opacity-60"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{isBn ? 'ভেরিফাই হচ্ছে...' : 'Verifying...'}</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4" />
            <span>{isBn ? 'ভেরিফাই করুন' : 'Verify & Continue'}</span>
          </>
        )}
      </button>

      {/* Resend Code Section */}
      <div className="flex items-center justify-between w-full text-xs text-muted-foreground px-1">
        <button
          type="button"
          onClick={() => setView('signup')}
          className="flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isBn ? 'পিছনে যান' : 'Back'}</span>
        </button>

        <div>
          {isActive ? (
            <span className="font-semibold text-primary">
              {isBn
                ? `পুনরায় পাঠান (${secondsLeft} সেকেন্ড)`
                : `Resend code in (${secondsLeft}s)`}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="flex items-center gap-1 font-bold text-primary hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isBn ? 'কোড পুনরায় পাঠান' : 'Resend Code'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
