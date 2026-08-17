'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Pill,
  ShieldCheck,
  Award,
  Truck,
  Headphones,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Heart,
  Banknote,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { MOCK_FOOTER_NAV, MOCK_TRUST_BADGES } from '@/mocks';
import { cn } from '@/lib/utils';

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
import { useBranding } from '@/context/BrandingContext';

export function Footer() {
  const pathname = usePathname();
  const language = useAppSelector((state) => state.ui.language);
  const { settings } = useBranding();
  const [openSection, setOpenSection] = useState<string | null>(null);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const isBn = language === 'bn';
  const siteName = settings.general?.siteName || 'mediShop';
  const hotline = settings.general?.contactPhone || HOTLINE_NUMBER;
  const email = settings.general?.contactEmail || COMPANY_EMAIL_PRIMARY;
  const address = settings.general?.address || (isBn ? COMPANY_ADDRESS_BN : COMPANY_ADDRESS_EN);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const TRUST_BADGE_CONFIGS: Record<
    string,
    {
      icon: React.ReactNode;
      badgeTagBn: string;
      badgeTagEn: string;
      iconBg: string;
      cardGradient: string;
      borderColor: string;
    }
  > = {
    ShieldCheck: {
      icon: <ShieldCheck className="h-5 w-5 text-white" />,
      badgeTagBn: 'ডিজিডিএ লাইসেন্সপ্রাপ্ত',
      badgeTagEn: 'DGDA Certified',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20',
      cardGradient: 'from-emerald-500/10 via-emerald-500/3 to-transparent',
      borderColor: 'border-emerald-500/25 hover:border-emerald-500/50 hover:shadow-emerald-500/10',
    },
    Award: {
      icon: <Award className="h-5 w-5 text-white" />,
      badgeTagBn: '১০০% অরিজিনাল',
      badgeTagEn: '100% Sourced',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/20',
      cardGradient: 'from-amber-500/10 via-amber-500/3 to-transparent',
      borderColor: 'border-amber-500/25 hover:border-amber-500/50 hover:shadow-amber-500/10',
    },
    Truck: {
      icon: <Truck className="h-5 w-5 text-white" />,
      badgeTagBn: '৪-৬ ঘণ্টায় সেম-ডে',
      badgeTagEn: '4-6h Express',
      iconBg: 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-md shadow-sky-500/20',
      cardGradient: 'from-sky-500/10 via-sky-500/3 to-transparent',
      borderColor: 'border-sky-500/25 hover:border-sky-500/50 hover:shadow-sky-500/10',
    },
    Headphones: {
      icon: <Headphones className="h-5 w-5 text-white" />,
      badgeTagBn: 'ফ্রি ফার্মাসিস্ট কল',
      badgeTagEn: 'Free Pharmacist',
      iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20',
      cardGradient: 'from-indigo-500/10 via-indigo-500/3 to-transparent',
      borderColor: 'border-indigo-500/25 hover:border-indigo-500/50 hover:shadow-indigo-500/10',
    },
  };

  return (
    <footer className="border-t border-border bg-muted/40 text-foreground pb-20 md:pb-0">
      {/* 1. Top Trust Badges Section */}
      <div className="relative border-b border-border/80 bg-gradient-to-b from-background via-muted/30 to-background py-8 sm:py-10 overflow-hidden">
        {/* Decorative Subtle Ambient Glows */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-44 w-44 rounded-full bg-sky-500/10 blur-3xl" />

        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3.5 sm:gap-6 md:grid-cols-4">
            {MOCK_TRUST_BADGES.map((badge) => {
              const config = TRUST_BADGE_CONFIGS[badge.iconName] || TRUST_BADGE_CONFIGS.ShieldCheck;
              return (
                <div
                  key={badge.id}
                  className={cn(
                    'group relative flex flex-col justify-between rounded-2xl border bg-background/90 p-4 sm:p-5 backdrop-blur-md shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
                    config.borderColor
                  )}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.cardGradient} opacity-60 transition-opacity group-hover:opacity-100 pointer-events-none`} />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-start gap-3">
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
                        config.iconBg
                      )}
                    >
                      {config.icon}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <span className="inline-self-start rounded-md bg-muted/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground mb-1 w-fit border border-border/50">
                        {isBn ? config.badgeTagBn : config.badgeTagEn}
                      </span>
                      <h4 className="text-xs font-bold text-foreground sm:text-sm leading-snug group-hover:text-primary transition-colors">
                        {isBn ? badge.titleBn : badge.titleEn}
                      </h4>
                      <p className="mt-1 text-[11px] text-muted-foreground leading-tight sm:text-xs">
                        {isBn ? badge.descriptionBn : badge.descriptionEn}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Links */}
      <div className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {/* Desktop 4-Column Grid */}
        <div className="hidden grid-cols-1 gap-8 md:grid md:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              {settings.general?.logoLight &&
              settings.general.logoLight !== '/images/logo.png' &&
              settings.general.logoLight.trim() !== '' ? (
                <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-md transition-transform group-hover:scale-105 shrink-0 border border-primary/20 bg-white">
                  <Image
                    src={settings.general.logoLight}
                    alt={siteName}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md transition-transform group-hover:scale-105 shrink-0">
                  <Pill className="h-5 w-5" />
                </div>
              )}
              <span className="font-serif-title text-2xl font-bold text-primary">
                {siteName}
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {isBn
                ? 'বাংলাদেশের নির্ভরযোগ্য অনলাইন ফার্মেসি ও ডিজিটাল হেলথকেয়ার প্ল্যাটফর্ম। আমরা নিশ্চিত করি ১০০% আসল ওষুধ ও দ্রুততম ডেলিভারি।'
                : 'Bangladesh’s trusted online pharmacy and digital healthcare platform. Providing 100% authentic medicine with express delivery.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>DGDA Reg #DAR-2026-BD</span>
            </div>
          </div>

          {/* Column 2: About & Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              {isBn ? `${siteName} সম্পর্কে` : `About ${siteName}`}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-muted-foreground">
              {MOCK_FOOTER_NAV.about.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary hover:underline"
                  >
                    {isBn ? link.labelBn : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support & Policies */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              {isBn ? 'গ্রাহক সহায়তা ও নীতিমালা' : 'Customer Support'}
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-xs text-muted-foreground">
              {MOCK_FOOTER_NAV.support.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary hover:underline"
                  >
                    {isBn ? link.labelBn : link.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info & Hotline */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              {isBn ? 'যোগাযোগ ও সরাসরি অফিস' : 'Contact & Head Office'}
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-xs text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href={`tel:${hotline}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                    {hotline}
                  </a>
                  <a href={PHONE_SECONDARY_TEL} className="font-semibold text-foreground hover:text-primary transition-colors">
                    {PHONE_SECONDARY}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
                    {email}
                  </a>
                  <a href={`mailto:${COMPANY_EMAIL_SECONDARY}`} className="hover:text-primary transition-colors">
                    {COMPANY_EMAIL_SECONDARY}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-foreground block">
                    {isBn ? COMPANY_OFFICE_TITLE_BN : COMPANY_OFFICE_TITLE_EN}
                  </span>
                  <span>{address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Accordion View */}
        <div className="flex flex-col gap-4 md:hidden">
          <div className="mb-2 flex flex-col gap-2 text-center">
            <Link href="/" className="flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                <Pill className="h-5 w-5" />
              </div>
              <span className="font-serif-title text-xl font-bold text-primary">
                {siteName}
              </span>
            </Link>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'বাংলাদেশের নির্ভরযোগ্য অনলাইন ফার্মেসি'
                : 'Bangladesh Trusted Digital Pharmacy'}
            </p>
          </div>

          {/* Accordion 1: About */}
          <div className="border-b border-border pb-3">
            <button
              onClick={() => toggleSection('about')}
              className="flex w-full items-center justify-between py-1 text-sm font-bold text-foreground"
            >
              <span>{isBn ? `${siteName} সম্পর্কে` : `About ${siteName}`}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSection === 'about' && 'rotate-180'
                )}
              />
            </button>
            {openSection === 'about' && (
              <ul className="mt-3 flex flex-col gap-2 pl-2 text-xs text-muted-foreground">
                {MOCK_FOOTER_NAV.about.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="hover:text-primary">
                      {isBn ? link.labelBn : link.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 2: Support & Policies */}
          <div className="border-b border-border pb-3">
            <button
              onClick={() => toggleSection('support')}
              className="flex w-full items-center justify-between py-1 text-sm font-bold text-foreground"
            >
              <span>{isBn ? 'গ্রাহক সহায়তা ও নীতি' : 'Customer Support & Policies'}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSection === 'support' && 'rotate-180'
                )}
              />
            </button>
            {openSection === 'support' && (
              <ul className="mt-3 flex flex-col gap-2 pl-2 text-xs text-muted-foreground">
                {MOCK_FOOTER_NAV.support.map((link, idx) => (
                  <li key={idx}>
                    <Link href={link.href} className="hover:text-primary">
                      {isBn ? link.labelBn : link.labelEn}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Accordion 3: Contact */}
          <div className="border-b border-border pb-3">
            <button
              onClick={() => toggleSection('contact')}
              className="flex w-full items-center justify-between py-1 text-sm font-bold text-foreground"
            >
              <span>{isBn ? 'যোগাযোগ ঠিকানা' : 'Contact Information'}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  openSection === 'contact' && 'rotate-180'
                )}
              />
            </button>
            {openSection === 'contact' && (
              <div className="mt-3 flex flex-col gap-2.5 pl-2 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">{hotline}</p>
                <p>{email}</p>
                <p>{address}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Icons & Developer Attribution Row */}
        <div className="mt-4 border-t border-border pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Side: Payment Methods */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 justify-start">
            {/* bKash */}
            <span className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:border-primary/40 transition-colors">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E2136E] text-white text-[9px] font-black">b</span>
              <span>{isBn ? 'বিকাশ' : 'bKash'}</span>
            </span>

            {/* Nagad */}
            <span className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:border-primary/40 transition-colors">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#F7921E] text-white text-[9px] font-black">ন</span>
              <span>{isBn ? 'নগদ' : 'Nagad'}</span>
            </span>

            {/* Rocket */}
            <span className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:border-primary/40 transition-colors">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#8C3494] text-white text-[9px] font-black">R</span>
              <span>{isBn ? 'রকেট' : 'Rocket'}</span>
            </span>

            {/* Visa */}
            <span className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:border-primary/40 transition-colors">
              <svg className="h-4 w-4 text-[#1A1F71]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.5l.9-5.7h1.6l-.9 5.7H9zm7.3-5.6c-.3-.1-.8-.2-1.3-.2-1.5 0-2.6.8-2.6 1.9 0 .8.8 1.3 1.3 1.6.6.3.8.5.8.8 0 .5-.6.7-1.1.7-.8 0-1.2-.1-1.8-.4l-.3-.1-.3 1.7c.5.2 1.3.4 2.1.4 1.6 0 2.7-.8 2.7-2 0-.7-.4-1.2-1.4-1.6-.6-.3-.9-.5-.9-.8 0-.3.3-.6 1-.6.6 0 1 .1 1.4.3l.2.1.3-1.8zm3.6-0.1h-1.3c-.4 0-.7.1-.9.5l-2.5 5.9h1.7l.3-.9h2.1l.2.9h1.5l-1.1-6.4zm-1.8 4.2l.7-1.9.4 1.9h-1.1zM7.2 10.8L5.6 15c-.1.3-.3.4-.6.4H2.4l-.1.3 3.3.7c.6.1 1.1-.3 1.3-1l1.3-4.6H7.2z" />
              </svg>
              <span>{isBn ? 'ভিসা' : 'Visa'}</span>
            </span>

            {/* Mastercard */}
            <span className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:border-primary/40 transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <circle cx="9" cy="12" r="6" fill="#EB001B" />
                <circle cx="15" cy="12" r="6" fill="#F79E1B" fillOpacity="0.8" />
              </svg>
              <span>{isBn ? 'মাষ্টারকার্ড' : 'Mastercard'}</span>
            </span>

            {/* Cash on Delivery */}
            <span className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:border-primary/40 transition-colors">
              <Banknote className="h-4 w-4 text-success shrink-0" />
              <span>{isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
            </span>
          </div>

          {/* Right Side: Developed by CodeClub IT Solutions */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-foreground shrink-0">
            <span className="text-muted-foreground">{isBn ? 'ডেভেলপমেন্টে:' : 'Developed by'}</span>
            <a
              href="https://codeclubitsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-extrabold text-primary hover:underline transition-colors"
            >
              CodeClub IT Solutions
            </a>
          </div>
        </div>
      </div>

      {/* Centered Bottom Copyright Sub-Footer Bar (Compact Padding) */}
      <div className="border-t border-border bg-background py-2.5 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            © 2026 mediShop Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
