'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, Loader2, Pill, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createResetPasswordSchema, ResetPasswordSchemaType } from '@/validators/reset.schema';

export function ResetPasswordForm() {
  const { resetPassword, isLoading, serverError, fieldErrors, verificationToken } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = createResetPasswordSchema(isBn);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Inject backend field errors if present
  React.useEffect(() => {
    if (fieldErrors && fieldErrors.password) {
      setError('password', { message: fieldErrors.password });
    }
  }, [fieldErrors, setError]);

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    await resetPassword({
      verificationToken: verificationToken || '',
      password: data.password,
    });
  };

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
          {isBn ? 'নতুন পাসওয়ার্ড সেট করুন' : 'SET NEW PASSWORD'}
        </h2>
        <p className="text-[11px] text-white/80 max-w-xs">
          {isBn
            ? 'আপনার অ্যাকাউন্টের জন্য নতুন শক্তপোক্ত পাসওয়ার্ড দিন'
            : 'Enter your new account password'}
        </p>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="w-full rounded-2xl bg-rose-500/20 border border-rose-300/40 p-2.5 text-left flex items-start gap-2 text-xs text-rose-100 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-200 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Reset Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full text-left">
        {/* New Password Input */}
        <div className="flex flex-col gap-1 w-full">
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-white/70" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={isBn ? 'নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' : 'New Password (min 6 chars with letters & numbers)'}
              className={`w-full rounded-2xl bg-white/20 border py-3 pl-10 pr-10 text-xs sm:text-sm font-medium text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 transition-all ${
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

        {/* Confirm Password Input */}
        <div className="flex flex-col gap-1 w-full">
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4 w-4 text-white/70" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={isBn ? 'পাসওয়ার্ড পুনারায় লিখুন' : 'Confirm New Password'}
              className={`w-full rounded-2xl bg-white/20 border py-3 pl-10 pr-10 text-xs sm:text-sm font-medium text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 transition-all ${
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
              <span>{isBn ? 'পাসওয়ার্ড আপডেট হচ্ছে...' : 'Updating Password...'}</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>{isBn ? 'পাসওয়ার্ড পরিবর্তন সম্পন্ন করুন' : 'Confirm Reset Password'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
