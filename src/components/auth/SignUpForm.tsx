'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserIcon, Mail, Phone, Loader2, Pill, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createSignUpSchema, SignUpSchemaType } from '@/validators/signup.schema';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function SignUpForm() {
  const { register: registerAuth, isLoading, setView } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const schema = createSignUpSchema(isBn);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      identifierType: 'phone',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: true,
    },
  });

  const identifierType = watch('identifierType');

  const onSubmit = async (data: SignUpSchemaType) => {
    await registerAuth(data);
  };

  return (
    <div className="flex flex-col items-center text-center text-white w-full space-y-3">
      {/* Brand Header */}
      <div className="flex flex-col items-center space-y-0.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-[#00A3DA] font-extrabold shadow-sm">
            <Pill className="h-4 w-4" />
          </div>
          <span className="font-serif-title text-xl font-black text-white">
            mediShop
          </span>
        </div>
        <h2 className="text-xs font-extrabold tracking-wider text-white/90 uppercase pt-1">
          {isBn ? 'নতুন অ্যাকাউন্ট খুলুন' : 'CREATE ACCOUNT'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2.5 w-full text-left">
        {/* Full Name */}
        <div className="flex flex-col gap-1 w-full">
          <div className="relative flex items-center">
            <UserIcon className="absolute left-3.5 h-4 w-4 text-white/70" />
            <input
              type="text"
              placeholder={isBn ? 'আপনার পূর্ণ নাম' : 'Full Name'}
              className="w-full rounded-xl bg-white/20 border border-white/40 py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30"
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <span className="text-[10px] font-semibold text-rose-200">
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* Mobile / Email Selection */}
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-white">
              {identifierType === 'phone' ? (isBn ? 'মোবাইল নম্বর' : 'Mobile Number') : (isBn ? 'ইমেইল এড্রেস' : 'Email Address')}
            </span>
            <div className="flex rounded-lg bg-white/20 p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setValue('identifierType', 'phone')}
                className={cn(
                  'rounded-md px-2 py-0.5 transition-colors',
                  identifierType === 'phone'
                    ? 'bg-white text-[#00A3DA]'
                    : 'text-white'
                )}
              >
                {isBn ? 'ফোন' : 'Phone'}
              </button>
              <button
                type="button"
                onClick={() => setValue('identifierType', 'email')}
                className={cn(
                  'rounded-md px-2 py-0.5 transition-colors',
                  identifierType === 'email'
                    ? 'bg-white text-[#00A3DA]'
                    : 'text-white'
                )}
              >
                {isBn ? 'ইমেইল' : 'Email'}
              </button>
            </div>
          </div>

          <div className="relative flex items-center">
            {identifierType === 'phone' ? (
              <Phone className="absolute left-3.5 h-4 w-4 text-white/70" />
            ) : (
              <Mail className="absolute left-3.5 h-4 w-4 text-white/70" />
            )}

            {identifierType === 'phone' ? (
              <input
                type="tel"
                placeholder="01700000000"
                className="w-full rounded-xl bg-white/20 border border-white/40 py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30"
                {...register('phone')}
              />
            ) : (
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full rounded-xl bg-white/20 border border-white/40 py-2.5 pl-10 pr-3.5 text-xs text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30"
                {...register('email')}
              />
            )}
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1 w-full">
          <input
            type="password"
            placeholder={isBn ? 'পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)' : 'Password (min 8 chars)'}
            className="w-full rounded-xl bg-white/20 border border-white/40 py-2.5 px-3.5 text-xs text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30"
            {...register('password')}
          />
        </div>

        {/* Legal Disclaimer */}
        <p className="text-[10px] text-center text-white/80 leading-snug">
          {isBn ? 'এগিয়ে যাওয়ার মাধ্যমে আপনি ' : 'By continuing you agree to '}
          <Link href="/terms" className="underline hover:text-white font-semibold">
            {isBn ? 'শর্তাবলী' : 'Terms'}
          </Link>
          {' & '}
          <Link href="/privacy" className="underline hover:text-white font-semibold">
            {isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
          </Link>
        </p>

        {/* Create Account Primary Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-white py-3 px-4 text-xs sm:text-sm font-extrabold text-[#00A3DA] shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 mt-1 disabled:opacity-80"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-[#00A3DA]" />
          ) : (
            <span>{isBn ? 'অ্যাকাউন্ট খুলুন' : 'Create Account'}</span>
          )}
        </button>

        {/* Back to Sign In */}
        <div className="text-center text-xs text-white/90 pt-1">
          <span>{isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? '}</span>
          <button
            type="button"
            onClick={() => setView('signin')}
            className="font-extrabold text-white underline hover:text-amber-200"
          >
            {isBn ? 'লগইন করুন' : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}
