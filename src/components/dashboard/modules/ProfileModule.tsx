'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Camera, Loader2, Edit2, ShieldCheck, CheckCircle2, Phone, Mail, Lock, PlusCircle } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { RBAC_ROLES_CONFIG } from '@/config/rbac.config';
import { CustomerStaffInvitationBanner } from '@/components/dashboard/CustomerStaffInvitationBanner';

interface ProfileModuleProps {
  isBn?: boolean;
}

export function ProfileModule({ isBn = true }: ProfileModuleProps) {
  const { user, isSaving, updateProfile, uploadAvatar, fieldErrors } = useUserProfile();

  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  if (!mounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-muted shrink-0" />
          <div className="space-y-2 w-full max-w-sm">
            <div className="h-6 w-48 rounded-lg bg-muted" />
            <div className="h-4 w-32 rounded-lg bg-muted" />
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-background p-6 shadow-xs h-64" />
      </div>
    );
  }

  const roleConfig = user?.role ? RBAC_ROLES_CONFIG[user.role] : RBAC_ROLES_CONFIG.customer;
  const hasLockedPhone = Boolean(user?.phone);
  const hasLockedEmail = Boolean(user?.email);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAvatar(true);
      await uploadAvatar(file);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: { name: string; email?: string; phone?: string } = {
      name: name.trim(),
    };

    // If user didn't have email previously and typed a new one, include it
    if (!hasLockedEmail && email.trim()) {
      payload.email = email.trim().toLowerCase();
    }

    // If user didn't have phone previously and typed a new one, include it
    if (!hasLockedPhone && phone.trim()) {
      payload.phone = phone.trim();
    }

    await updateProfile(payload);
  };

  return (
    <div className="space-y-6">
      {/* User Hero Banner with Real Backend Data */}
      <div className="rounded-3xl border border-border bg-background p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar Circle with Upload Trigger */}
          <div className="relative group flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-sky-400 text-2xl font-black text-white shadow-md ring-4 ring-primary/10 overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={name || 'User Avatar'}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
            )}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/webp"
              onChange={handleAvatarFileChange}
              className="hidden"
            />

            {/* Camera Overlay */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all cursor-pointer text-[10px] font-bold"
              title={isBn ? 'ছবি পরিবর্তন করুন (সর্বোচ্চ 5MB)' : 'Change avatar (Max 5MB)'}
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <>
                  <Camera className="h-5 w-5 mb-0.5" />
                  <span>{isBn ? 'ছবি দিন' : 'Upload'}</span>
                </>
              )}
            </button>

            {user?.isVerified && (
              <div
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs z-10"
                title="Verified Account"
              >
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                {name || (isBn ? 'ইউজার প্রোফাইল' : 'User Profile')}
              </h1>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${roleConfig.badgeBg}`}
              >
                <ShieldCheck className="h-3 w-3" />
                {isBn ? roleConfig.titleBn : roleConfig.titleEn}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-muted-foreground font-medium">
              {phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {phone}
                </span>
              )}
              {email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {email}
                </span>
              )}
              <span className="text-[11px] font-semibold text-muted-foreground">
                {isBn ? (roleConfig.titleBn || 'অ্যাকাউন্ট') : (roleConfig.titleEn || 'Account')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-6">
        <div className="pb-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground font-serif-title">
            {isBn ? 'প্রোফাইল তথ্য ও কন্টাক্ট সেটিংস' : 'Profile Information & Contact Settings'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'ইমেইল বা মোবাইল নম্বর একবার যুক্ত করার পর তা স্থায়ীভাবে লক হয়ে যাবে এবং উভয়ের যেকোনো একটি দিয়ে লগইন করা যাবে।'
              : 'Once added, email and phone number are permanently locked and can be used interchangeably for login.'}
          </p>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Editable Name */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'পূর্ণ নাম (Name) *' : 'Full Name *'}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nurul Islam"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
                  fieldErrors.name ? 'border-rose-400 bg-rose-50' : 'border-border bg-muted/30'
                }`}
              />
              {fieldErrors.name && (
                <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.name}</span>
              )}
            </div>

            {/* Mobile Phone Field (Locked if set, Editable once if missing) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">
                  {isBn ? 'মোবাইল নম্বর (Phone)' : 'Mobile Phone Number'}
                </label>
                {hasLockedPhone ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Lock className="h-3 w-3" />
                    <span>{isBn ? 'স্থায়ী / লকড' : 'Permanent / Locked'}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    <PlusCircle className="h-3 w-3" />
                    <span>{isBn ? 'একবার যোগ করা যাবে' : 'Add Once (Permanent)'}</span>
                  </span>
                )}
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => !hasLockedPhone && setPhone(e.target.value)}
                disabled={hasLockedPhone}
                readOnly={hasLockedPhone}
                placeholder={isBn ? 'যেমন: 01712345678' : 'e.g. 01712345678'}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-bold ${
                  hasLockedPhone
                    ? 'border-border bg-muted/60 text-muted-foreground cursor-not-allowed select-none'
                    : 'border-border bg-background text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20'
                } ${fieldErrors.phone ? 'border-rose-400 bg-rose-50' : ''}`}
              />
              {fieldErrors.phone && (
                <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.phone}</span>
              )}
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {hasLockedPhone
                  ? (isBn ? 'সিকিউরিটির জন্য মোবাইল নম্বর অপরিবর্তনযোগ্য।' : 'Phone number cannot be modified for security.')
                  : (isBn ? 'মোবাইল নম্বর যোগ করলে তা দিয়েও পাসওয়ার্ড ব্যবহার করে লগইন করতে পারবেন।' : 'Adding a phone number allows logging in using either email or phone.')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Field (Locked if set, Editable once if missing) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">
                  {isBn ? 'ইমেইল অ্যাড্রেস (Email)' : 'Email Address'}
                </label>
                {hasLockedEmail ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <Lock className="h-3 w-3" />
                    <span>{isBn ? 'স্থায়ী / লকড' : 'Permanent / Locked'}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    <PlusCircle className="h-3 w-3" />
                    <span>{isBn ? 'একবার যোগ করা যাবে' : 'Add Once (Permanent)'}</span>
                  </span>
                )}
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => !hasLockedEmail && setEmail(e.target.value)}
                disabled={hasLockedEmail}
                readOnly={hasLockedEmail}
                placeholder={isBn ? 'যেমন: user@example.com' : 'e.g. user@example.com'}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-bold ${
                  hasLockedEmail
                    ? 'border-border bg-muted/60 text-muted-foreground cursor-not-allowed select-none'
                    : 'border-border bg-background text-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20'
                } ${fieldErrors.email ? 'border-rose-400 bg-rose-50' : ''}`}
              />
              {fieldErrors.email && (
                <span className="text-[11px] font-bold text-rose-500 mt-1 block">{fieldErrors.email}</span>
              )}
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {hasLockedEmail
                  ? (isBn ? 'সিকিউরিটির জন্য ইমেইল অপরিবর্তনযোগ্য।' : 'Email address cannot be modified for security.')
                  : (isBn ? 'ইমেইল যোগ করলে তা দিয়েও পাসওয়ার্ড ব্যবহার করে লগইন করতে পারবেন।' : 'Adding an email allows logging in using either email or phone.')}
              </span>
            </div>

            {/* Read-only Role */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'অ্যাকাউন্ট ভূমিকা (Role)' : 'Account Role'}
              </label>
              <input
                type="text"
                disabled
                readOnly
                value={isBn ? roleConfig.titleBn : roleConfig.titleEn}
                className="w-full rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-xs font-bold text-muted-foreground cursor-not-allowed select-none"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-70 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{isBn ? 'সেভ হচ্ছে...' : 'Saving Changes...'}</span>
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4" />
                  <span>{isBn ? 'প্রোফাইল পরিবর্তন সংরক্ষণ করুন' : 'Save Profile Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
