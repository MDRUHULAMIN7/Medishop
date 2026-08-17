'use client';

import React from 'react';
import { FileCheck, ShieldAlert, CheckCircle, HelpCircle } from 'lucide-react';
import { useAppSelector } from '@/store';
import { useBranding } from '@/context/BrandingContext';

export default function TermsPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const { settings } = useBranding();

  const siteName = settings.general?.siteName || 'mediShop';
  const hotline = settings.general?.contactPhone || '+880 1742-643763';
  const termsText = settings.legal?.termsContent;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <FileCheck className="h-4 w-4" />
            <span>{isBn ? 'সেবার শর্তাবলী' : 'Terms of Service'}</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-foreground">
            {isBn ? `ব্যবহারের শর্তাবলী (${siteName})` : `Terms & Conditions (${siteName})`}
          </h1>
          <p className="text-xs text-muted-foreground">
            {isBn ? 'সর্বশেষ সংস্করণ: আগস্ট ২০২৬' : 'Effective Date: August 2026'}
          </p>
        </div>

        {/* Content Box */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 space-y-6 text-xs sm:text-sm leading-relaxed text-muted-foreground shadow-xs">
          {termsText && (
            <section className="space-y-2 rounded-2xl bg-primary/5 p-4 border border-primary/20">
              <h2 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{isBn ? 'অফিসিয়াল পলিসি বিবৃতি' : 'Official Policy Statement'}</span>
              </h2>
              <p className="whitespace-pre-line text-foreground/90 font-medium">{termsText}</p>
            </section>
          )}

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>{isBn ? '১. সেবার আওতা' : '1. Scope of Service'}</span>
            </h2>
            <p>
              {isBn
                ? `${siteName} ওয়েবসাইট বা মোবাইল অ্যাপ ব্যবহার করে যেকোনো ওষুধ বা স্বাস্থ্যপণ্য ক্রয়ের ক্ষেত্রে নিচের শর্তাবলী প্রযোজ্য হবে।`
                : `By accessing or purchasing from ${siteName}, you agree to comply with our healthcare fulfillment policies and terms of service.`}
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <span>{isBn ? '২. প্রেসক্রিপশন নীতি' : '2. Prescription Mandatory Policy'}</span>
            </h2>
            <p>
              {isBn
                ? 'প্রাসঙ্গিক প্রেসক্রিপশন ওষুধ (Rx drugs) ক্রয়ের জন্য রেজিস্টার্ড চিকিৎসকের বৈধ প্রেসক্রিপশন প্রদান করা বাধ্যতামূলক। আমাদের ফার্মাসিস্ট অস্পষ্ট বা জাল প্রেসক্রিপশন বাতিল করার অধিকার রাখেন।'
                : 'Orders containing Rx prescription medicines require a valid prescription upload. Our licensed pharmacists reserve the right to cancel orders with illegible or unverified prescriptions.'}
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              <span>{isBn ? '৩. মূল্য ও পণ্যের প্রাপ্যতা' : '3. Pricing & Product Availability'}</span>
            </h2>
            <p>
              {isBn
                ? 'ওয়েবসাইটে প্রদর্শিত সকল ওষুধের মূল্য এমআরপি (Maximum Retail Price) অনুযায়ী নির্ধারিত। স্টক বা মূল্য পরিবর্তনের ক্ষেত্রে আমাদের প্রতিনিধির মাধ্যমে গ্রাহককে অবহিত করা হবে।'
                : 'All prices are subject to government MRP standards. Stock availability and pricing changes will be communicated prior to dispatch.'}
            </p>
          </section>

          <section className="space-y-2 pt-2 border-t border-border">
            <h2 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>{isBn ? '৪. প্রশ্ন বা সহায়তা' : '4. Inquiries & Clarifications'}</span>
            </h2>
            <p>
              {isBn
                ? `শর্তাবলী সম্পর্কিত যেকোনো প্রশ্নের জন্য আমাদের হটলাইনে কল করুন: ${hotline}`
                : `For questions regarding our service terms, please contact our hotline: ${hotline}`}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
