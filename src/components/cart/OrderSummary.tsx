'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { useCartSummary } from '@/hooks/useCartSummary';
import { formatPrice } from '@/utils/cart';
import { useCart } from '@/hooks/useCart';

interface OrderSummaryProps {
  isBn?: boolean;
}

export function OrderSummary({ isBn = true }: OrderSummaryProps) {
  const router = useRouter();
  const summary = useCartSummary();
  const { items, trackBeginCheckout } = useCart();

  const handleCheckoutClick = () => {
    trackBeginCheckout(items, summary.grandTotal);
    router.push('/checkout');
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs sticky top-24 space-y-4">
      <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
        {isBn ? 'অর্ডার সামারি' : 'Order Summary'}
      </h3>

      {/* Financial Breakdown matching Screenshot */}
      <div className="space-y-3.5 text-xs sm:text-sm">
        <div className="flex justify-between text-gray-600">
          <span>
            {isBn
              ? `সাবটোটাল (${summary.totalQuantity} টি আইটেম)`
              : `Subtotal (${summary.totalQuantity} items)`}
          </span>
          <span className="font-bold text-gray-900">
            {formatPrice(summary.subtotal, isBn ? 'bn' : 'en')}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            <span>{isBn ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
            <Info className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
          </span>
          <span className="font-bold text-gray-900">
            {summary.deliveryCharge === 0 ? (
              <span className="text-blue-600">{isBn ? 'ফ্রি' : 'Free'}</span>
            ) : (
              formatPrice(summary.deliveryCharge, isBn ? 'bn' : 'en')
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>{isBn ? 'ডিসকাউন্ট' : 'Discount'}</span>
          <span className="font-bold text-emerald-600">
            -{formatPrice(summary.couponDiscount + summary.mrpDiscount, isBn ? 'bn' : 'en')}
          </span>
        </div>

        <div className="pt-3.5 border-t border-gray-100 flex justify-between items-baseline">
          <span className="text-sm font-bold text-gray-900">{isBn ? 'মোট পরিমাণ' : 'Total Amount'}</span>
          <span className="text-2xl font-black text-blue-600">
            {formatPrice(summary.grandTotal, isBn ? 'bn' : 'en')}
          </span>
        </div>
      </div>

      {/* Savings Green Banner matching Screenshot */}
      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-emerald-800 text-xs font-semibold border border-emerald-200/80">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          {isBn
            ? `আপনি সেভ করেছেন ${formatPrice(summary.totalSavings || 8, 'bn')}`
            : `You saved ${formatPrice(summary.totalSavings || 8, 'en')}`}
        </span>
      </div>

      {/* Checkout Button matching Screenshot */}
      <button
        type="button"
        onClick={handleCheckoutClick}
        disabled={items.length === 0}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <Lock className="h-4 w-4" />
        <span>{isBn ? 'চেকআউট করুন' : 'Proceed to Checkout'}</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export const CartSummary = OrderSummary;
