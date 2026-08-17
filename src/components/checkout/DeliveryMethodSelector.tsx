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
  canSplitDelivery?: boolean;
  isSplitDelivery?: boolean;
  onToggleSplitDelivery?: (val: boolean) => void;
  shipment1SelectedId?: DeliveryMethodId;
  onSelectShipment1?: (id: DeliveryMethodId) => void;
  shipment2SelectedId?: DeliveryMethodId;
  onSelectShipment2?: (id: DeliveryMethodId) => void;
  isBn?: boolean;
}

export function DeliveryMethodSelector({
  methods,
  selectedId,
  onSelect,
  canSplitDelivery = false,
  isSplitDelivery = false,
  onToggleSplitDelivery,
  shipment1SelectedId,
  onSelectShipment1,
  shipment2SelectedId,
  onSelectShipment2,
  isBn = true,
}: DeliveryMethodSelectorProps) {
  const getIcon = (id: DeliveryMethodId) => {
    switch (id) {
      case 'express':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Zap className="h-4.5 w-4.5 fill-primary/20" />
          </div>
        );
      case 'pickup':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Store className="h-4.5 w-4.5" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Truck className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  const renderDeliveryGrid = (
    currentSelectedId: DeliveryMethodId,
    handleSelect: (id: DeliveryMethodId) => void
  ) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {methods.map((method) => {
        const isSelected = method.id === currentSelectedId;

        return (
          <div
            key={method.id}
            onClick={() => handleSelect(method.id)}
            className={cn(
              'relative cursor-pointer rounded-2xl p-3.5 transition-all duration-200 flex flex-col justify-between',
              isSelected
                ? 'border-2 border-primary bg-primary/5 shadow-xs'
                : 'border border-gray-200 bg-white hover:border-gray-300'
            )}
          >
            <div className="absolute top-3.5 right-3.5">
              <div
                className={cn(
                  'flex h-4.5 w-4.5 items-center justify-center rounded-full transition-all',
                  isSelected
                    ? 'bg-primary text-white'
                    : 'border-2 border-gray-300 bg-white'
                )}
              >
                {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
              </div>
            </div>

            <div>
              <div className="mb-2">{getIcon(method.id)}</div>

              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                  {isBn ? method.nameBn : method.nameEn}
                </h4>
                {method.isPopular && (
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 border border-emerald-200">
                    {isBn ? 'পপুলার' : 'Popular'}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-gray-500">
                {isBn ? method.descriptionBn : method.descriptionEn}
              </p>
            </div>

            <div className="mt-2.5">
              <span className="text-xs sm:text-sm font-bold text-gray-900">
                {method.charge === 0 ? (
                  <span className="text-primary">{isBn ? 'ফ্রি' : 'Free'}</span>
                ) : (
                  formatPrice(method.charge, isBn ? 'bn' : 'en')
                )}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
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

      {/* Split Delivery Toggle if Cart has mixed items */}
      {canSplitDelivery && onToggleSplitDelivery && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-black text-primary border border-primary/20 inline-block">
            {isBn ? 'Pre-Order ডেলিভারি প্রেফারেন্স' : 'Pre-Order Shipment Choice'}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onToggleSplitDelivery(false)}
              className={cn(
                'rounded-xl border p-3 text-left transition-all cursor-pointer',
                !isSplitDelivery
                  ? 'border-primary bg-white text-primary ring-2 ring-primary/20 shadow-xs'
                  : 'border-border bg-white/60 text-muted-foreground hover:bg-white'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-900">
                  {isBn ? 'একসাথে ডেলিভারি (১টি চালান)' : 'Combined Delivery (1 Shipment)'}
                </span>
                {!isSplitDelivery && <Check className="h-4 w-4 text-primary shrink-0" />}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {isBn
                  ? 'সব ওষুধ একসাথে ৩-৫ দিনের মধ্যে ডেলিভারি হবে।'
                  : 'All items will be delivered together in 3-5 days.'}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onToggleSplitDelivery(true)}
              className={cn(
                'rounded-xl border p-3 text-left transition-all cursor-pointer',
                isSplitDelivery
                  ? 'border-primary bg-white text-primary ring-2 ring-primary/20 shadow-xs'
                  : 'border-border bg-white/60 text-muted-foreground hover:bg-white'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-900">
                  {isBn ? 'আলাদা আলাদা ডেলিভারি (২টি চালান)' : 'Split Delivery (2 Shipments)'}
                </span>
                {isSplitDelivery && <Check className="h-4 w-4 text-primary shrink-0" />}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {isBn
                  ? 'স্টকের পণ্য আগে (২৪ ঘণ্টায়) এবং প্রি-অর্ডার পণ্যগুলো পরে ডেলিভারি হবে।'
                  : 'In-stock sent immediately (24h), Pre-order items sent when ready.'}
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Main Delivery Selection Grid */}
      {isSplitDelivery ? (
        <div className="space-y-4">
          {/* Shipment 1 Selector */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                {isBn ? '১ম চালান: ইনস্ট্যান্ট স্টকে থাকা পণ্য (২৪ ঘণ্টায় ডেলিভারি)' : 'Shipment 1: In-Stock Items (24h Delivery)'}
              </span>
            </div>
            {renderDeliveryGrid(
              shipment1SelectedId || selectedId,
              onSelectShipment1 || onSelect
            )}
          </div>

          {/* Shipment 2 Selector */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                {isBn ? '২য় চালান: প্রি-অর্ডারের পণ্য (৩-৫ দিনে ডেলিভারি)' : 'Shipment 2: Pre-Order Items (3-5 Days Delivery)'}
              </span>
            </div>
            {renderDeliveryGrid(
              shipment2SelectedId || selectedId,
              onSelectShipment2 || onSelect
            )}
          </div>
        </div>
      ) : (
        renderDeliveryGrid(selectedId, onSelect)
      )}
    </div>
  );
}
