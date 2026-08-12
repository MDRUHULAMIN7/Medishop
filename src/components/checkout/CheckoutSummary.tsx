'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Lock, Loader2, ShoppingCart, Phone, MessageSquare } from 'lucide-react';
import { CartSummary, CartItem } from '@/types/cart';
import { DeliveryMethod, PaymentMethod } from '@/types/checkout';
import { ShippingAddress } from '@/types/address';
import { formatPrice } from '@/utils/cart';
import { CouponBox } from '../cart/CouponBox';

interface CheckoutSummaryProps {
  summary: CartSummary;
  items: CartItem[];
  selectedAddress: ShippingAddress | null;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
  isBn?: boolean;
}

export function CheckoutSummary({
  summary,
  items,
  selectedAddress,
  deliveryMethod,
  paymentMethod,
  isSubmitting,
  onPlaceOrder,
  isBn = true,
}: CheckoutSummaryProps) {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="space-y-5 sticky top-24">
      {/* Card 1: Order Summary matching Screenshot */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
          {isBn ? 'অর্ডার সামারি' : 'Order Summary'}
        </h3>

        {/* Apply Coupon Section */}
        <CouponBox isBn={isBn} />

        {/* Summary Rows matching Screenshot */}
        <div className="space-y-2.5 pt-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>
              {isBn ? `সাবটোটাল (${itemCount}টি পণ্য)` : `Subtotal (${itemCount} items)`}
            </span>
            <span className="font-bold text-gray-900">
              {formatPrice(summary.subtotal, isBn ? 'bn' : 'en')}
            </span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>{isBn ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
            <span className="font-bold text-gray-900">
              {summary.deliveryCharge === 0 ? (
                <span className="text-blue-600">{isBn ? 'ফ্রি' : 'Free'}</span>
              ) : (
                formatPrice(summary.deliveryCharge, isBn ? 'bn' : 'en')
              )}
            </span>
          </div>

          {(summary.couponDiscount > 0 || summary.mrpDiscount > 0) && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>{isBn ? 'ডিসকাউন্ট' : 'Discount'}</span>
              <span className="font-bold">
                -{formatPrice(summary.couponDiscount + summary.mrpDiscount, isBn ? 'bn' : 'en')}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
            <span className="text-base font-bold text-gray-900">{isBn ? 'সর্বমোট মূল্য' : 'Total Amount'}</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(summary.grandTotal, isBn ? 'bn' : 'en')}
            </span>
          </div>
        </div>

        {/* Savings Green Subtitle matching Screenshot */}
        {summary.totalSavings > 0 && (
          <p className="text-xs font-semibold text-emerald-600 text-center">
            {isBn
              ? `এই অর্ডারে আপনি সাশ্রয় করছেন ${formatPrice(summary.totalSavings, 'bn')}`
              : `You will save ${formatPrice(summary.totalSavings, 'en')} on this order`}
          </p>
        )}

        {/* CTA Place Order Button matching Screenshot */}
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting || !selectedAddress}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 px-4 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isBn ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...'}</span>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              <span>{isBn ? 'অর্ডার নিশ্চিত করুন' : 'Place Order'}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center">
          {isBn
            ? 'অর্ডার নিশ্চিত না হওয়া পর্যন্ত কোনো চার্জ কাটা হবে না'
            : "You won't be charged until your order is confirmed"}
        </p>
      </div>

      {/* Card 2: Order Items (3) matching Screenshot */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
        <h4 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
          {isBn ? `অর্ডারকৃত পণ্যসমূহ (${items.length})` : `Order Items (${items.length})`}
        </h4>

        <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200 p-0.5">
                  <img
                    src={item.image || '/images/placeholder.png'}
                    alt={item.nameEn}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {isBn ? item.nameBn || item.nameEn : item.nameEn}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {item.unit || 'Tablet'} • Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <span className="font-bold text-gray-900 shrink-0">
                {formatPrice(item.sellingPrice * item.quantity, isBn ? 'bn' : 'en')}
              </span>
            </div>
          ))}
        </div>

        <Link
          href="/cart"
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-blue-600 hover:bg-gray-50 transition-colors"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{isBn ? 'কার্ট পরিবর্তন করুন' : 'View & Edit Cart'}</span>
        </Link>
      </div>

      {/* Card 3: Need Help? matching Screenshot */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs space-y-3">
        <div>
          <h4 className="text-sm font-bold text-gray-900">{isBn ? 'সহায়তা প্রয়োজন?' : 'Need Help?'}</h4>
          <p className="text-xs text-gray-400">
            {isBn ? 'আমাদের টিম আপনাকে সাহায্য করতে প্রস্তুত' : 'Our support team is here to help you'}
          </p>
        </div>

        <div className="space-y-2">
          <a
            href="tel:8801742643763"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-xs font-bold text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span>+880 1742-643763</span>
          </a>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span>{isBn ? 'লাইভ চ্যাট সাপোর্ট' : 'Live Chat Support'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
