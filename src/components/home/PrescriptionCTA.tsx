'use client';

import React from 'react';
import Link from 'next/link';
import {
  Upload,
  Camera,
  ShieldCheck,
  PhoneCall,
  Video,
  Phone,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { MOCK_PRESCRIPTION_STEPS } from '@/mocks/promotions';
import { HOTLINE_NUMBER, HOTLINE_TEL, WHATSAPP_LINK } from '@/lib/constants';

export function PrescriptionCTA() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const STEP_ICONS: Record<string, React.ReactNode> = {
    Camera: <Camera className="h-4 w-4 text-primary" />,
    Upload: <Upload className="h-4 w-4 text-primary" />,
    ShieldCheck: <ShieldCheck className="h-4 w-4 text-primary" />,
    PhoneCall: <PhoneCall className="h-4 w-4 text-primary" />,
  };

  return (
    <section aria-label="Prescription Upload & Consultation" className="w-full py-2 flex flex-col gap-4">
      {/* 1. Main Prescription Upload Card & Workflow Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 rounded-3xl border border-border bg-gradient-to-r from-teal-50/60 via-sky-50/60 to-blue-50/60 p-5 sm:p-8 shadow-2xs">
        {/* Left CTA Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-white/90 border border-teal-100/80 shadow-xs backdrop-blur-xs transition-shadow hover:shadow-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <FileText className="h-8 w-8" />
          </div>

          <h3 className="font-serif-title text-xl sm:text-2xl font-bold text-foreground">
            {isBn ? 'প্রেসক্রিপশন দিয়ে ওষুধ অর্ডার করুন' : 'Order With Prescription'}
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm">
            {isBn
              ? 'আপনার প্রেসক্রিপশনের ছবি আপলোড করুন, আমাদের ফার্মাসিস্ট ভেরিফাই করে ওষুধ আপনার ঠিকানায় পৌঁছে দেবে।'
              : 'Upload your prescription, and we will deliver your medicines right to your doorstep.'}
          </p>

          <Link
            href="/upload-prescription"
            className="mt-5 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-primary px-7 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark hover:shadow-lg active:scale-98"
          >
            <Upload className="h-4.5 w-4.5" />
            <span>{isBn ? 'প্রেসক্রিপশন আপলোড করুন' : 'Upload Now'}</span>
          </Link>
        </div>

        {/* Right 4-Step Explanation Column (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center p-2 sm:p-4">
          <h4 className="font-serif-title text-base sm:text-lg font-bold text-foreground mb-4 text-center lg:text-left">
            {isBn ? 'প্রেসক্রিপশন আপলোড কিভাবে কাজ করে?' : 'How Does Upload Work?'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MOCK_PRESCRIPTION_STEPS.map((step) => (
              <div
                key={step.stepNumber}
                className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-white/80 p-3.5 shadow-2xs transition-all duration-200 hover:border-primary/40 hover:bg-white"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-xs text-white shadow-xs">
                  {step.stepNumber}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-foreground">
                    {isBn ? step.titleBn : step.titleEn}
                  </h5>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
                    {isBn ? step.descriptionBn : step.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Direct Ordering Action Bar (Doctor Consult, Call to Order, WhatsApp Order) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Doctor Consultation */}
        <Link
          href="/consultation"
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-cyan-200 bg-cyan-50/80 px-4 py-3.5 text-xs sm:text-sm font-bold text-cyan-900 shadow-2xs transition-all hover:bg-cyan-100 hover:shadow-xs active:scale-98"
        >
          <Video className="h-5 w-5 text-cyan-600" />
          <span>{isBn ? 'ডাক্তার ভিডিও কনসাল্টেশন' : 'Doctor Video Consultation'}</span>
        </Link>

        {/* Call to Order */}
        <a
          href={HOTLINE_TEL}
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-teal-600 bg-teal-600 px-4 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-teal-700 hover:shadow-md active:scale-98"
        >
          <Phone className="h-5 w-5" />
          <span>{isBn ? `কল করে অর্ডার: ${HOTLINE_NUMBER}` : `Call to Order: ${HOTLINE_NUMBER}`}</span>
        </a>

        {/* WhatsApp Order */}
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 rounded-2xl border border-emerald-600 bg-emerald-600 px-4 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-emerald-700 hover:shadow-md active:scale-98"
        >
          <MessageSquare className="h-5 w-5" />
          <span>{isBn ? 'হোয়াটসঅ্যাপে অর্ডার করুন' : 'WhatsApp to Order'}</span>
        </a>
      </div>
    </section>
  );
}
