'use client';

import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Loader2, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createForgotSchema, ForgotSchemaType } from '@/validators/forgot.schema';

export function IdentifierForm() {
  const { checkIdentifier, isLoading, serverError, fieldErrors } = useAuth();
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
    await checkIdentifier(data.identifier);
  };

  return (
    <div className="flex flex-col items-center text-center text-white w-full max-w-md mx-auto space-y-5 py-2">
      {/* Brand Header */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary font-black shadow-xs">
            <Pill className="h-5 w-5" />
          </div>
          <span className="font-serif-title text-3xl font-black tracking-tight text-white">
            mediShop
          </span>
        </div>
        <h2 className="text-base sm:text-lg font-black tracking-wider text-white uppercase pt-1">
          {isBn ? 'লগইন বা রেজিস্টার করুন' : 'SIGN IN / REGISTER'}
        </h2>
        <p className="text-xs sm:text-sm text-white/90 font-medium max-w-xs">
          {isBn
            ? 'আপনার ইমেইল অথবা ১১ ডিজিটের মোবাইল নম্বর দিন'
            : 'Enter your email or 11-digit BD mobile number to continue'}
        </p>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="w-full rounded-2xl bg-rose-500/20 border border-rose-300/40 p-3 text-left flex items-start gap-2.5 text-xs text-rose-100 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-200 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Single Input Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full text-left">
        {/* Identifier Input Box */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 h-4.5 w-4.5 text-white/70" />
            <input
              type="text"
              placeholder={
                isBn ? 'মোবাইল নম্বর (যেমন: 01700000000) বা ইমেইল' : 'Mobile Number or Email Address'
              }
              className={`w-full rounded-2xl bg-white/20 border py-3.5 pl-11 pr-4 text-sm font-medium text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 transition-all ${
                errors.identifier ? 'border-rose-300 bg-rose-500/10' : 'border-white/40 focus:border-white'
              }`}
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
        <p className="text-[11px] sm:text-xs text-center text-white/80 leading-relaxed px-1 font-medium">
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
            {isBn ? 'রিফান্ড নীতি' : 'Refund Policy'}
          </Link>
        </p>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-white py-3.5 px-4 text-sm font-extrabold text-primary shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-80 mt-1 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{isBn ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
            </>
          ) : (
            <>
              <span>{isBn ? 'এগিয়ে যান' : 'Continue'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
