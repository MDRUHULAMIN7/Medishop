'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Heart, Pill, Tag } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { QuantitySelector } from './QuantitySelector';
import { formatPrice } from '@/utils/cart';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveRequest: (item: CartItemType) => void;
  isBn?: boolean;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemoveRequest,
  isBn = true,
}: CartItemProps) {
  const hasDiscount = item.mrp > item.sellingPrice;
  const discountPercent = hasDiscount
    ? Math.round(((item.mrp - item.sellingPrice) / item.mrp) * 100)
    : 0;
  const itemTotal = item.sellingPrice * item.quantity;

  const handleWishlist = () => {
    toast.success(
      isBn
        ? `"${item.nameBn}" উইশলিস্টে যুক্ত করা হয়েছে!`
        : `"${item.nameEn}" added to Wishlist!`
    );
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-background rounded-2xl border border-border shadow-xs hover:border-primary/30 transition-all">
      {/* Product Details Section */}
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
        {/* Image */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted/20 border border-border p-1.5 shadow-xs">
          <Image
            src={item.image}
            alt={isBn ? item.nameBn : item.nameEn}
            fill
            className="object-contain"
          />
          {item.prescriptionRequired && (
            <div
              className="absolute left-1 top-1 rounded-md bg-amber-500 p-1 text-[9px] font-bold text-white shadow-xs"
              title={isBn ? 'প্রেসক্রিপশন প্রয়োজন' : 'Rx Required'}
            >
              <Pill className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-muted-foreground">
              {item.brand}
            </span>
            {item.prescriptionRequired && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                <Pill className="h-3 w-3" />
                {isBn ? 'প্রেসক্রিপশন লাগবে' : 'Rx Required'}
              </span>
            )}
            {hasDiscount && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                <Tag className="h-3 w-3" />
                {discountPercent}% {isBn ? 'ছাড়' : 'OFF'}
              </span>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-2">
            {isBn ? item.nameBn : item.nameEn}
          </h3>

          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn ? 'প্যাক সাইজ:' : 'Unit:'} {item.unit}
          </p>

          {/* Mobile Pricing view */}
          <div className="mt-2 flex items-baseline gap-2 sm:hidden">
            <span className="text-sm font-extrabold text-primary">
              {formatPrice(item.sellingPrice, isBn ? 'bn' : 'en')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(item.mrp, isBn ? 'bn' : 'en')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Price, Quantity & Subtotal */}
      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
        {/* Desktop Unit Price */}
        <div className="hidden sm:block text-right">
          <p className="text-xs text-muted-foreground font-medium">
            {isBn ? 'একক মূল্য' : 'Unit Price'}
          </p>
          <div className="flex items-baseline justify-end gap-1.5 mt-0.5">
            <span className="text-sm font-bold text-foreground">
              {formatPrice(item.sellingPrice, isBn ? 'bn' : 'en')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(item.mrp, isBn ? 'bn' : 'en')}
              </span>
            )}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex flex-col items-start sm:items-center gap-1">
          <span className="text-[11px] text-muted-foreground font-medium sm:hidden">
            {isBn ? 'পরিমাণ' : 'Quantity'}
          </span>
          <QuantitySelector
            quantity={item.quantity}
            stock={item.stock}
            size="md"
            isBn={isBn}
            onIncrease={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          />
        </div>

        {/* Subtotal & Actions */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground font-medium">
              {isBn ? 'মোট' : 'Subtotal'}
            </p>
            <p className="text-base font-extrabold text-primary">
              {formatPrice(itemTotal, isBn ? 'bn' : 'en')}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {/* Wishlist placeholder */}
            <button
              type="button"
              onClick={handleWishlist}
              title={isBn ? 'উইশলিস্টে যোগ করুন' : 'Add to Wishlist'}
              className="p-2 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <Heart className="h-4 w-4" />
            </button>

            {/* Trash button */}
            <button
              type="button"
              onClick={() => onRemoveRequest(item)}
              title={isBn ? 'কার্ট থেকে সরান' : 'Remove from cart'}
              className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
