'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/utils/cart';
import { FREE_DELIVERY_THRESHOLD } from '@/utils/pricing';

interface FreeDeliveryProgressProps {
  subtotal: number;
  isBn?: boolean;
  className?: string;
}

export function FreeDeliveryProgress({
  subtotal,
  isBn = true,
  className = '',
}: FreeDeliveryProgressProps) {
  const percentage = Math.min(
    100,
    Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100)
  );
  const remaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const isUnlocked = subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <div
      className={`rounded-2xl border p-4 shadow-xs transition-all ${
        isUnlocked
          ? 'border-emerald-200 bg-emerald-50/70'
          : 'border-primary/20 bg-primary/5'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-xs">
              <Truck className="h-4 w-4" />
            </div>
          )}

          <p className="text-xs sm:text-sm font-bold text-foreground">
            {isUnlocked ? (
              <span className="flex items-center gap-1.5 text-emerald-800">
                <Sparkles className="h-4 w-4 text-emerald-600 animate-bounce" />
                {isBn
                  ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি আনলক করেছেন!'
                  : 'Congratulations! You unlocked FREE Delivery!'}
              </span>
            ) : (
              <span>
                {isBn ? (
                  <>
                    বিনামূল্যে ডেলিভারির জন্য আরও{' '}
                    <span className="font-extrabold text-primary">
                      {formatPrice(remaining, 'bn')}
                    </span>{' '}
                    টাকার ওষুধ যোগ করুন
                  </>
                ) : (
                  <>
                    Add{' '}
                    <span className="font-extrabold text-primary">
                      {formatPrice(remaining, 'en')}
                    </span>{' '}
                    more for FREE Delivery
                  </>
                )}
              </span>
            )}
          </p>
        </div>

        <span className="text-xs font-bold tracking-tight text-muted-foreground">
          {percentage}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${
            isUnlocked
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
              : 'bg-gradient-to-r from-primary to-accent'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
