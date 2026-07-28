'use client';

import React from 'react';
import Image from 'next/image';
import { Pill } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/utils/cart';

interface OrderItemProps {
  item: CartItem;
  isBn?: boolean;
}

export function OrderItem({ item, isBn = true }: OrderItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
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
            {item.brand} • {formatPrice(item.sellingPrice, isBn ? 'bn' : 'en')} × {item.quantity} ({item.unit})
          </p>
        </div>
      </div>

      <span className="text-xs font-extrabold text-foreground shrink-0">
        {formatPrice(item.sellingPrice * item.quantity, isBn ? 'bn' : 'en')}
      </span>
    </div>
  );
}
