'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, FolderTree } from 'lucide-react';
import { useAppSelector } from '@/store';
import { useCategories } from '@/hooks/useCategories';

const CATEGORY_STYLES = [
  { bgClass: 'bg-[#FEF7EC]', borderClass: 'border-[#FDE6C6]/80', hoverBorderClass: 'hover:border-amber-400' },
  { bgClass: 'bg-[#EBF5FF]', borderClass: 'border-[#C8E3FF]/80', hoverBorderClass: 'hover:border-sky-400' },
  { bgClass: 'bg-[#ECFDF5]', borderClass: 'border-[#A7F3D0]/80', hoverBorderClass: 'hover:border-emerald-400' },
  { bgClass: 'bg-[#FAF5FF]', borderClass: 'border-[#E9D5FF]/80', hoverBorderClass: 'hover:border-purple-400' },
  { bgClass: 'bg-[#F0FDFA]', borderClass: 'border-[#99F6E4]/80', hoverBorderClass: 'hover:border-teal-400' },
  { bgClass: 'bg-[#FFF1F2]', borderClass: 'border-[#FECDD3]/80', hoverBorderClass: 'hover:border-rose-400' },
];

export function ShopByCategory() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const { categories, isLoading } = useCategories();

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

  const displayCategories = categories && categories.length > 0 ? categories : [];

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
            type="button"
            onClick={scrollLeft}
            aria-label={isBn ? 'পূর্বে যান' : 'Scroll left'}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-2xs hover:bg-muted hover:text-primary transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            aria-label={isBn ? 'পরে যান' : 'Scroll right'}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-xs hover:bg-primary-dark transition-all active:scale-95 cursor-pointer"
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
        {isLoading ? (
          <div className="flex h-36 w-full items-center justify-center text-xs text-muted-foreground">
            {isBn ? 'ক্যাটাগরি লোড হচ্ছে...' : 'Loading categories...'}
          </div>
        ) : displayCategories.length === 0 ? (
          <div className="flex h-24 w-full items-center justify-center text-xs font-semibold text-muted-foreground">
            {isBn ? 'কোনো ক্যাটাগরি যুক্ত করা নেই' : 'No categories available'}
          </div>
        ) : (
          displayCategories.map((cat, idx) => {
            const style = CATEGORY_STYLES[idx % CATEGORY_STYLES.length];
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`group flex w-[200px] sm:w-[230px] lg:w-[250px] shrink-0 flex-col justify-between rounded-3xl border p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${style.bgClass} ${style.borderClass} ${style.hoverBorderClass}`}
              >
                {/* Card Top: Title & Arrow */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                      {isBn ? cat.nameBn || cat.name : cat.nameEn || cat.name}
                    </h3>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-primary shadow-xs transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white shrink-0">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Card Center: Product / Category Image */}
                <div className="my-3 flex h-28 sm:h-32 w-full items-center justify-center p-1">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={isBn ? cat.nameBn || cat.name : cat.nameEn || cat.name}
                      className="h-full w-full object-contain object-center mix-blend-multiply dark:mix-blend-normal contrast-[1.03] transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <FolderTree className="h-8 w-8" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}
