'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '@/types/product';
import { useAppSelector } from '@/store';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const OPTIONS: { value: SortOption; labelBn: string; labelEn: string }[] = [
    { value: 'popularity', labelBn: 'জনপ্রিয়তা (ডিফল্ট)', labelEn: 'Popularity (Default)' },
    { value: 'price-asc', labelBn: 'দাম: কম থেকে বেশি', labelEn: 'Price: Low to High' },
    { value: 'price-desc', labelBn: 'দাম: বেশি থেকে কম', labelEn: 'Price: High to Low' },
    { value: 'discount-desc', labelBn: 'সর্বোচ্চ ছাড়', labelEn: 'Highest Discount' },
    { value: 'newest', labelBn: 'নতুন সংযোজিত', labelEn: 'Newest Arrivals' },
    { value: 'name-asc', labelBn: 'নাম: A থেকে Z', labelEn: 'Name: A to Z' },
  ];

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline-block">
        <ArrowUpDown className="h-3.5 w-3.5 inline mr-1" />
        {isBn ? 'সাজান:' : 'Sort By:'}
      </label>

      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="rounded-xl border border-border bg-background py-2 px-3 text-xs font-semibold text-foreground shadow-2xs focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {isBn ? opt.labelBn : opt.labelEn}
          </option>
        ))}
      </select>
    </div>
  );
}
