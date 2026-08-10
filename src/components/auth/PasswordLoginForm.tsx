'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pill, Loader2, Lock, Eye, EyeOff, Edit2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createSignInSchema, SignInSchemaType } from '@/validators/signin.schema';

export function PasswordLoginForm() {
  const { login, forgotPassword, isLoading, serverError, fieldErrors, pendingIdentifier, setView } =
    useAuth();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [showPassword, setShowPassword] = useState(false);

  const schema = createSignInSchema(isBn);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: pendingIdentifier,
      password: '',
      rememberMe: true,
    },
  });

  // Inject backend field errors if present
  React.useEffect(() => {
    if (fieldErrors && fieldErrors.password) {
      setError('password', { message: fieldErrors.password });
    }
  }, [fieldErrors, setError]);

  const onSubmit = async (data: SignInSchemaType) => {
    await login({
      identifier: pendingIdentifier || data.identifier,
      password: data.password,
    });
  };

  const handleForgotPassword = async () => {
    if (pendingIdentifier) {
      await forgotPassword({ identifier: pendingIdentifier });
    } else {
      setView('identifier');
    }
  };

  return (
    <div className="flex flex-col items-center text-center text-white w-full max-w-md mx-auto space-y-4 py-2">
      {/* Brand Header */}
      <div className="flex flex-col items-center space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-primary font-black shadow-xs">
            <Pill className="h-4 w-4" />
          </div>
          <span className="font-serif-title text-2xl font-black tracking-tight text-white">
            mediShop
          </span>
        </div>
        <h2 className="text-sm sm:text-base font-black tracking-wider text-white uppercase pt-1">
          {isBn ? 'পাসওয়ার্ড প্রদান করুন' : 'ENTER YOUR PASSWORD'}
        </h2>
      </div>

      {/* Target Identifier Pill Badge with Edit Action */}
      <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-xs font-semibold text-white">
        <span>{pendingIdentifier || 'User Identifier'}</span>
        <button
          type="button"
          onClick={() => setView('identifier')}
          className="p-1 rounded-full hover:bg-white/20 transition-all text-white/90 hover:text-white cursor-pointer"
          title={isBn ? 'পরিবর্তন করুন' : 'Change Identifier'}
        >
          <Edit2 className="h-3 w-3" />
        </button>
      </div>

      {/* Global Server Error Alert */}
      {serverError && (
        <div className="w-full rounded-2xl bg-rose-500/20 border border-rose-300/40 p-3 text-left flex items-start gap-2.5 text-xs text-rose-100 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-200 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Password Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full text-left">
        <input type="hidden" value={pendingIdentifier} {...register('identifier')} />

        {/* Password Input Box with Show/Hide Eye Toggle */}
        <div className="flex flex-col gap-1.5 w-full">
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 h-4.5 w-4.5 text-white/70" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={isBn ? 'আপনার পাসওয়ার্ড লিখুন' : 'Enter Password'}
              autoFocus
              className={`w-full rounded-2xl bg-white/20 border py-3 pl-11 pr-11 text-sm font-medium text-white placeholder:text-white/70 focus:outline-hidden focus:bg-white/30 transition-all ${
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
              {showPassword ? (
                <EyeOff className="h-4.5 w-4.5" />
              ) : (
                <Eye className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs font-semibold text-rose-200 px-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="flex items-center justify-end px-1 pt-0.5">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isLoading}
            className="text-xs font-normal text-white/95 hover:text-white hover:underline transition-all cursor-pointer opacity-95"
          >
            {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-white py-3.5 px-4 text-sm font-extrabold text-primary shadow-lg hover:bg-slate-50 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-80 mt-1 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{isBn ? 'লগইন হচ্ছে...' : 'Logging in...'}</span>
            </>
          ) : (
            <span>{isBn ? 'লগইন করুন' : 'Log In'}</span>
          )}
        </button>
      </form>
    </div>
  );
}
