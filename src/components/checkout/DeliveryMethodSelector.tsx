'use client';

import React from 'react';
import { Truck, Zap, Store, Check, Sparkles } from 'lucide-react';
import { DeliveryMethod, DeliveryMethodId } from '@/types/checkout';
import { formatPrice } from '@/utils/cart';
import { cn } from '@/lib/utils';

interface DeliveryMethodSelectorProps {
  methods: DeliveryMethod[];
  selectedId: DeliveryMethodId;
  onSelect: (id: DeliveryMethodId) => void;
  isBn?: boolean;
}

export function DeliveryMethodSelector({
  methods,
  selectedId,
  onSelect,
  isBn = true,
}: DeliveryMethodSelectorProps) {
  const getIcon = (id: DeliveryMethodId) => {
    switch (id) {
      case 'express':
        return <Zap className="h-5 w-5 text-amber-500" />;
      case 'pickup':
        return <Store className="h-5 w-5 text-emerald-600" />;
      default:
        return <Truck className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground">
        {isBn ? 'ডেলিভারি পদ্ধতি নির্বাচন করুন' : 'Select Delivery Option'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {methods.map((method) => {
          const isSelected = method.id === selectedId;

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                'relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-border bg-background hover:border-primary/40 hover:shadow-xs'
              )}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60">
                    {getIcon(method.id)}
                  </div>

                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-muted-foreground/30 bg-background'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="text-xs font-extrabold text-foreground">
                    {isBn ? method.nameBn : method.nameEn}
                  </h4>
                  {method.isPopular && (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-700 border border-amber-200">
                      <Sparkles className="h-2.5 w-2.5" />
                      Popular
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-tight">
                  {isBn ? method.descriptionBn : method.descriptionEn}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {isBn ? method.estimatedDeliveryBn : method.estimatedDeliveryEn}
                </span>

                <span className="text-xs font-extrabold text-primary">
                  {method.charge === 0
                    ? isBn
                      ? 'ফ্রি'
                      : 'FREE'
                    : formatPrice(method.charge, isBn ? 'bn' : 'en')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
