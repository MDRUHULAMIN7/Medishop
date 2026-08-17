'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils/cart';

interface QuantitySelectorProps {
  quantity: number;
  stock?: number;
  minQuantity?: number;
  maxQuantity?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isBn?: boolean;
  className?: string;
}

export function QuantitySelector({
  quantity,
  stock = 999,
  minQuantity = 1,
  maxQuantity,
  onIncrease,
  onDecrease,
  isLoading = false,
  size = 'md',
  isBn = true,
  className,
}: QuantitySelectorProps) {
  const effectiveMax = maxQuantity !== undefined ? Math.min(maxQuantity, stock) : stock;
  const isMinReached = quantity <= minQuantity;
  const isMaxReached = quantity >= effectiveMax;

  const sizeClasses = {
    sm: {
      container: 'h-8 px-1 text-xs gap-1.5 min-w-[90px]',
      button: 'h-6 w-6 rounded-md text-xs',
      count: 'w-6 text-xs font-semibold',
    },
    md: {
      container: 'h-9 px-1.5 text-sm gap-2 min-w-[110px]',
      button: 'h-7 w-7 rounded-lg text-sm',
      count: 'w-8 text-sm font-bold',
    },
    lg: {
      container: 'h-11 px-2 text-base gap-3 min-w-[130px]',
      button: 'h-9 w-9 rounded-xl text-base',
      count: 'w-10 text-base font-bold',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center justify-between rounded-xl border border-border bg-muted/40 p-0.5 shadow-xs transition-all',
        currentSize.container,
        className
      )}
      role="group"
      aria-label={isBn ? 'পরিমাণ পরিবর্তন করুন' : 'Quantity controls'}
    >
      <motion.button
        type="button"
        whileTap={{ scale: isMinReached || isLoading ? 1 : 0.9 }}
        onClick={onDecrease}
        disabled={isMinReached || isLoading}
        aria-label={isBn ? 'পরিমাণ কমান' : 'Decrease quantity'}
        className={cn(
          'flex items-center justify-center font-medium transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary',
          isMinReached || isLoading
            ? 'cursor-not-allowed text-muted-foreground/40'
            : 'bg-background text-foreground shadow-xs hover:bg-muted hover:text-primary active:bg-muted/80',
          currentSize.button
        )}
      >
        <Minus className="h-3.5 w-3.5" />
      </motion.button>

      <div className={cn('text-center font-semibold tracking-tight text-foreground', currentSize.count)}>
        <motion.span
          key={quantity}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="inline-block"
        >
          {formatNumber(quantity, isBn ? 'bn' : 'en')}
        </motion.span>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: isLoading ? 1 : 0.9 }}
        onClick={onIncrease}
        disabled={isLoading}
        aria-label={isBn ? 'পরিমাণ বাড়ান' : 'Increase quantity'}
        className={cn(
          'flex items-center justify-center font-medium transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary cursor-pointer',
          isLoading
            ? 'cursor-not-allowed text-muted-foreground/40'
            : isMaxReached
            ? 'bg-primary/10 text-primary shadow-xs hover:bg-primary hover:text-white'
            : 'bg-background text-foreground shadow-xs hover:bg-muted hover:text-primary active:bg-muted/80',
          currentSize.button
        )}
      >
        <Plus className="h-3.5 w-3.5" />
      </motion.button>
    </div>
  );
}
