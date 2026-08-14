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
  const unitPrice = Number(
    (item as any).effectiveUnitPrice ??
      (item as any).unitPrice ??
      (item as any).sellingPrice ??
      (item as any).price ??
      0
  );
  const qty = Number(item.quantity || 1);
  const totalPrice = Number((item as any).totalPrice ?? unitPrice * qty);
  const unitLabel = (item as any).unitType || item.unit || '';

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted/20 border border-border p-1">
          {item.image ? (
            <Image
              src={item.image}
              alt={isBn ? item.nameBn || item.name : item.nameEn || item.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[9px] font-bold text-muted-foreground bg-muted">
              MED
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-foreground truncate">
              {isBn ? item.nameBn || item.name : item.nameEn || item.name}
            </h4>
            {item.prescriptionRequired && (
              <span className="rounded bg-amber-100 p-0.5 text-[9px] text-amber-800 font-bold">
                <Pill className="h-2.5 w-2.5" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground font-medium">
            {item.brand || 'MediShop'} • {formatPrice(unitPrice, isBn ? 'bn' : 'en')} × {qty}
            {unitLabel ? ` (${unitLabel})` : ''}
          </p>
        </div>
      </div>

      <span className="text-xs font-black text-foreground shrink-0">
        {formatPrice(totalPrice, isBn ? 'bn' : 'en')}
      </span>
    </div>
  );
}
