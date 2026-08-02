'use client';

import React from 'react';
import Link from 'next/link';
import {
  Pill,
  ShieldCheck,
  Award,
  Users,
  Building2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  Stethoscope,
  Truck,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import {
  HOTLINE_NUMBER,
  PHONE_SECONDARY,
  HOTLINE_TEL,
  PHONE_SECONDARY_TEL,
  COMPANY_EMAIL_PRIMARY,
  COMPANY_EMAIL_SECONDARY,
  COMPANY_ADDRESS_EN,
  COMPANY_ADDRESS_BN,
  COMPANY_OFFICE_TITLE_EN,
  COMPANY_OFFICE_TITLE_BN,
} from '@/lib/constants';

export default function AboutPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Banner Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 sm:p-10 md:p-12">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>{isBn ? 'ডিজিডিএ নিবন্ধিত ডিজিটাল ফার্মেসি' : 'DGDA Registered Digital Pharmacy'}</span>
            </div>
            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground">
              {isBn
                ? 'আপনার ও আপনার পরিবারের বিশ্বস্ত ডিজিটাল হেলথকেয়ার পার্টনার'
                : 'Your Trusted Healthcare & Digital Pharmacy Partner'}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {isBn
                ? 'মেডিশপ হলো বাংলাদেশের ডিজিটাল স্বাস্থ্যসেবার শীর্ষস্থানীয় একটি প্ল্যাটফর্ম। আমরা নিশ্চিত করি ১০০% খাঁটি ওষুধ, পেশাদার ফার্মাসিস্টের পরামর্শ এবং সমগ্র বাংলাদেশে দ্রুততম ডেলিভারি।'
                : 'mediShop is a leading healthcare platform in Bangladesh committed to delivering 100% authentic medicines, expert pharmacist consultation, and express doorstep delivery.'}
            </p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-muted/30 p-6 space-y-3 transition-all hover:border-primary/40 hover:shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? '১০০% আসল ও খাঁটি ওষুধ' : '100% Authentic Medicines'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn
                ? 'সরাসরি প্রস্তুতকারক ও ডিজিডিএ অনুমোদিত ডিস্ট্রিবিউটর থেকে কোল্ড-চেইন বজায় রেখে সংগৃহীত।'
                : 'Sourced directly from top pharmaceutical manufacturers following strict temperature and storage standards.'}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-6 space-y-3 transition-all hover:border-primary/40 hover:shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? '২৪/৭ নিবন্ধিত ফার্মাসিস্ট' : '24/7 Graduate Pharmacists'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn
                ? 'আপনার ওষুধের সঠিক ডোজ, সেবনবিধি এবং যেকোনো পার্শ্বপ্রতিক্রিয়া নিয়ে পরামর্শ দিতে প্রস্তুত বিশেষজ্ঞ টিম।'
                : 'Qualified and licensed pharmacists ready round-the-clock to guide dosages and prescription queries.'}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 p-6 space-y-3 transition-all hover:border-primary/40 hover:shadow-xs">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? 'দ্রুততম ঢাকা এক্সপ্রেস ডেলিভারি' : 'Same-Day Express Delivery'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn
                ? 'ঢাকার ভেতর ৪-৬ ঘণ্টার মধ্যে সুপারফাস্ট ডেলিভারি এবং দেশের যেকোনো জেলায় দ্রুততম শিপিং।'
                : 'Superfast 4-6 hours express delivery within Dhaka city and nationwide rapid logistics support.'}
            </p>
          </div>
        </div>

        {/* Story & Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center rounded-3xl border border-border bg-background p-6 sm:p-8">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-serif-title">
              {isBn ? 'আমাদের লক্ষ্য ও উদ্দেশ্য' : 'Our Mission & Vision'}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {isBn
                ? 'স্বাস্থ্যসেবাকে সহজ, সাশ্রয়ী ও সবার নাগালের মধ্যে পৌঁছে দেওয়াই মেডিশপের মূল উদ্দেশ্য। প্রেসক্রিপশন আপলোড থেকে শুরু করে দ্বারে ওষুধ পৌঁছে দেওয়া পর্যন্ত প্রতিটি ধাপে আমরা সর্বোচ্চ মানের সেবা নিশ্চিত করি।'
                : 'Our mission is to make quality healthcare accessible, affordable, and trustworthy for every household in Bangladesh through continuous innovation and customer care.'}
            </p>
            <ul className="space-y-2.5 text-xs text-foreground font-medium">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{isBn ? 'স্বচ্ছ মূল্য তালিকা ও জরুরি ওষুধের সর্বোচ্চ ছাড়' : 'Transparent pricing and maximum savings on essential meds'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{isBn ? 'সহজ প্রেসক্রিপশন ভেরিফিকেশন সেবা' : 'Effortless online prescription verification'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>{isBn ? 'কোল্ড ಚেইন বজায় রেখে ডেলিভারি ব্যবস্থা' : 'Cold-chain storage and secure transit packaging'}</span>
              </li>
            </ul>
          </div>

          <div id="license" className="rounded-2xl border border-border bg-muted/40 p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span>{isBn ? 'কোম্পানি ও লাইসেন্স সমাচার' : 'Licensing & Compliance'}</span>
            </h3>
            <div className="space-y-3 text-xs text-muted-foreground">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="font-semibold text-foreground">{isBn ? 'রেজিস্ট্রেশন নম্বর:' : 'DGDA License:'}</span>
                <span>DAR-2026-BD</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="font-semibold text-foreground">{isBn ? 'অফিসিয়াল সত্তা:' : 'Operating Entity:'}</span>
                <span>Code Club IT Solutions</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="font-semibold text-foreground">{isBn ? 'সেবার ধরন:' : 'Service Type:'}</span>
                <span>Digital Pharmacy & E-Health</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Card Section */}
        <div className="rounded-3xl border border-border bg-gradient-to-r from-primary-soft/40 via-background to-accent-light/40 p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {isBn ? 'আমাদের সাথে যোগাযোগ করুন' : 'Get in Touch with Us'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'যেকোনো জিজ্ঞাসা, ওষুধ পরামর্শ বা বাল্ক অর্ডারের জন্য সরাসরি আমাদের হেড অফিসে যোগাযোগ করুন।'
                : 'For inquiries, medicine consultations, or head office visits, contact us below.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {/* Phone */}
            <div className="rounded-2xl border border-border bg-background p-5 space-y-2 flex flex-col items-center">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                <Phone className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase">{isBn ? 'ফোন নম্বর' : 'Phone Lines'}</h4>
              <a href={HOTLINE_TEL} className="text-xs font-bold text-foreground hover:text-primary transition-colors block">
                {HOTLINE_NUMBER}
              </a>
              <a href={PHONE_SECONDARY_TEL} className="text-xs font-bold text-foreground hover:text-primary transition-colors block">
                {PHONE_SECONDARY}
              </a>
            </div>

            {/* Email */}
            <div className="rounded-2xl border border-border bg-background p-5 space-y-2 flex flex-col items-center">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                <Mail className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase">{isBn ? 'ইমেইল অ্যাড্রেস' : 'Official Emails'}</h4>
              <a href={`mailto:${COMPANY_EMAIL_PRIMARY}`} className="text-xs font-semibold text-foreground hover:text-primary transition-colors block truncate max-w-full">
                {COMPANY_EMAIL_PRIMARY}
              </a>
              <a href={`mailto:${COMPANY_EMAIL_SECONDARY}`} className="text-xs font-semibold text-foreground hover:text-primary transition-colors block truncate max-w-full">
                {COMPANY_EMAIL_SECONDARY}
              </a>
            </div>

            {/* Location */}
            <div className="rounded-2xl border border-border bg-background p-5 space-y-2 flex flex-col items-center">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-1">
                <MapPin className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-bold text-muted-foreground uppercase">
                {isBn ? COMPANY_OFFICE_TITLE_BN : COMPANY_OFFICE_TITLE_EN}
              </h4>
              <p className="text-xs text-foreground font-medium leading-snug">
                {isBn ? COMPANY_ADDRESS_BN : COMPANY_ADDRESS_EN}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
