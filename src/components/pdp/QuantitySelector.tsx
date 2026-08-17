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
    
      <div className="flex items-center rounded-lg border border-border bg-muted/20 p-1 shadow-2xs">
        <button
          type="button"
          onClick={onDecrease}
          disabled={quantity <= 1}
          aria-label={isBn ? 'পরিমাণ কমান' : 'Decrease quantity'}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-background text-foreground transition-all hover:bg-muted disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>

        <span className="w-10 text-center font-serif-title text-lg font-bold text-foreground">
          {quantity}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          aria-label={isBn ? 'পরিমাণ বাড়ান' : 'Increase quantity'}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-background text-foreground transition-all hover:bg-muted hover:text-primary active:scale-95 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
