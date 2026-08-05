'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Eye, EyeOff, Loader2, Pill, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createSignUpSchema, SignUpSchemaType } from '@/validators/signup.schema';

export function CompleteRegistrationForm() {
  const { completeRegistration, isLoading, serverError, fieldErrors, pendingIdentifier } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = createSignUpSchema(isBn);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      identifier: pendingIdentifier,
      password: '',
      confirmPassword: '',
      agreeToTerms: true,
    },
  });

  // Inject backend field errors if present
  React.useEffect(() => {
    if (fieldErrors && Object.keys(fieldErrors).length > 0) {
      Object.entries(fieldErrors).forEach(([field, message]) => {
        if (field === 'name') setError('fullName', { message });
        if (field === 'password') setError('password', { message });
      });
    }
  }, [fieldErrors, setError]);

  const onSubmit = async (data: SignUpSchemaType) => {
    await completeRegistration(data.fullName, data.password);
  };

  return (
    <div className="flex flex-col items-center text-center text-white w-full max-w-md mx-auto space-y-4 py-2">
      {/* Brand Header */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-primary font-black shadow-xs">
            <Pill className="h-4 w-4" />
          </div>
          <span className="font-serif-title text-2xl font-black text-white">
            mediShop
          </span>
        </div>
        <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-white uppercase pt-1">
          {isBn ? 'অ্যাকাউন্ট তৈরি সম্পূর্ণ করুন' : 'COMPLETE REGISTRATION'}
        </h2>
        <p className="text-[11px] text-white/80 max-w-xs">
          {isBn
            ? 'আপনার পূর্ণ নাম দিন এবং একটি নতুন পাসওয়ার্ড সেট করুন'
            : 'Enter your full name and create a password for your account'}
        </p>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="w-full rounded-2xl bg-rose-500/20 border border-rose-300/40 p-2.5 text-left flex items-start gap-2 text-xs text-rose-100 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-200 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Complete Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full text-left">
        <input type="hidden" value={pendingIdentifier} {...register('identifier')} />

        {/* Full Name Input */}
        <div className="flex flex-col gap-1 w-full">
          <div className="relative flex items-center">
            <User className="absolute left-3.5 h-4 w-4 text-white/70" />
            <input
              type="text"
              placeholder={isBn ? 'আপনার পূর্ণ নাম (যেমন: মোঃ রফিকুল ইসলাম)' : 'Your Full Name'}
              autoFocus
              className={`w-full rounded-2xl bg-white/20 border py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 transition-all ${
                errors.fullName ? 'border-rose-300 bg-rose-500/10' : 'border-white/40 focus:border-white'
              }`}
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <span className="text-[11px] font-semibold text-rose-200 px-1">
              {errors.fullName.message}
            </span>
          )}
        </div>

        {/* Password Input with Show/Hide Toggle */}
        <div className="flex flex-col gap-1 w-full">
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-white/70" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={isBn ? 'নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর, অক্ষর ও সংখ্যা)' : 'Password (min 6 chars with letters & numbers)'}
              className={`w-full rounded-2xl bg-white/20 border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 transition-all ${
                errors.password ? 'border-rose-300 bg-rose-500/10' : 'border-white/40 focus:border-white'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 text-white/70 hover:text-white focus:outline-hidden p-1 cursor-pointer transition-all"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-[11px] font-semibold text-rose-200 px-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Confirm Password Input with Show/Hide Toggle */}
        <div className="flex flex-col gap-1 w-full">
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-white/70" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
              className={`w-full rounded-2xl bg-white/20 border py-2.5 pl-10 pr-10 text-xs sm:text-sm font-medium text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 transition-all ${
                errors.confirmPassword ? 'border-rose-300 bg-rose-500/10' : 'border-white/40 focus:border-white'
              }`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 text-white/70 hover:text-white focus:outline-hidden p-1 cursor-pointer transition-all"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="text-[11px] font-semibold text-rose-200 px-1">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-white py-3.5 px-4 text-xs sm:text-sm font-extrabold text-primary shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 mt-1 disabled:opacity-80 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{isBn ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...'}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>{isBn ? 'রেজিস্ট্রেশন সম্পূর্ণ করুন' : 'Complete Registration'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
