'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pill, Edit2 } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/utils/cart';

interface OrderReviewProps {
  items: CartItem[];
  isBn?: boolean;
}

export function OrderReview({ items, isBn = true }: OrderReviewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          {isBn ? 'অর্ডারের পণ্যসমূহ পর্যালোচনা করুন' : 'Review Order Items'}
        </h3>

        <Link
          href="/cart"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>{isBn ? 'কার্ট পরিবর্তন' : 'Edit Cart'}</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-background divide-y divide-border overflow-hidden">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between p-3.5 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted/20 border border-border p-1">
                <Image
                  src={item.image}
                  alt={isBn ? item.nameBn : item.nameEn}
                  fill
                  className="object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-foreground truncate">
                    {isBn ? item.nameBn : item.nameEn}
                  </h4>
                  {item.prescriptionRequired && (
                    <span className="rounded bg-amber-100 p-0.5 text-[9px] text-amber-800 font-bold">
                      <Pill className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {formatPrice(item.sellingPrice, isBn ? 'bn' : 'en')} × {item.quantity} ({item.unit})
                </p>
              </div>
            </div>

            <span className="text-xs font-extrabold text-foreground shrink-0">
              {formatPrice(item.sellingPrice * item.quantity, isBn ? 'bn' : 'en')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
