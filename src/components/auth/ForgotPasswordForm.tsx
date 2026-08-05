'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ArrowLeft, Send, Pill, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createForgotSchema, ForgotSchemaType } from '@/validators/forgot.schema';

export function ForgotPasswordForm() {
  const { forgotPassword, isLoading, serverError, fieldErrors, setView } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const schema = createForgotSchema(isBn);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForgotSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '',
    },
  });

  // Inject backend field errors if present
  React.useEffect(() => {
    if (fieldErrors && fieldErrors.identifier) {
      setError('identifier', { message: fieldErrors.identifier });
    }
  }, [fieldErrors, setError]);

  const onSubmit = async (data: ForgotSchemaType) => {
    await forgotPassword({
      identifier: data.identifier,
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
          {isBn ? 'পাসওয়ার্ড রিকভারি' : 'FORGOT PASSWORD'}
        </h2>
        <p className="text-[11px] text-white/80 max-w-xs">
          {isBn
            ? 'আপনার রেজিস্টার্ড মোবাইল নম্বর অথবা ইমেইল দিন'
            : 'Enter your registered mobile or email to receive reset OTP'}
        </p>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="w-full rounded-2xl bg-rose-500/20 border border-rose-300/40 p-2.5 text-left flex items-start gap-2 text-xs text-rose-100 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-200 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full text-left">
        {/* Identifier Input */}
        <div className="flex flex-col gap-1 w-full">
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4 w-4 text-white/70" />
            <input
              type="text"
              placeholder={
                isBn ? 'মোবাইল নম্বর অথবা ইমেইল লিখুন' : 'Email or Mobile Number'
              }
              className={`w-full rounded-2xl bg-white/20 border py-3 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 transition-all ${
                errors.identifier ? 'border-rose-300 bg-rose-500/10' : 'border-white/40 focus:border-white'
              }`}
              {...register('identifier')}
            />
          </div>
          {errors.identifier && (
            <span className="text-[11px] font-semibold text-rose-200 px-1">
              {errors.identifier.message}
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
              <span>{isBn ? 'পাঠানো হচ্ছে...' : 'Sending Code...'}</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>{isBn ? 'রিসেট ওটিপি পাঠান' : 'Send Reset OTP'}</span>
            </>
          )}
        </button>

        {/* Return to Sign In */}
        <div className="text-center text-xs text-white/90 pt-2">
          <button
            type="button"
            onClick={() => setView('signin')}
            className="inline-flex items-center gap-1.5 font-bold text-white underline hover:text-amber-200 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isBn ? 'লগইন পেজে ফিরে যান' : 'Back to Log In'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
