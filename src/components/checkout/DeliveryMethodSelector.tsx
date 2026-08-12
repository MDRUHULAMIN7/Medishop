'use client';

import React from 'react';
import { Truck, Zap, Store, Check } from 'lucide-react';
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
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
            <Zap className="h-5 w-5 fill-amber-500/20" />
          </div>
        );
      case 'pickup':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Store className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Truck className="h-5 w-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header matching Screenshot */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">
            {isBn ? 'ডেলিভারি মেথড' : 'Delivery Options'}
          </h3>
          <p className="text-xs text-gray-500">
            {isBn ? 'আপনার পছন্দসই ডেলিভারি মাধ্যম বাছুন' : 'Choose your preferred delivery method'}
          </p>
        </div>
      </div>

      {/* 3 Horizontal Cards Grid matching Screenshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {methods.map((method) => {
          const isSelected = method.id === selectedId;

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                'relative cursor-pointer rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between',
                isSelected
                  ? 'border-2 border-blue-600 bg-blue-50/20 shadow-xs'
                  : 'border border-gray-200 bg-white hover:border-gray-300'
              )}
            >
              {/* Radio Checkmark on Top Right */}
              <div className="absolute top-4 right-4">
                <div
                  className={cn(
                    'flex h-5 w-5 items-center justify-center rounded-full transition-all',
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'border-2 border-gray-300 bg-white'
                  )}
                >
                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
              </div>

              <div>
                {/* Icon */}
                <div className="mb-3">{getIcon(method.id)}</div>

                {/* Title + Popular Tag */}
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <h4 className="text-sm font-bold text-gray-900">
                    {isBn ? method.nameBn : method.nameEn}
                  </h4>
                  {method.isPopular && (
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
                      {isBn ? 'পপুলার' : 'Popular'}
                    </span>
                  )}
                </div>

                {/* Subtitle / Delivery Days */}
                <p className="text-xs text-gray-500">
                  {isBn ? method.descriptionBn : method.descriptionEn}
                </p>
              </div>

              {/* Price */}
              <div className="mt-3">
                <span className="text-sm font-bold text-gray-900">
                  {method.charge === 0 ? (
                    <span className="text-blue-600">{isBn ? 'ফ্রি' : 'Free'}</span>
                  ) : (
                    formatPrice(method.charge, isBn ? 'bn' : 'en')
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
