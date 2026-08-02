'use client';

import React from 'react';
import { RotateCcw, ShieldAlert, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/store';
import { COMPANY_EMAIL_PRIMARY, HOTLINE_NUMBER } from '@/lib/constants';

export default function RefundPolicyPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary">
            <RotateCcw className="h-4 w-4" />
            <span>{isBn ? 'ফেরত ও রিফান্ড নীতিমালা' : 'Returns & Refund Terms'}</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-foreground">
            {isBn ? 'ফেরত ও রিফান্ড নীতি (Return Policy)' : 'Return & Refund Policy'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isBn ? 'সহজ ৭ দিনের রিটার্ন সুবিধা এবং দ্রুততম রিফান্ড প্রক্রিয়া' : 'Hassle-free 7-day returns and fast refund processing'}
          </p>
        </div>

        {/* Policy Detail Sections */}
        <div className="rounded-3xl border border-border bg-background p-6 sm:p-10 space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>{isBn ? '১. রিটার্নের উপযুক্ততা (৭ দিনের সময়সীমা)' : '1. Eligibility for Returns (7-Day Window)'}</span>
            </h2>
            <p>
              {isBn
                ? 'আপনি যদি ভুল ওষুধ পান, মেয়াদ উত্তীর্ণ পণ্য বা ক্ষতিগ্রস্ত প্যাকেট পেয়ে থাকেন, তবে অর্ডারের ৭ দিনের মধ্যে অব্যবহৃত ও সিল করা অবস্থায় ক্যাশ মেমোসহ পণ্য ফেরত দিতে পারবেন।'
                : 'You may request a return within 7 days of delivery if you receive an incorrect product, expired medicine, or damaged outer packaging.'}
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-danger" />
              <span>{isBn ? '২. যেসকল ওষুধ ফেরত নেওয়া হয় না' : '2. Non-Returnable Items'}</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-danger/90">
              <li>{isBn ? 'তাপমাত্রা সংবেদনশীল কোল্ড-চেইন ওষুধ (যেমন: ইনসুলিন, ভ্যাকসিন)।' : 'Cold-chain items requiring constant refrigeration (e.g., insulin, vaccines).'}</li>
              <li>{isBn ? 'সিল খোলা বা অংশবিশেষ ব্যবহার করা ওষুধের পাতা।' : 'Unsealed, opened, or partially consumed medicine strips.'}</li>
              <li>{isBn ? 'স্বাস্থ্যবিধি পণ্য ও হাইজিন প্রোডাক্ট।' : 'Personal hygiene and sanitized health devices once unboxed.'}</li>
            </ul>
          </section>

          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              <span>{isBn ? '৩. রিফান্ড পাওয়ার সময়সীমা' : '3. Refund Timelines'}</span>
            </h2>
            <p>
              {isBn
                ? 'অনুমোদিত রিটার্নের ক্ষেত্রে আপনার ব্যবহৃত পেমেন্ট মাধ্যমে (বিকাশ, নগদ, কার্ড) ৩ থেকে ৫ কর্মদিবসের মধ্যে টাকা ফেরত প্রদান করা হবে।'
                : 'Approved refunds will be processed back to your original payment method (bKash, Nagad, Card) within 3-5 business days.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
