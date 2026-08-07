'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Camera, Loader2, Edit2, ShieldCheck, CheckCircle2, Phone, Mail, Lock } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';
import { RBAC_ROLES_CONFIG } from '@/config/rbac.config';

interface ProfileModuleProps {
  isBn?: boolean;
}

export function ProfileModule({ isBn = true }: ProfileModuleProps) {
  const { user, isSaving, updateProfile, uploadAvatar, fieldErrors } = useUserProfile();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const roleConfig = user?.role ? RBAC_ROLES_CONFIG[user.role] : RBAC_ROLES_CONFIG.customer;

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

    // Send only name (Email and Phone are immutable identity fields)
    await updateProfile({
      name: name.trim(),
    });
  };

  return (
    <div className="space-y-6">
      {/* User Hero Banner with Real Backend Data */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar Circle with Upload Trigger */}
          <div className="relative group flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-sky-400 text-3xl font-black text-white shadow-md ring-4 ring-primary/10 overflow-hidden">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={name || 'User Avatar'}
                width={96}
                height={96}
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
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {isBn ? 'অ্যাকাউন্ট স্ট্যাটাস: এক্টিভ' : 'Account Status: Active'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form (Identity Email & Phone Locked) */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-6">
        <div className="pb-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground font-serif-title">
            {isBn ? 'প্রোফাইল তথ্য ও ছবি পরিবর্তন' : 'Update Name & Profile Avatar'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'আপনার নাম ও প্রোফাইল ছবি আপডেট করতে পারেন (সিকিউরিটির কারণে ইমেইল ও মোবাইল অপরিবর্তনযোগ্য)'
              : 'Update your display name and avatar (Email and Phone are locked for account security)'}
          </p>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Editable Name */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'পূর্ণ নাম (Name)' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nurul Islam"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
                  fieldErrors.name ? 'border-rose-400 bg-rose-50' : 'border-border bg-muted/30'
                }`}
              />
              {fieldErrors.name && (
                <span className="text-[11px] font-bold text-rose-500">{fieldErrors.name}</span>
              )}
            </div>

            {/* Read-only Phone (Locked) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">
                  {isBn ? 'মোবাইল নম্বর (Phone)' : 'Phone Number'}
                </label>
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                  <Lock className="h-3 w-3" />
                  {isBn ? 'লক করা' : 'Locked'}
                </span>
              </div>
              <input
                type="tel"
                value={phone || (isBn ? 'যুক্ত করা হয়নি' : 'Not Provided')}
                disabled
                readOnly
                className="w-full rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-xs font-bold text-muted-foreground cursor-not-allowed select-none"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {isBn
                  ? 'অ্যাকাউন্ট সিকিউরিটির জন্য মোবাইল নম্বর পরিবর্তন করা যাবে না'
                  : 'Phone number cannot be changed for account security'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Read-only Email (Locked) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">
                  {isBn ? 'ইমেইল অ্যাড্রেস (Email)' : 'Email Address'}
                </label>
                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                  <Lock className="h-3 w-3" />
                  {isBn ? 'লক করা' : 'Locked'}
                </span>
              </div>
              <input
                type="email"
                value={email || (isBn ? 'যুক্ত করা হয়নি' : 'Not Provided')}
                disabled
                readOnly
                className="w-full rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-xs font-bold text-muted-foreground cursor-not-allowed select-none"
              />
              <span className="text-[10px] text-muted-foreground mt-0.5 block">
                {isBn
                  ? 'অ্যাকাউন্ট সিকিউরিটির জন্য ইমেইল পরিবর্তন করা যাবে না'
                  : 'Email address cannot be changed for account security'}
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
                  <span>{isBn ? 'নাম পরিবর্তন সংরক্ষণ করুন' : 'Save Name Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
