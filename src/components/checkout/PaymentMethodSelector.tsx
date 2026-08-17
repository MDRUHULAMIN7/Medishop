'use client';

import React from 'react';
import { CreditCard as CardIcon } from 'lucide-react';
import { PaymentMethod, PaymentMethodId } from '@/types/checkout';
import { cn } from '@/lib/utils';
import { PaymentBrandIcon } from '@/components/common/PaymentBrandIcon';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedId: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
  isBn?: boolean;
}

export function PaymentMethodSelector({
  methods,
  selectedId,
  onSelect,
  isBn = true,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
          <CardIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">
            {isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isBn ? 'পছন্দসই পেমেন্ট মাধ্যম বেছে নিন' : 'Select your preferred payment method'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {methods.map((method) => {
          const isSelected = method.id === selectedId;

          return (
            <button
              type="button"
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                'relative flex h-[100px] sm:h-[110px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border p-2 text-center transition-all select-none',
                isSelected
                  ? 'border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs ring-2 ring-indigo-200/60 dark:ring-indigo-800/40'
                  : 'border-border bg-background hover:border-border/80 hover:bg-muted/40'
              )}
            >
              {/* Radio Indicator */}
              <div className="absolute left-2.5 top-2.5">
                <div
                  className={cn(
                    'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-all',
                    isSelected
                      ? 'border-2 border-indigo-600 bg-indigo-600'
                      : 'border-2 border-muted-foreground/30 bg-background'
                  )}
                >
                  {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
              </div>

              {/* Centered Brand Icon */}
              <div className="flex h-full w-full items-center justify-center pt-1">
                <PaymentBrandIcon code={method.id} isBn={isBn} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
