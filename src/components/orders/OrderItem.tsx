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
  const unitLabel = item.unit || (item as any).unitType || '';
  const preOrderQty = Number((item as any).preOrderQuantity || 0);
  const availQty = Number(
    (item as any).availableQuantity ??
      ((item as any).stock !== undefined ? Math.min((item as any).stock, qty) : qty)
  );
  const isMixed = (item as any).fulfillmentType === 'mixed';

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted/20 border border-border p-1">
          {item.image ? (
            <Image
              src={item.image}
              alt={isBn ? item.nameBn || (item as any).name : item.nameEn || (item as any).name}
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
              {isBn ? item.nameBn || (item as any).name : item.nameEn || (item as any).name}
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
          {(preOrderQty > 0 || isMixed) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {availQty > 0 && (
                <span className="rounded bg-emerald-50 px-1.5 py-0.2 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                  {isBn ? `স্টক: ${availQty}` : `In-Stock: ${availQty}`}
                </span>
              )}
              {preOrderQty > 0 && (
                <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary border border-primary/20">
                  {isBn ? `প্রি-অর্ডার: +${preOrderQty}` : `Pre-Order: +${preOrderQty}`}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <span className="text-xs font-black text-foreground shrink-0">
        {formatPrice(totalPrice, isBn ? 'bn' : 'en')}
      </span>
    </div>
  );
}
