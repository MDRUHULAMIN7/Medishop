'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createSignInSchema, SignInSchemaType } from '@/validators/signin.schema';
import { toast } from 'sonner';

export function SignInForm() {
  const { sendOtp, isLoading } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const schema = createSignInSchema(isBn);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: true,
    },
  });

  const identifierValue = watch('identifier');

  const handleSendOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifierValue || identifierValue.trim().length < 6) {
      toast.error(isBn ? 'সঠিক মোবাইল নম্বর প্রদান করুন' : 'Please enter a valid mobile number');
      return;
    }
    sendOtp(identifierValue);
  };

  return (
    <div className="flex flex-col items-center text-center text-white w-full max-w-md mx-auto space-y-7 py-2">
      {/* Brand Header */}
      <div className="flex flex-col items-center space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary font-black shadow-xs">
            <Pill className="h-5 w-5" />
          </div>
          <span className="font-serif-title text-3xl font-black tracking-tight text-white">
            mediShop
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-black tracking-wider text-white uppercase">
          {isBn ? 'লগইন করুন' : 'PLEASE LOG IN'}
        </h2>
      </div>

      {/* OTP Phone Login Form */}
      <form onSubmit={handleSendOtpSubmit} className="flex flex-col gap-5 w-full text-left">
        {/* Phone Input Box with +88 Prefix */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center rounded-2xl bg-white/20 border border-white/40 p-1 focus-within:border-white focus-within:bg-white/30 transition-all">
            <div className="bg-white text-primary font-extrabold px-3.5 py-2.5 rounded-xl text-sm shadow-xs flex items-center justify-center shrink-0">
              +88
            </div>
            <input
              type="tel"
              placeholder={isBn ? 'আপনার মোবাইল নম্বর' : 'Your Contact Number'}
              className="w-full bg-transparent border-none px-3.5 py-2.5 text-sm font-medium text-white placeholder:text-white/80 focus:outline-hidden"
              {...register('identifier')}
            />
          </div>
          {errors.identifier && (
            <span className="text-xs font-semibold text-rose-200 px-1">
              {errors.identifier.message}
            </span>
          )}
        </div>

        {/* Legal Disclaimer Terms Link */}
        <p className="text-xs sm:text-sm text-center text-white/90 leading-relaxed px-1 font-medium">
          {isBn ? 'এগিয়ে যাওয়ার মাধ্যমে আপনি মেডিশপের ' : 'By continuing you agree to '}
          <Link href="/terms" className="underline hover:text-white font-bold">
            {isBn ? 'ব্যবহারের শর্তাবলী' : 'Terms & Conditions'}
          </Link>
          {', '}
          <Link href="/privacy" className="underline hover:text-white font-bold">
            {isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
          </Link>
          {' & '}
          <Link href="/refund-policy" className="underline hover:text-white font-bold">
            {isBn ? 'রিফান্ড নীতি' : 'Refund-Return Policy'}
          </Link>
        </p>

        {/* Send OTP Primary Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-white py-3.5 px-4 text-sm font-extrabold text-primary shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-80 mt-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{isBn ? 'কোড পাঠানো হচ্ছে...' : 'Sending OTP...'}</span>
            </>
          ) : (
            <span>{isBn ? 'ওটিপি পাঠান' : 'Send OTP'}</span>
          )}
        </button>
      </form>

      {/* Social Login Divider & Buttons */}
      <div className="w-full space-y-3.5 pt-2">
        <p className="text-sm sm:text-base text-white/90 font-semibold">
          {isBn ? 'অথবা' : 'or continue with'}
        </p>
        <div className="flex items-center justify-center gap-4">
          {/* Facebook */}
          <button
            type="button"
            onClick={() => toast.info(isBn ? 'ফেসবুক লগইন পরবর্তী ফেজে যুক্ত করা হবে' : 'Facebook login coming soon')}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1877F2] font-black text-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
            title="Facebook"
          >
            f
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={() => toast.info(isBn ? 'গুগল লগইন পরবর্তী ফেজে যুক্ত করা হবে' : 'Google login coming soon')}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg hover:scale-110 active:scale-95 transition-all"
            title="Google"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24">
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
