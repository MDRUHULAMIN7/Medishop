'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ArrowLeft, Send, Pill } from 'lucide-react';
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
          {isBn ? 'পাসওয়ার্ড রিকভারি' : 'FORGOT PASSWORD'}
        </h2>
        <p className="text-[11px] text-white/80 max-w-xs">
          {isBn
            ? 'আপনার রেজিস্টার্ড মোবাইল নম্বর অথবা ইমেইল দিন'
            : 'Enter your registered mobile or email'}
        </p>
      </div>

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
              className={`w-full rounded-2xl bg-white/20 border border-white/40 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 ${
                errors.identifier ? 'border-rose-300' : ''
              }`}
              {...register('identifier')}
            />
          </div>
          {errors.identifier && (
            <span className="text-[11px] font-semibold text-rose-200">
              {errors.identifier.message}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-white py-3.5 px-4 text-sm font-extrabold text-[#00A3DA] shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 mt-1 disabled:opacity-80"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-[#00A3DA]" />
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
        <div className="text-center text-xs text-white/90 pt-2">
          <button
            type="button"
            onClick={() => setView('signin')}
            className="inline-flex items-center gap-1.5 font-bold text-white underline hover:text-amber-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isBn ? 'লগইন পেজে ফিরে যান' : 'Back to Sign In'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
