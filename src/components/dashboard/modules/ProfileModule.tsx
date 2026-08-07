'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Camera, Loader2, Edit2, ShieldCheck, CheckCircle2, Phone, Mail } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface ProfileModuleProps {
  isBn?: boolean;
}

export function ProfileModule({ isBn = true }: ProfileModuleProps) {
  const { user, isSaving, updateProfile, uploadAvatar, fieldErrors } = useUserProfile();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyPhone, setEmergencyPhone] = useState('01898765432');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

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

    const payload: { name?: string; phone?: string; email?: string } = {};

    if (name.trim()) payload.name = name.trim();
    if (phone.trim()) payload.phone = phone.trim();
    if (email.trim()) payload.email = email.trim();

    await updateProfile(payload);
  };

  return (
    <div className="space-y-6">
      {/* User Hero Banner */}
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

            {/* Camera Icon Overlay */}
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

            <div
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs z-10"
              title="Verified Customer"
            >
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                {name || (isBn ? 'গ্রাহক প্রোফাইল' : 'Customer Profile')}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                <ShieldCheck className="h-3 w-3" />
                {isBn ? 'ডিজিডিএ ভেরিফাইড পেশেন্ট' : 'Verified DGDA Account'}
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
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-6">
        <div className="pb-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground font-serif-title">
            {isBn ? 'প্রোফাইল তথ্য পরিবর্তন করুন' : 'Update Personal Information'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'আপনার সঠিক তথ্য ও ছবি আপডেট রাখুন (ছবির সাইজ সর্বোচ্চ 5MB)'
              : 'Keep your personal details and profile picture updated (Max 5MB avatar size)'}
          </p>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'পূর্ণ নাম' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
                  fieldErrors.name ? 'border-rose-400 bg-rose-50' : 'border-border bg-muted/30'
                }`}
              />
              {fieldErrors.name && (
                <span className="text-[11px] font-bold text-rose-500">{fieldErrors.name}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
                  fieldErrors.phone ? 'border-rose-400 bg-rose-50' : 'border-border bg-muted/30'
                }`}
              />
              {fieldErrors.phone && (
                <span className="text-[11px] font-bold text-rose-500">{fieldErrors.phone}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 ${
                  fieldErrors.email ? 'border-rose-400 bg-rose-50' : 'border-border bg-muted/30'
                }`}
              />
              {fieldErrors.email && (
                <span className="text-[11px] font-bold text-rose-500">{fieldErrors.email}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'লিঙ্গ' : 'Gender'}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              >
                <option value="Male">Male (পুরুষ)</option>
                <option value="Female">Female (নারী)</option>
                <option value="Other">Other (অন্যান্য)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group'}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'জরুরি পরিচিতির মোবাইল' : 'Emergency Contact Phone'}
              </label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold text-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
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
                  <span>{isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
