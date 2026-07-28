'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createForgotSchema, ForgotSchemaType } from '@/validators/forgot.schema';

export function ForgotPasswordForm() {
  const { forgotPassword, isLoading, setView } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const schema = createForgotSchema(isBn);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '',
    },
  });

  const onSubmit = async (data: ForgotSchemaType) => {
    await forgotPassword({
      identifier: data.identifier,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      <p className="text-xs text-muted-foreground leading-relaxed">
        {isBn
          ? 'আপনার অ্যাকাউন্টের সাথে যুক্ত ইমেইল অথবা মোবাইল নম্বর দিন। আমরা পাসওয়ার্ড রিকভারি নির্দেশনা পাঠিয়ে দেব।'
          : 'Enter your registered email or mobile number. We will send password reset instructions.'}
      </p>

      {/* Identifier Input */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-xs font-semibold text-foreground">
          {isBn ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Mobile Number'}
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              isBn ? 'name@example.com অথবা 01700000000' : 'name@example.com or 01700000000'
            }
            className={`w-full rounded-2xl border border-border bg-muted/20 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden ${
              errors.identifier ? 'border-danger focus:border-danger' : ''
            }`}
            {...register('identifier')}
          />
        </div>
        {errors.identifier && (
          <span className="text-[11px] font-medium text-danger">
            {errors.identifier.message}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 px-4 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark active:scale-98 disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{isBn ? 'পাঠানো হচ্ছে...' : 'Sending Link...'}</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>{isBn ? 'রিসেট লিংক পাঠান' : 'Send Reset Link'}</span>
          </>
        )}
      </button>

      {/* Return to Sign In */}
      <div className="text-center text-xs mt-2">
        <button
          type="button"
          onClick={() => setView('signin')}
          className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isBn ? 'লগইন পেজে ফিরে যান' : 'Back to Sign In'}</span>
        </button>
      </div>
    </form>
  );
}
