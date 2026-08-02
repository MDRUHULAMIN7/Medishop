'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Loader2, ArrowRight, KeyRound, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createSignInSchema, SignInSchemaType } from '@/validators/signin.schema';
import { PasswordInput } from './PasswordInput';
import { toast } from 'sonner';

export function SignInForm() {
  const { login, sendOtp, isLoading, setView } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  const schema = createSignInSchema(isBn);

  const {
    register,
    handleSubmit,
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
    // Send OTP & transition view
    sendOtp(identifierValue);
  };

  const onPasswordLoginSubmit = async (data: SignInSchemaType) => {
    await login({
      identifier: data.identifier,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  return (
    <div className="flex flex-col items-center text-center text-white w-full space-y-4">
      {/* Brand Header */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#00A3DA] font-extrabold shadow-sm">
            <Pill className="h-4 w-4" />
          </div>
          <span className="font-serif-title text-2xl font-black text-white">
            mediShop
          </span>
        </div>
        <h2 className="text-sm font-extrabold tracking-wider text-white/90 uppercase pt-2">
          {isBn ? 'লগইন করুন' : 'PLEASE LOG IN'}
        </h2>
      </div>

      {authMode === 'otp' ? (
        /* OTP Phone Login Form (Matches Image 1) */
        <form onSubmit={handleSendOtpSubmit} className="flex flex-col gap-4 w-full text-left">
          {/* Phone Input Box with +88 Prefix */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center rounded-2xl bg-white/20 border border-white/40 p-1 focus-within:border-white focus-within:bg-white/30 transition-all">
              <div className="bg-white text-[#00A3DA] font-extrabold px-3 py-2.5 rounded-xl text-sm shadow-xs flex items-center justify-center shrink-0">
                +88
              </div>
              <input
                type="tel"
                placeholder={isBn ? 'আপনার মোবাইল নম্বর লিখুন' : 'Your Contact Number'}
                className="w-full bg-transparent border-none px-3 py-2 text-sm text-white placeholder:text-white/70 focus:outline-hidden"
                {...register('identifier')}
              />
            </div>
            {errors.identifier && (
              <span className="text-[11px] font-semibold text-rose-200">
                {errors.identifier.message}
              </span>
            )}
          </div>

          {/* Legal Disclaimer Terms Link */}
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

          {/* Send OTP Primary Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-white py-3.5 px-4 text-sm font-extrabold text-[#00A3DA] shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-[#00A3DA]" />
                <span>{isBn ? 'কোড পাঠানো হচ্ছে...' : 'Sending OTP...'}</span>
              </>
            ) : (
              <span>{isBn ? 'ওটিপি পাঠান' : 'Send OTP'}</span>
            )}
          </button>

          {/* Password Login Alternative */}
          <button
            type="button"
            onClick={() => setAuthMode('password')}
            className="text-[11px] font-semibold text-white/90 hover:text-white underline text-center transition-colors pt-1"
          >
            {isBn ? 'পাসওয়ার্ড দিয়ে প্রবেশ করুন' : 'Login with Email / Password'}
          </button>
        </form>
      ) : (
        /* Password Login Form Alternative */
        <form onSubmit={handleSubmit(onPasswordLoginSubmit)} className="flex flex-col gap-3 w-full text-left">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-bold text-white">
              {isBn ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Mobile'}
            </label>
            <input
              type="text"
              placeholder="01700000000 / name@email.com"
              className="w-full rounded-xl bg-white/20 border border-white/40 px-3.5 py-2.5 text-sm text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30"
              {...register('identifier')}
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-bold text-white">
              {isBn ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/20 border border-white/40 px-3.5 py-2.5 text-sm text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30"
              {...register('password')}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-white/90">
            <button
              type="button"
              onClick={() => setView('forgot')}
              className="hover:underline font-semibold"
            >
              {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('otp')}
              className="hover:underline font-bold text-white"
            >
              {isBn ? 'ওটিপি লগইন' : 'OTP Login'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-white py-3.5 px-4 text-sm font-extrabold text-[#00A3DA] shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 mt-1"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#00A3DA]" />
            ) : (
              <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
            )}
          </button>
        </form>
      )}

      {/* Social Login Divider & Buttons */}
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

      {/* Switch to Sign Up */}
      <div className="text-xs text-white/90 pt-1">
        <span>{isBn ? 'নতুন অ্যাকাউন্ট খুলতে চান? ' : "Don't have an account? "}</span>
        <button
          type="button"
          onClick={() => setView('signup')}
          className="font-extrabold text-white underline hover:text-amber-200"
        >
          {isBn ? 'রেজিস্ট্রেশন করুন' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
}
