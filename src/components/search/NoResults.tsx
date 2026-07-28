'use client';

import React from 'react';
import Link from 'next/link';
import { SearchX, ArrowRight } from 'lucide-react';
import { useAppSelector } from '@/store';
import { MOCK_CATEGORIES } from '@/mocks';

interface NoResultsProps {
  query?: string;
}

export function NoResults({ query }: NoResultsProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl border border-dashed border-border bg-muted/20 my-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 mb-4">
        <SearchX className="h-8 w-8" />
      </div>

      <h3 className="font-serif-title text-lg sm:text-xl font-bold text-foreground">
        {isBn ? `"${query}" সম্পর্কিত কোনো পণ্য পাওয়া যায়নি` : `No results found for "${query}"`}
      </h3>

      <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-md">
        {isBn
          ? 'বানান সঠিক কিনা তা পরীক্ষা করুন অথবা অন্য কোনো ওষুধের নাম লিখে চেষ্টা করুন।'
          : 'Please check your spelling or try searching for a generic medicine name.'}
      </p>

      {/* Suggested Categories */}
      <div className="mt-6 w-full max-w-lg">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          {isBn ? 'জনপ্রিয় ক্যাটাগরিগুলো দেখুন' : 'Explore Popular Categories'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {MOCK_CATEGORIES.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <span>{isBn ? cat.nameBn : cat.nameEn}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
