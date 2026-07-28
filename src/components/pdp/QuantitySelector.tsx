'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { useAppSelector } from '@/store';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  max = 99,
}: QuantitySelectorProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-muted-foreground">
        {isBn ? 'পরিমাণ:' : 'Quantity:'}
      </span>
      <div className="flex items-center rounded-2xl border border-border bg-muted/20 p-1 shadow-2xs">
        <button
          type="button"
          onClick={onDecrease}
          disabled={quantity <= 1}
          aria-label={isBn ? 'পরিমাণ কমান' : 'Decrease quantity'}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-background text-foreground transition-all hover:bg-muted disabled:opacity-40"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <span className="w-10 text-center font-serif-title text-sm font-bold text-foreground">
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          disabled={quantity >= max}
          aria-label={isBn ? 'পরিমাণ বাড়ান' : 'Increase quantity'}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-background text-foreground transition-all hover:bg-muted disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
