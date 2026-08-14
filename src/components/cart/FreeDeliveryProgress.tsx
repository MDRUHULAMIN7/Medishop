'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, CheckCircle2 } from 'lucide-react';
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
      className={`rounded-2xl border p-4.5 shadow-2xs space-y-3 ${
        isUnlocked
          ? 'border-emerald-200 bg-emerald-50/70'
          : 'border-blue-100 bg-blue-50/60'
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-2xs">
            {isUnlocked ? <CheckCircle2 className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>

          <p className="font-bold text-gray-900">
            {isUnlocked ? (
              <span className="text-emerald-800">
                {isBn ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!' : 'Congratulations! Free Delivery Unlocked!'}
              </span>
            ) : (
              <span>
                {isBn ? (
                  <>
                    আপনি আরও{' '}
                    <span className="font-extrabold text-blue-600">
                      {formatPrice(remaining, 'bn')}
                    </span>{' '}
                    যোগ করলে ফ্রি ডেলিভারি পাবেন!
                  </>
                ) : (
                  <>
                    Add{' '}
                    <span className="font-extrabold text-blue-600">
                      {formatPrice(remaining, 'en')}
                    </span>{' '}
                    more for FREE Delivery!
                  </>
                )}
              </span>
            )}
          </p>
        </div>

        <span className="text-xs font-extrabold text-gray-600 shrink-0">
          {formatPrice(subtotal, isBn ? 'bn' : 'en')} / {formatPrice(FREE_DELIVERY_THRESHOLD, isBn ? 'bn' : 'en')}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-blue-100/80">
        <motion.div
          className={`h-full rounded-full ${
            isUnlocked ? 'bg-emerald-600' : 'bg-blue-600'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
