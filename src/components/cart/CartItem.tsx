'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Heart, Pill, CheckCircle2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/types/cart';
import { QuantitySelector } from './QuantitySelector';
import { formatPrice } from '@/utils/cart';
import { toast } from 'sonner';

interface CartItemProps {
  item: CartItemType;
  isSelected?: boolean;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveRequest: (item: CartItemType) => void;
  isBn?: boolean;
}

export function CartItem({
  item,
  isSelected = true,
  onUpdateQuantity,
  onRemoveRequest,
  isBn = true,
}: CartItemProps) {
  const itemTotal = item.sellingPrice * item.quantity;

  const handleWishlist = () => {
    toast.success(
      isBn
        ? `"${item.nameBn || item.nameEn}" উইশলিস্টে যুক্ত করা হয়েছে!`
        : `"${item.nameEn}" added to Wishlist!`
    );
  };

  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Column (5 cols): Checkbox + Image + Details */}
        <div className="md:col-span-5 flex items-center gap-3.5">
          <input
            type="checkbox"
            checked={isSelected}
            readOnly
            className="h-4 w-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
          />

          {/* Product Image Container */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white border border-gray-200 p-2 shadow-2xs">
            <Image
              src={item.image}
              alt={isBn ? item.nameBn || item.nameEn : item.nameEn}
              fill
              className="object-contain"
            />
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
              {item.brand || 'BEXIMCO'}
            </span>

            <h3 className="text-sm font-bold text-gray-900 truncate">
              {isBn ? item.nameBn || item.nameEn : item.nameEn}
            </h3>

            <p className="text-xs text-gray-500 mt-0.5">
              {item.unit || (item as any).dosageForm || '30 Capsules'}
            </p>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 mt-1 border border-emerald-200">
              <CheckCircle2 className="h-3 w-3" />
              <span>{isBn ? 'স্টকে আছে' : 'In Stock'}</span>
            </span>
          </div>
        </div>

        {/* Price Column (2 cols) */}
        <div className="md:col-span-2 text-left md:text-center">
          <span className="text-xs text-gray-400 font-medium md:hidden">{isBn ? 'মূল্য: ' : 'Price: '}</span>
          <span className="text-sm font-bold text-gray-900">
            {formatPrice(item.sellingPrice, isBn ? 'bn' : 'en')}
          </span>
        </div>

        {/* Quantity Selector Column (3 cols) */}
        <div className="md:col-span-3 flex items-center justify-start md:justify-center gap-2">
          <QuantitySelector
            quantity={item.quantity}
            stock={item.stock !== undefined ? item.stock : 999}
            size="md"
            isBn={isBn}
            onIncrease={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            onDecrease={() => onUpdateQuantity(item.productId, item.quantity - 1)}
          />
        </div>

        {/* Subtotal & Actions Column (2 cols) */}
        <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
          <div className="text-right">
            <span className="text-xs text-gray-400 font-medium md:hidden">{isBn ? 'সাবটোটাল: ' : 'Subtotal: '}</span>
            <span className="text-sm font-extrabold text-gray-900">
              {formatPrice(itemTotal, isBn ? 'bn' : 'en')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            <button
              type="button"
              onClick={handleWishlist}
              title={isBn ? 'উইশলিস্টে যোগ করুন' : 'Add to Wishlist'}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Heart className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => onRemoveRequest(item)}
              title={isBn ? 'কার্ট থেকে সরান' : 'Remove from cart'}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
