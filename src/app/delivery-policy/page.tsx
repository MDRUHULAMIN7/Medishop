'use client';

import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { useAppSelector } from '@/store';
import { HOTLINE_NUMBER } from '@/lib/constants';

export default function DeliveryPolicyPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary">
            <Truck className="h-4 w-4" />
            <span>{isBn ? 'ডেলিভারি ও শিপিং নীতি' : 'Delivery & Shipping Guidelines'}</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-foreground">
            {isBn ? 'ডেলিভারি নীতি (Delivery Policy)' : 'Delivery Policy'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isBn ? 'ঢাকা শহর ও সারাদেশের জন্য আমাদের দ্রুততম ডেলিভারি সেবা' : 'Express doorstep delivery timeline and rates across Bangladesh'}
          </p>
        </div>

        {/* Shipping Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dhaka Standard */}
          <div className="rounded-2xl border border-border bg-background p-6 space-y-3 shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {isBn ? 'ঢাকা স্ট্যান্ডার্ড ডেলিভারি' : 'Dhaka Standard'}
            </h3>
            <p className="text-xs text-primary font-bold">৳৬০ (৳১,০০০+ অর্ডারে ফ্রি)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn ? '২৪ থেকে ৪৮ ঘণ্টার মধ্যে ঢাকা মেট্রোপলিটন এলাকায় ওষুধ পৌঁছে দেওয়া হয়।' : 'Delivered within 24-48 hours inside Dhaka Metropolitan area.'}
            </p>
          </div>

          {/* Dhaka Express */}
          <div className="rounded-2xl border border-primary bg-primary-soft/30 p-6 space-y-3 shadow-xs">
            <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">
                {isBn ? 'ঢাকা এক্সপ্রেস (সেম-ডে)' : 'Dhaka Same-Day Express'}
              </h3>
              <span className="rounded-full bg-accent-light px-2 py-0.5 text-[10px] font-bold text-accent-dark">
                {isBn ? 'জনপ্রিয়' : 'POPULAR'}
              </span>
            </div>
            <p className="text-xs text-primary font-bold">৳১০০ (একই দিনে ডেলিভারি)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn ? 'বিকাল ৪:০০ টার আগের অর্ডারগুলো মাত্র ৪-৬ ঘণ্টার মধ্যে ঢাকার ঘরে ঘরে পৌঁছানো হয়।' : 'Orders placed before 4:00 PM are delivered within 4-6 hours.'}
            </p>
          </div>

          {/* Outside Dhaka */}
          <div className="rounded-2xl border border-border bg-background p-6 space-y-3 shadow-2xs">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {isBn ? 'ঢাকার বাইরে (সমগ্র বাংলাদেশ)' : 'Nationwide Courier'}
            </h3>
            <p className="text-xs text-primary font-bold">৳১২০ (কুরিয়ার শিপিং)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn ? 'সুন্দরবন ও এস এ পরিবহনের মাধ্যমে ৪৮ থেকে ৭২ ঘণ্টার মধ্যে পৌঁছানো হয়।' : 'Delivered via trusted courier network within 48-72 hours.'}
            </p>
          </div>
        </div>

        {/* Temperature & Packaging Standard */}
        <div className="rounded-3xl border border-border bg-muted/30 p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>{isBn ? 'কোল্ড চেইন ও নিরাপদ প্যাকেজিং প্রোটোকল' : 'Cold-Chain & Secure Packaging Protocol'}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <span>{isBn ? 'ইনসুলিন ও তাপমাত্রা-সংবেদনশীল ওষুধের জন্য আইস প্যাক ও থার্মাল বক্স ব্যবহার।' : 'Insulin & biologicals transported using thermal insulated ice boxes.'}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
              <span>{isBn ? 'গোপনীয়তা বজায় রাখতে ওয়াটারপ্রুফ ও অপ্রকাশ্য প্যাকিং।' : 'Discreet tamper-evident waterproof packaging for utmost privacy.'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
