'use client';

import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';
import { useAppSelector } from '@/store';

export function PrescriptionNotice() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-3.5 text-rose-900 shadow-2xs">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white">
        <FileText className="h-4 w-4" />
      </div>
      <div>
        <h4 className="text-xs font-bold flex items-center gap-1.5 text-rose-900">
          <AlertCircle className="h-3.5 w-3.5 text-rose-600 inline" />
          {isBn ? 'প্রেসক্রিপশন আবশ্যক (Rx Required)' : 'Prescription Required (Rx)'}
        </h4>
        <p className="mt-0.5 text-[11px] text-rose-700 leading-snug">
          {isBn
            ? 'এই ওষুধটি ক্রয়ের জন্য রেজিস্টার্ড ডাক্তারের প্রেসক্রিপশন আবশ্যক। অর্ডার সম্পন্ন করার সময় প্রেসক্রিপশন আপলোড করুন।'
            : 'A valid prescription from a registered doctor is required. You can upload it during checkout.'}
        </p>
      </div>
    </div>
  );
}
