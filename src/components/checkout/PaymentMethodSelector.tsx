'use client';

import React from 'react';
import { Banknote, Smartphone, CreditCard, Building2, Check, CreditCard as CardIcon } from 'lucide-react';
import { PaymentMethod, PaymentMethodId } from '@/types/checkout';
import { cn } from '@/lib/utils';

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
  const getIcon = (id: PaymentMethodId) => {
    switch (id) {
      case 'cod':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Banknote className="h-5 w-5" />
          </div>
        );
      case 'bkash':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-pink-600 font-bold text-xs shrink-0">
            <span>bKash</span>
          </div>
        );
      case 'nagad':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 font-bold text-xs shrink-0">
            <span>Nagad</span>
          </div>
        );
      case 'card':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <CreditCard className="h-5 w-5" />
          </div>
        );
      case 'banking':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
            <Smartphone className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header matching Screenshot */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <CardIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">
            {isBn ? 'পেমেন্ট মেথড' : 'Payment Method'}
          </h3>
          <p className="text-xs text-gray-500">
            {isBn ? 'আপনার নিরাপদ পেমেন্ট মাধ্যম নির্বাচন করুন' : 'Select a secure payment method'}
          </p>
        </div>
      </div>

      {/* Grid of Cards matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {methods.map((method) => {
          const isSelected = method.id === selectedId;

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                'relative flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-all duration-200',
                isSelected
                  ? 'border-2 border-blue-600 bg-white shadow-xs'
                  : 'border border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                {getIcon(method.id)}
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {isBn ? method.nameBn : method.nameEn}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {isBn ? method.descriptionBn : method.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Radio Checkmark on Right */}
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all',
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'border-2 border-gray-300 bg-white'
                )}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
