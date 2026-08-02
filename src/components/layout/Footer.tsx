'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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

export function Footer() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const TRUST_ICONS: Record<string, React.ReactNode> = {
    ShieldCheck: <ShieldCheck className="h-6 w-6 text-primary" />,
    Award: <Award className="h-6 w-6 text-primary" />,
    Truck: <Truck className="h-6 w-6 text-primary" />,
    Headphones: <Headphones className="h-6 w-6 text-primary" />,
  };

  return (
    <footer className="border-t border-border bg-muted/40 text-foreground">
      {/* 1. Top Trust Badges Section */}
      <div className="border-b border-border bg-background py-8">
        <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {MOCK_TRUST_BADGES.map((badge) => (
              <div
                key={badge.id}
                className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-muted/20 p-4 transition-all duration-200 hover:bg-primary/5 hover:border-primary/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  {TRUST_ICONS[badge.iconName] || (
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground sm:text-sm">
                    {isBn ? badge.titleBn : badge.titleEn}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight sm:text-xs">
                    {isBn ? badge.descriptionBn : badge.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Links */}
      <div className="mx-auto max-w-[1700px] px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Desktop 4-Column Grid */}
        <div className="hidden grid-cols-1 gap-8 md:grid md:grid-cols-4">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold">
                <Pill className="h-5 w-5" />
              </div>
              <span className="font-serif-title text-2xl font-bold text-primary">
                mediShop
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
              {isBn ? 'মেডিশপ সম্পর্কে' : 'About mediShop'}
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
                  <a href={HOTLINE_TEL} className="font-semibold text-foreground hover:text-primary transition-colors">
                    {HOTLINE_NUMBER}
                  </a>
                  <a href={PHONE_SECONDARY_TEL} className="font-semibold text-foreground hover:text-primary transition-colors">
                    {PHONE_SECONDARY}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-0.5">
                  <a href={`mailto:${COMPANY_EMAIL_PRIMARY}`} className="hover:text-primary transition-colors">
                    {COMPANY_EMAIL_PRIMARY}
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
                  <span>{isBn ? COMPANY_ADDRESS_BN : COMPANY_ADDRESS_EN}</span>
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
                mediShop
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
              <span>{isBn ? 'মেডিশপ সম্পর্কে' : 'About mediShop'}</span>
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
                <p className="font-semibold text-foreground">{HOTLINE_NUMBER} / {PHONE_SECONDARY}</p>
                <p>{COMPANY_EMAIL_PRIMARY}</p>
                <p>{isBn ? COMPANY_ADDRESS_BN : COMPANY_ADDRESS_EN}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Icons */}
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs font-semibold text-muted-foreground">
            {isBn ? 'আমরা পেমেন্ট গ্রহণ করি' : 'We Accept Payment Methods'}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {['bKash', 'Nagad', 'Rocket', 'Visa', 'Mastercard', 'Cash on Delivery'].map(
              (method, idx) => (
                <span
                  key={idx}
                  className="rounded-xl border border-border bg-background px-3.5 py-1.5 text-[11px] font-bold text-foreground shadow-2xs"
                >
                  {method}
                </span>
              )
            )}
          </div>
        </div>
      </div>

      {/* Copyright Sub-Footer Bar */}
      <div className="border-t border-border bg-background py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-[1700px] flex-col items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
          <p>© 2026 mediShop Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            {isBn ? 'ডিজাইন করা হয়েছে' : 'Built with'}{' '}
            <Heart className="h-3.5 w-3.5 fill-danger text-danger inline" />{' '}
            {isBn ? 'বাংলাদেশের স্বাস্থ্য সেবায়' : 'for Healthcare in BD'}
          </p>
        </div>
      </div>
    </footer>
  );
}
