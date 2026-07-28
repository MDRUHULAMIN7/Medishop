'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createSignInSchema, SignInSchemaType } from '@/validators/signin.schema';
import { PasswordInput } from './PasswordInput';
import { SocialLoginPlaceholder } from './SocialLoginPlaceholder';

export function SignInForm() {
  const { login, isLoading, setView } = useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const schema = createSignInSchema(isBn);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: SignInSchemaType) => {
    await login({
      identifier: data.identifier,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
      {/* Email or Phone Field */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-xs font-semibold text-foreground">
          {isBn ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Mobile Number'}
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={
              isBn
                ? 'name@example.com অথবা 01700000000'
                : 'name@example.com or 01700000000'
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

      {/* Password Field */}
      <PasswordInput
        label={isBn ? 'পাসওয়ার্ড' : 'Password'}
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Options Row (Remember me & Forgot Password) */}
      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground">
          <input
            type="checkbox"
            className="rounded border-border text-primary focus:ring-primary"
            {...register('rememberMe')}
          />
          <span>{isBn ? 'মনে রাখুন' : 'Remember me'}</span>
        </label>

        <button
          type="button"
          onClick={() => setView('forgot')}
          className="font-semibold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
        </button>
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
            <span>{isBn ? 'লগইন হচ্ছে...' : 'Signing in...'}</span>
          </>
        ) : (
          <>
            <span>{isBn ? 'লগইন করুন' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Social Login Divider & Button */}
      <SocialLoginPlaceholder />

      {/* Switch to Sign Up */}
      <div className="text-center text-xs text-muted-foreground mt-1">
        <span>{isBn ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account? "}</span>
        <button
          type="button"
          onClick={() => setView('signup')}
          className="font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isBn ? 'রেজিস্ট্রেশন করুন' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
}
