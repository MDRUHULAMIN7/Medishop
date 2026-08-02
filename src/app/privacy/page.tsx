'use client';

import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react';
import { useAppSelector } from '@/store';
import { COMPANY_EMAIL_PRIMARY } from '@/lib/constants';

export default function PrivacyPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary">
            <Lock className="h-4 w-4" />
            <span>{isBn ? 'ডেটা নিরাপত্তা ও গোপনীয়তা' : 'Data Privacy & Security'}</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-foreground">
            {isBn ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isBn ? 'সর্বশেষ আপডেট: আগস্ট ২০২৬' : 'Last Updated: August 2026'}
          </p>
        </div>

        {/* Content Box */}
        <div className="rounded-3xl border border-border bg-background p-6 sm:p-10 space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>{isBn ? '১. ভূমিকা ও তথ্যের সুরক্ষা' : '1. Overview & Data Commitment'}</span>
            </h2>
            <p>
              {isBn
                ? 'মেডিশপ (mediShop) আপনার ব্যক্তিগত তথ্য ও মেডিকেল প্রেসক্রিপশনের সর্বোচ্চ গোপনীয়তা ও নিরাপত্তা রক্ষায় প্রতিশ্রুতিবদ্ধ। আমরা ডিজিডিএ নীতি ও স্বাস্থ্যসেবা প্রোটোকল মেনে তথ্য সংগ্রহ ও সংরক্ষণ করি।'
                : 'mediShop is committed to protecting the privacy and confidentiality of your personal health data and medical prescriptions following standard healthcare data protocols.'}
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <span>{isBn ? '২. আমরা যেসকল তথ্য সংগ্রহ করি' : '2. Information We Collect'}</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>{isBn ? 'আপনার নাম, ঠিকানা, মোবাইল নম্বর ও ইমেইল।' : 'Your name, delivery address, phone number, and email address.'}</li>
              <li>{isBn ? 'আপনার আপলোডকৃত প্রেসক্রিপশনের ছবি ও স্বাস্থ্য সংক্রান্ত প্রয়োজনীয় নোট।' : 'Uploaded prescription files and specific dosage notes.'}</li>
              <li>{isBn ? 'লেনদেনের তথ্য (যেমন: পেমেন্ট রেফারেন্স বা ট্রানজ্যাকশন আইডি)।' : 'Transaction identifiers and billing reference data.'}</li>
            </ul>
          </section>

          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              <span>{isBn ? '৩. প্রেসক্রিপশন ও তথ্যের ব্যবহার' : '3. Prescription Data Usage'}</span>
            </h2>
            <p>
              {isBn
                ? 'আপনার আপলোড করা প্রেসক্রিপশন কেবলমাত্র আমাদের নিবন্ধিত গ্র্যাজুয়েট ফার্মাসিস্ট টিম ভেরিফিকেশন ও ওষুধ প্যাফ করার জন্য ব্যবহার করেন। আপনার মেডিকেল ডেটা কোনো তৃতীয় পক্ষের নিকট বিক্রি বা শেয়ার করা হয় না।'
                : 'Your uploaded prescriptions are strictly viewed by our licensed graduate pharmacists for validation and order processing. We never sell or share medical documents with third parties.'}
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>{isBn ? '৪. আপনার অধিকার ও ডেটা অনুরোধ' : '4. Your Data Rights'}</span>
            </h2>
            <p>
              {isBn
                ? 'আপনার নিজের তথ্য দেখতে, আপডেট করতে বা আমাদের ডাটাবেজ থেকে মুছে ফেলার জন্য আমাদের ইমেইলে সরাসরি অনুরোধ পাঠাতে পারেন:'
                : 'You have full rights to request access, correction, or deletion of your personal history by emailing us at:'}
            </p>
            <p className="font-bold text-primary">{COMPANY_EMAIL_PRIMARY}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
