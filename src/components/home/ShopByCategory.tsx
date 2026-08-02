'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppSelector } from '@/store';

interface CategoryCardItem {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  bgClass: string;
  borderClass: string;
  hoverBorderClass: string;
  image: string;
}

const FEATURED_CATEGORIES: CategoryCardItem[] = [
  {
    id: 'cat-diabetic',
    slug: 'diabetic-care',
    nameEn: 'Diabetes Care',
    nameBn: 'ডায়াবেটিস কেয়ার',
    descEn: 'Everything you need for daily diabetes management.',
    descBn: 'দৈনন্দিন ডায়াবেটিস নিয়ন্ত্রণের প্রয়োজনীয় সামগ্রী।',
    bgClass: 'bg-[#FEF7EC]',
    borderClass: 'border-[#FDE6C6]/80',
    hoverBorderClass: 'hover:border-amber-400',
    image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'cat-supplements',
    slug: 'supplements',
    nameEn: 'Vitamins & Supplements',
    nameBn: 'ভিটামিন ও সাপ্লিমেন্ট',
    descEn: 'Essential vitamins and nutrients to support health & immunity.',
    descBn: 'রোগ প্রতিরোধ ক্ষমতা বৃদ্ধিতে নিউট্রিশন ও ভিটামিন।',
    bgClass: 'bg-[#EBF5FF]',
    borderClass: 'border-[#C8E3FF]/80',
    hoverBorderClass: 'hover:border-sky-400',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'cat-devices',
    slug: 'devices',
    nameEn: 'Medical Devices',
    nameBn: 'মেডিকেল ডিভাইস',
    descEn: 'Accurate medical devices for convenient health monitoring.',
    descBn: 'বাড়িতে প্রেসার ও সুগার পরিমাপের আধুনিক ডিভাইস।',
    bgClass: 'bg-[#ECFDF5]',
    borderClass: 'border-[#A7F3D0]/80',
    hoverBorderClass: 'hover:border-emerald-400',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'cat-personal',
    slug: 'personal-care',
    nameEn: 'Personal Care',
    nameBn: 'পার্সোনাল কেয়ার',
    descEn: 'Essentials for everyday hygiene and self-care.',
    descBn: 'দৈনন্দিন পার্সোনাল কেয়ার ও হাইজিন সামগ্রী।',
    bgClass: 'bg-[#FAF5FF]',
    borderClass: 'border-[#E9D5FF]/80',
    hoverBorderClass: 'hover:border-purple-400',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'cat-baby',
    slug: 'baby-care',
    nameEn: 'Baby Care',
    nameBn: 'বেবি কেয়ার',
    descEn: 'Gentle baby products for your little one’s everyday health.',
    descBn: 'শিশুর ত্বক ও স্বাস্থ্যের জন্য নিরাপদ যত্ন ও সামগ্রী।',
    bgClass: 'bg-[#F0FDFA]',
    borderClass: 'border-[#99F6E4]/80',
    hoverBorderClass: 'hover:border-teal-400',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'cat-women',
    slug: 'women-choice',
    nameEn: "Women's Choice",
    nameBn: 'উইমেনস চয়েস',
    descEn: 'Specialized healthcare and personal hygiene for women.',
    descBn: 'নারীদের বিশেষায়িত হাইজিন ও হেলথকেয়ার সামগ্রী।',
    bgClass: 'bg-[#FFF1F2]',
    borderClass: 'border-[#FECDD3]/80',
    hoverBorderClass: 'hover:border-rose-400',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop',
  },
];

export function ShopByCategory() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full">
      {/* Header with Title and Scroll Controls */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            {isBn ? 'ক্যাটাগরি অনুযায়ী কেনাকাটা' : 'Shop by Category'}
          </h2>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">
            {isBn ? 'প্রয়োজনীয় ওষুধ ও স্বাস্থ্য সামগ্রী ব্রাউজ করুন' : 'Browse medicine & healthcare by categories'}
          </p>
        </div>

        {/* Scroll Left / Right Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            aria-label={isBn ? 'পূর্বে যান' : 'Scroll left'}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-2xs hover:bg-muted hover:text-primary transition-all active:scale-95"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={scrollRight}
            aria-label={isBn ? 'পরে যান' : 'Scroll right'}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-xs hover:bg-primary-dark transition-all active:scale-95"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Cards Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-2 pt-1 scrollbar-none scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {FEATURED_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`group flex w-[200px] sm:w-[230px] lg:w-[250px] shrink-0 flex-col justify-between rounded-3xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${cat.bgClass} ${cat.borderClass} ${cat.hoverBorderClass}`}
          >
            {/* Card Top: Title & Arrow */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                  {isBn ? cat.nameBn : cat.nameEn}
                </h3>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-primary shadow-xs transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white shrink-0">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Card Center: Product Image with Isolated Transparent Background (mix-blend-multiply) */}
            <div className="my-3 flex h-28 sm:h-32 w-full items-center justify-center p-1">
              <img
                src={cat.image}
                alt={isBn ? cat.nameBn : cat.nameEn}
                className="h-full w-full object-contain object-center mix-blend-multiply dark:mix-blend-normal contrast-[1.03] transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Card Bottom: Short Description */}
            <div>
              <p className="line-clamp-2 text-[11px] sm:text-xs font-medium text-muted-foreground leading-relaxed">
                {isBn ? cat.descBn : cat.descEn}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
