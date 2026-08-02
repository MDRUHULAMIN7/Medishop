'use client';

import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Truck,
  Package,
  CreditCard,
  RotateCcw,
} from 'lucide-react';
import { useAppSelector } from '@/store';

interface FeatureItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descEn: string;
  descBn: string;
  badgeEn: string;
  badgeBn: string;
  icon: React.ReactNode;
}

const WHY_MEDISHOP_FEATURES: FeatureItem[] = [
  {
    id: 'f-1',
    titleEn: '100% Authentic Medicines',
    titleBn: '১০০% আসল ওষুধ',
    descEn: 'Sourced directly from DGDA-licensed manufacturers like Square, Beximco, Incepta and Renata. Zero third-party marketplace sourcing.',
    descBn: 'স্কয়ার, বেক্সিমকো, ইনসেপ্টা ও রেনাটার মতো ডিজিডিএ অনুমোদিত প্রস্তুতকারক থেকে সরাসরি সংগৃহীত। থার্ড-পার্টি সোর্সিং শূন্য।',
    badgeEn: 'DGDA Verified',
    badgeBn: 'ডিজিডিএ ভেরিফাইড',
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
  },
  {
    id: 'f-2',
    titleEn: 'Licensed Pharmacist Team',
    titleBn: 'লাইসেন্সপ্রাপ্ত ফার্মাসিস্ট প্যানেল',
    descEn: 'In-house A-Grade pharmacists verify prescriptions, flag interactions and approve every dispatch — real clinical oversight, online.',
    descBn: 'আমাদের ইন-হাউজ এ-গ্রেড ফার্মাসিস্টগণ প্রতিটি প্রেসক্রিপশন ও ওষুধ পরীক্ষা করে নিরাপদ ডেলিভারি নিশ্চিত করেন।',
    badgeEn: 'Clinical Review',
    badgeBn: 'ক্লিনিক্যাল রিভিউ',
    icon: <UserCheck className="h-5 w-5 text-primary" />,
  },
  {
    id: 'f-3',
    titleEn: 'Fast Home Delivery',
    titleBn: 'দ্রুততম হোম ডেলিভারি',
    descEn: 'Same-day in Dhaka (4-6 hours), 1-3 days across all 64 districts. Insulin and cold-chain meds shipped in insulated thermal bags.',
    descBn: 'ঢাকায় ৪-৬ ঘণ্টায় সেম-ডে এক্সপ্রেস ডেলিভারি এবং সারাদেশে ১-৩ দিনে পৌঁছে যায়। ইনসুলিনের জন্য রয়েছে স্পেশাল কুল-প্যাক।',
    badgeEn: 'Same-Day Dhaka',
    badgeBn: 'সেম-ডে ঢাকা',
    icon: <Truck className="h-5 w-5 text-primary" />,
  },
  {
    id: 'f-4',
    titleEn: 'Widest Product Range',
    titleBn: 'সর্ববৃহৎ মেডিসিন সম্ভার',
    descEn: '5,000+ SKUs spanning Rx, OTC, herbal, baby & mom, personal hygiene, supplements, diabetic care and surgical supplies.',
    descBn: 'প্রেসক্রিপশন ওষুধ, ওটিসি, হেলথ ডিভাইস, মা ও শিশুর যত্নসহ ৫,০০০+ এরও বেশি প্রয়োজনীয় স্বাস্থ্য সামগ্রী।',
    badgeEn: '5,000+ SKUs',
    badgeBn: '৫,০০০+ প্রোডাক্ট',
    icon: <Package className="h-5 w-5 text-primary" />,
  },
  {
    id: 'f-5',
    titleEn: 'Secure & Flexible Payment',
    titleBn: 'নিরাপদ ও সহজ পেমেন্ট',
    descEn: 'bKash, Nagad, Rocket, cards and cash on delivery — all secured by SSL 256-bit encryption. Your health data stays private.',
    descBn: 'বিকাশ, নগদ, রকেট, কার্ড কিংবা ক্যাশ অন ডেলিভারিতে পেমেন্টের সুবিধা। ২৫৬-বিট এসএসএল এনক্রিপশনের মাধ্যমে সম্পূর্ণ নিরাপদ।',
    badgeEn: 'SSL Encrypted',
    badgeBn: 'এসএসএল এনক্রিপ্টেড',
    icon: <CreditCard className="h-5 w-5 text-primary" />,
  },
  {
    id: 'f-6',
    titleEn: 'Easy Returns & Support',
    titleBn: 'সহজ রিটার্ন ও ২৪/৭ সাপোর্ট',
    descEn: 'Damaged or mismatched item? Our care team resolves discrepancies within 24 hours with a transparent refund process.',
    descBn: 'ওষুধের সমস্যা বা ত্রুটি? ২৪ ঘণ্টার মধ্যে দ্রুত সমাধান ও স্বচ্ছ রিফান্ড সুবিধা পেতে আমাদের হেল্পলাইনে যোগাযোগ করুন।',
    badgeEn: '24h Resolution',
    badgeBn: '২৪ঘণ্টায় সমাধান',
    icon: <RotateCcw className="h-5 w-5 text-primary" />,
  },
];

export function WhyMediShop() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <section className="w-full pt-4">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
          {isBn
            ? 'কেন মেডিশপ বাংলাদেশের সেরা অনলাইন ফার্মেসি'
            : "Why mediShop Is Bangladesh's Best Online Medicine Shop"}
        </h2>
        <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
      </div>

      {/* 6 Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {WHY_MEDISHOP_FEATURES.map((item) => (
          <div
            key={item.id}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-background p-5 sm:p-6 shadow-2xs hover:border-primary/40 hover:shadow-md transition-all duration-300"
          >
            <div>
              {/* Top Icon & Title Row */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {isBn ? item.titleBn : item.titleEn}
                </h3>
              </div>

              {/* Description Body */}
              <p className="mt-3.5 text-xs sm:text-[13px] leading-relaxed text-muted-foreground">
                {isBn ? item.descBn : item.descEn}
              </p>
            </div>

            {/* Bottom Badge */}
            <div className="mt-5 pt-3 border-t border-border/50">
              <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary">
                {isBn ? item.badgeBn : item.badgeEn}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
