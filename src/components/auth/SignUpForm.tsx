'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User as UserIcon, Mail, Phone, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store';
import { createSignUpSchema, SignUpSchemaType } from '@/validators/signup.schema';
import { PasswordInput } from './PasswordInput';
import { cn } from '@/lib/utils';

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
      agreeToTerms: false,
    },
  });

  const identifierType = watch('identifierType');
  const passwordValue = watch('password') || '';

  // Calculate Password Strength (0 to 100%)
  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score += 40;
    if (/[A-Z]/.test(pwd)) score += 30;
    if (/[0-9]/.test(pwd)) score += 30;
    return score;
  };

  const strengthScore = calculateStrength(passwordValue);

  const onSubmit = async (data: SignUpSchemaType) => {
    await registerAuth(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5 w-full">
      {/* Full Name */}
      <div className="flex flex-col gap-1 w-full">
        <label className="text-xs font-semibold text-foreground">
          {isBn ? 'আপনার সম্পূর্ণ নাম' : 'Full Name'}
        </label>
        <div className="relative flex items-center">
          <UserIcon className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={isBn ? 'যেমন: মোহাম্মদ রফিকুল ইসলাম' : 'e.g. Rafiqul Islam'}
            className={`w-full rounded-2xl border border-border bg-muted/20 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden ${
              errors.fullName ? 'border-danger focus:border-danger' : ''
            }`}
            {...register('fullName')}
          />
        </div>
        {errors.fullName && (
          <span className="text-[11px] font-medium text-danger">
            {errors.fullName.message}
          </span>
        )}
      </div>

      {/* Dual Identifier Toggle (Phone or Email) */}
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground">
            {identifierType === 'phone'
              ? isBn
                ? 'মোবাইল নম্বর'
                : 'Mobile Number'
              : isBn
              ? 'ইমেইল এড্রেস'
              : 'Email Address'}
          </label>
          {/* Toggle buttons */}
          <div className="flex rounded-lg bg-muted p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setValue('identifierType', 'phone')}
              className={cn(
                'rounded-md px-2 py-0.5 transition-colors',
                identifierType === 'phone'
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted-foreground'
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
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-muted-foreground'
              )}
            >
              {isBn ? 'ইমেইল' : 'Email'}
            </button>
          </div>
        </div>

        <div className="relative flex items-center">
          {identifierType === 'phone' ? (
            <Phone className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          ) : (
            <Mail className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
          )}

          {identifierType === 'phone' ? (
            <input
              type="tel"
              placeholder="01700000000"
              className={`w-full rounded-2xl border border-border bg-muted/20 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden ${
                errors.phone ? 'border-danger focus:border-danger' : ''
              }`}
              {...register('phone')}
            />
          ) : (
            <input
              type="email"
              placeholder="name@example.com"
              className={`w-full rounded-2xl border border-border bg-muted/20 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden ${
                errors.email ? 'border-danger focus:border-danger' : ''
              }`}
              {...register('email')}
            />
          )}
        </div>
        {errors.phone && identifierType === 'phone' && (
          <span className="text-[11px] font-medium text-danger">
            {errors.phone.message}
          </span>
        )}
        {errors.email && identifierType === 'email' && (
          <span className="text-[11px] font-medium text-danger">
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Password Field & Strength Indicator */}
      <div className="flex flex-col gap-1 w-full">
        <PasswordInput
          label={isBn ? 'পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)' : 'Password (min 8 chars)'}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Strength Progress Bar */}
        {passwordValue.length > 0 && (
          <div className="mt-1 flex flex-col gap-1">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300',
                  strengthScore <= 40
                    ? 'w-1/3 bg-danger'
                    : strengthScore <= 70
                    ? 'w-2/3 bg-warning'
                    : 'w-full bg-success'
                )}
              />
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">
              {strengthScore <= 40
                ? isBn
                  ? 'সহজ পাসওয়ার্ড (৮+ অক্ষর, বড় হাতের অক্ষর ও সংখ্যা দিন)'
                  : 'Weak (use 8+ chars, uppercase & number)'
                : strengthScore <= 70
                ? isBn
                  ? 'মাঝারি শক্ত পাসওয়ার্ড'
                  : 'Medium password'
                : isBn
                ? 'শক্তিশালী পাসওয়ার্ড!'
                : 'Strong password!'}
            </span>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <PasswordInput
        label={isBn ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'}
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {/* Agree to Terms Checkbox */}
      <div className="flex flex-col gap-1 mt-1">
        <label className="flex items-start gap-2 cursor-pointer select-none text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-border text-primary focus:ring-primary"
            {...register('agreeToTerms')}
          />
          <span>
            {isBn
              ? 'আমি মেডিশপের টার্মস অ্যান্ড কন্ডিশনস এবং প্রাইভেসি পলিসির সাথে সম্মত আছি।'
              : 'I agree to mediShop Terms & Conditions and Privacy Policy.'}
          </span>
        </label>
        {errors.agreeToTerms && (
          <span className="text-[11px] font-medium text-danger">
            {errors.agreeToTerms.message}
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
            <span>{isBn ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...'}</span>
          </>
        ) : (
          <>
            <span>{isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      {/* Switch to Sign In */}
      <div className="text-center text-xs text-muted-foreground mt-2">
        <span>{isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? '}</span>
        <button
          type="button"
          onClick={() => setView('signin')}
          className="font-bold text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary"
        >
          {isBn ? 'লগইন করুন' : 'Sign In'}
        </button>
      </div>
    </form>
  );
}
