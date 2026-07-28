'use client';

import React from 'react';
import { useAppSelector } from '@/store';

interface DiscountFilterProps {
  selectedDiscounts: number[];
  onChange: (discounts: number[]) => void;
}

export function DiscountFilter({
  selectedDiscounts,
  onChange,
}: DiscountFilterProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const DISCOUNTS = [10, 20, 30, 50];

  const toggleDiscount = (val: number) => {
    if (selectedDiscounts.includes(val)) {
      onChange(selectedDiscounts.filter((d) => d !== val));
    } else {
      onChange([...selectedDiscounts, val]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {isBn ? 'ছাড়ের পরিমাণ' : 'Discount Percentage'}
      </h4>
      <div className="flex flex-col gap-1.5">
        {DISCOUNTS.map((disc) => (
          <label
            key={disc}
            className="flex items-center gap-2 text-xs cursor-pointer select-none py-1 px-1 rounded-lg hover:bg-muted/40"
          >
            <input
              type="checkbox"
              checked={selectedDiscounts.includes(disc)}
              onChange={() => toggleDiscount(disc)}
              className="rounded border-border text-primary focus:ring-primary"
            />
            <span className="font-medium text-foreground">
              {disc}% {isBn ? 'বা তার বেশি ছাড়' : '% or more'}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
