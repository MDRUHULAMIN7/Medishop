'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onApply: (min: number, max: number) => void;
}

export function PriceRangeSlider({
  minPrice,
  maxPrice,
  onApply,
}: PriceRangeSliderProps) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice || 3000);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  useEffect(() => {
    setMin(minPrice);
    setMax(maxPrice || 3000);
  }, [minPrice, maxPrice]);

  const handleApply = () => {
    onApply(min, max);
  };

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {isBn ? 'মূল্যসীমা (টাকা)' : 'Price Range (BDT)'}
      </h4>

      {/* Min/Max Range Slider */}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={3000}
          step={50}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>

      {/* Min & Max Inputs */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[10px] font-medium text-muted-foreground">
            {isBn ? 'সর্বনিম্ন' : 'Min'}
          </span>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-muted/20 py-1.5 px-2.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
          />
        </div>
        <span className="text-muted-foreground text-xs mt-4">-</span>
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-[10px] font-medium text-muted-foreground">
            {isBn ? 'সর্বোচ্চ' : 'Max'}
          </span>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-muted/20 py-1.5 px-2.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="w-full rounded-xl bg-primary/10 border border-primary/20 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
      >
        {isBn ? 'ফিল্টার প্রয়োগ করুন' : 'Apply Price'}
      </button>
    </div>
  );
}
