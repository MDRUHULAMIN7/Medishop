'use client';

import React from 'react';
import { Building2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaymentBrandIconProps {
  code: string;
  className?: string;
  isBn?: boolean;
}

export function PaymentBrandIcon({ code, className, isBn = false }: PaymentBrandIconProps) {
  const normalized = (code || '').toLowerCase().trim();

  // 1. Cash on Delivery (COD)
  if (normalized === 'cod' || normalized.includes('cash')) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-1 text-center', className)}>
        <svg
          viewBox="0 0 54 36"
          className="h-8 w-10 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Green Hand reaching horizontally over the bill */}
          <path
            d="M48 5C44.5 5 39 6.8 34 9.2L24.5 9.2C22 9.2 20 10.6 20 12.4C20 14.2 22 15.6 24.5 15.6H37.5L48 12.2V5Z"
            fill="#22C55E"
          />
          <path
            d="M27 12.5H37.5"
            stroke="#16A34A"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* Banknote */}
          <rect x="5" y="15" width="38" height="19" rx="3" fill="#22C55E" />
          <rect
            x="7.5"
            y="17.5"
            width="33"
            height="14"
            rx="1.5"
            fill="none"
            stroke="#DCFCE7"
            strokeWidth="0.9"
            strokeDasharray="1.5 1"
          />
          <circle cx="24" cy="24.5" r="3.8" fill="#DCFCE7" />
          <circle cx="24" cy="24.5" r="2" fill="#16A34A" />
          <circle cx="9.5" cy="19.5" r="1.1" fill="#DCFCE7" />
          <circle cx="38.5" cy="19.5" r="1.1" fill="#DCFCE7" />
          <circle cx="9.5" cy="29.5" r="1.1" fill="#DCFCE7" />
          <circle cx="38.5" cy="29.5" r="1.1" fill="#DCFCE7" />
        </svg>
        <span className="text-[10px] sm:text-[11px] font-bold leading-tight text-foreground">
          Cash on Delivery
          <span className="block text-[9px] sm:text-[10px] font-medium text-muted-foreground">(COD)</span>
        </span>
      </div>
    );
  }

  // 2. bKash (Official magenta rounded app icon badge with white origami bird + bKash text)
  if (normalized.includes('bkash')) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-1', className)}>
        <svg
          viewBox="0 0 100 100"
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Magenta/Pink rounded square */}
          <rect width="100" height="100" rx="22" fill="#DF1060" />

          {/* Clean White Origami Bird with precise geometric facets */}
          <g stroke="#DF1060" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
            {/* Top Left Wing */}
            <polygon points="18,24 43,49 27,62" fill="#FFFFFF" />
            {/* Upper Head / Beak */}
            <polygon points="18,24 78,38 43,49" fill="#FFFFFF" />
            {/* Beak tip */}
            <polygon points="78,38 86,45 74,53 64,51" fill="#FFFFFF" />
            {/* Main Body Center Facet */}
            <polygon points="43,49 74,53 47,82" fill="#F8FAFC" />
            {/* Lower Tail Wing */}
            <polygon points="27,62 43,49 47,82 33,83" fill="#FFFFFF" />
            {/* Inner Facet / Shadow crease */}
            <polygon points="43,49 58,51 47,68" fill="#F1F5F9" />
          </g>
        </svg>

        <div className="flex items-baseline font-bold tracking-tight">
          <span className="text-sm sm:text-base font-black text-[#DF1060]">b</span>
          <span className="text-xs sm:text-sm font-bold text-foreground">Kash</span>
        </div>
      </div>
    );
  }

  // 3. Nagad (Official circular aperture blade swirl + postman runner inside + নগদ text)
  if (normalized.includes('nagad')) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-0.5', className)}>
        <svg
          viewBox="0 0 120 120"
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 shadow-xs"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="nagadLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAA61A" />
              <stop offset="35%" stopColor="#F37021" />
              <stop offset="75%" stopColor="#E52028" />
              <stop offset="100%" stopColor="#B30E16" />
            </linearGradient>
          </defs>

          {/* Outer Swirl Ring */}
          <path
            d="M60 4C29.07 4 4 29.07 4 60C4 90.93 29.07 116 60 116C90.93 116 116 90.93 116 60C116 52 114.3 44.4 111.2 37.5L95.5 45.2C97.1 49.8 98 54.8 98 60C98 81 81 98 60 98C39 98 22 81 22 60C22 39 39 22 60 22C68.5 22 76.4 24.8 82.8 29.5L95.8 17.5C85.8 9.1 73.5 4 60 4Z"
            fill="url(#nagadLogoGrad)"
          />

          {/* Swirl Aperture Blades */}
          <path
            d="M60 10C32.4 10 10 32.4 10 60C10 74 15.8 86.6 25.1 95.6L37.8 83C31.7 76.8 28 68.8 28 60C28 42.3 42.3 28 60 28C69.3 28 77.7 32 83.6 38.4L96.2 26C86.9 16.1 74.2 10 60 10Z"
            fill="#FAA61A"
          />
          <path
            d="M60 18C36.8 18 18 36.8 18 60C18 71.6 22.7 82.1 30.3 89.7L43 77C38.7 72.3 36 66.5 36 60C36 46.7 46.7 36 60 36C67 36 73.3 39 77.8 43.8L90.5 31.1C82.8 23 72 18 60 18Z"
            fill="#F37021"
          />

          {/* Inner White Circle */}
          <circle cx="60" cy="60" r="28" fill="#FFFFFF" />

          {/* Center Running Postman (ডাক হরকরা) in Red */}
          <g fill="#D71920">
            {/* Head */}
            <circle cx="53" cy="44.5" r="3.2" />
            <path d="M50 43C50.5 41.5 53 41 55 42C56.5 42.8 56.5 44.5 55.5 45.2C54.5 45.8 51 45.5 50 43Z" />

            {/* Mail Sack on back */}
            <path d="M53 48C58 46.5 63 50 63 55C63 59 58 62 54 60C51.5 58.8 50.5 55 51 51C51.5 49 52 48.5 53 48Z" />

            {/* Torso & garment */}
            <path d="M49 47C52 47 54 49 54 53L51 63C50 64 47 64 46 62L46 54C46 50 47.5 47.5 49 47Z" />
            <path d="M44 61C48 60 53 60 54 63L51 66C48 67 44 66 43 64L44 61Z" />

            {/* Running legs */}
            <path d="M50 63L57 71L60 70L54 62Z" />
            <path d="M57 71L58 79L55 80L54 72Z" />
            <path d="M58 79L62 80L62 81.5L56 81.5Z" />
            <path d="M46 62L41 68L44 70L48 63Z" />
            <path d="M41 68L35 70L34 68L40 66Z" />

            {/* Arm */}
            <path d="M48 51L45 55L47 57L50 53Z" />

            {/* Spear / Staff running horizontally */}
            <rect x="30" y="54" width="48" height="1.8" rx="0.9" />
            <polygon points="30,55 24,55 28,52" />
            <polygon points="30,55 24,55 28,58" />

            {/* Hanging Lantern (হারিকেন) */}
            <rect x="42" y="55.8" width="0.8" height="4" />
            <path d="M40 59.8H44.8L44 67H40.8L40 59.8Z" />
            <circle cx="42.4" cy="63.4" r="1.2" fill="#FFFFFF" />
            <rect x="39.5" y="67" width="5.8" height="1.2" rx="0.5" />
            <rect x="40.5" y="59.2" width="3.8" height="0.8" rx="0.4" />
          </g>
        </svg>

        <span className="text-xs sm:text-sm font-black tracking-normal text-[#D71920]">নগদ</span>
      </div>
    );
  }

  // 4. Card / VISA / Mastercard / SSLCommerz
  if (
    normalized.includes('card') ||
    normalized.includes('visa') ||
    normalized.includes('mastercard') ||
    normalized.includes('sslcommerz')
  ) {
    return (
      <div className={cn('flex items-center justify-center gap-1.5 sm:gap-2', className)}>
        <span className="text-lg sm:text-xl font-black italic tracking-tight text-[#1434CB] dark:text-[#5b75ff]">
          VISA
        </span>
        <svg
          viewBox="0 0 34 22"
          className="h-6 w-9 sm:h-7 sm:w-10 shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="9" fill="#EB001B" />
          <circle cx="23" cy="11" r="9" fill="#F79E1B" fillOpacity="0.95" />
          <path
            d="M17 4.2C19.1 5.9 20.5 8.3 20.5 11C20.5 13.7 19.1 16.1 17 17.8C14.9 16.1 13.5 13.7 13.5 11C13.5 8.3 14.9 5.9 17 4.2Z"
            fill="#FF5F00"
          />
        </svg>
      </div>
    );
  }

  // 5. Rocket
  if (normalized.includes('rocket')) {
    return (
      <div className={cn('flex items-center justify-center gap-1.5', className)}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#8C3494] text-xs font-black text-white shadow-2xs">
          R
        </span>
        <span className="text-base sm:text-lg font-black tracking-normal text-[#8C3494]">Rocket</span>
      </div>
    );
  }

  // 6. Net Banking
  if (normalized.includes('banking')) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-1 text-primary', className)}>
        <Building2 className="h-7 w-7" />
        <span className="text-[11px] font-bold text-foreground">{isBn ? 'ব্যাংকিং' : 'Net Banking'}</span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-1 text-primary', className)}>
      <CreditCard className="h-7 w-7" />
      <span className="text-[11px] font-bold text-foreground">{isBn ? 'পেমেন্ট' : 'Payment'}</span>
    </div>
  );
}
