'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Pill } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { QuantitySelector } from './QuantitySelector';
import { formatPrice } from '@/utils/cart';

interface CartDrawerItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveRequest: (item: CartItem) => void;
  isBn?: boolean;
}

export function CartDrawerItem({
  item,
  onUpdateQuantity,
  onRemoveRequest,
  isBn = true,
}: CartDrawerItemProps) {
  const hasDiscount = item.mrp > item.sellingPrice;
  const itemTotal = item.sellingPrice * item.quantity;

  return (
    <div className="flex gap-3 py-3.5 border-b border-border last:border-0 bg-background">
      {/* Product Image */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted/20 border border-border p-1">
        <Image
          src={item.image}
          alt={isBn ? item.nameBn : item.nameEn}
          fill
          className="object-contain"
        />
        {item.prescriptionRequired && (
          <div
            className="absolute left-1 top-1 rounded-md bg-primary p-0.5 text-[9px] font-bold text-white shadow-xs"
            title={isBn ? 'প্রেসক্রিপশন প্রয়োজন' : 'Rx Required'}
          >
            <Pill className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground truncate">
                {item.brand}
              </p>
              <h4 className="text-xs font-semibold text-foreground line-clamp-1">
                {isBn ? item.nameBn : item.nameEn}
              </h4>
            </div>

            {/* Trash button */}
            <button
              type="button"
              onClick={() => onRemoveRequest(item)}
              className="text-muted-foreground hover:text-red-600 transition-colors p-1 rounded-md hover:bg-muted"
              aria-label={isBn ? 'মুছে ফেলুন' : 'Remove item'}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Unit & Price */}
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-primary">
              {formatPrice(item.sellingPrice, isBn ? 'bn' : 'en')}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-muted-foreground line-through">
                {formatPrice(item.mrp, isBn ? 'bn' : 'en')}
              </span>
            )}
            <span className="text-[10px] text-muted-foreground">/ {item.unit}</span>
            {Boolean(item.preOrderQuantity && item.preOrderQuantity > 0) && (
              <span className="rounded-md bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[9px] font-black text-primary">
                {isBn ? `Pre-Order: +${item.preOrderQuantity}` : `Pre-Order: +${item.preOrderQuantity}`}
              </span>
            )}
          </div>
        </div>

        {/* Quantity manager & Item Total */}
        <div className="mt-2.5 flex items-center justify-between">
          <QuantitySelector
            quantity={item.quantity}
            stock={item.stock}
            size="sm"
            isBn={isBn}
            onIncrease={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          />

          <span className="text-xs font-extrabold text-foreground">
            {formatPrice(itemTotal, isBn ? 'bn' : 'en')}
          </span>
        </div>
      </div>
    </div>
  );
}
