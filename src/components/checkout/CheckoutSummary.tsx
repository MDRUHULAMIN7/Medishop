'use client';

import React from 'react';
import { ArrowRight, ShieldCheck, Tag, Truck, Loader2 } from 'lucide-react';
import { CartSummary } from '@/types/cart';
import { DeliveryMethod, PaymentMethod } from '@/types/checkout';
import { ShippingAddress } from '@/types/address';
import { formatPrice } from '@/utils/cart';

interface CheckoutSummaryProps {
  summary: CartSummary;
  selectedAddress: ShippingAddress | null;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
  isBn?: boolean;
}

export function CheckoutSummary({
  summary,
  selectedAddress,
  deliveryMethod,
  paymentMethod,
  isSubmitting,
  onPlaceOrder,
  isBn = true,
}: CheckoutSummaryProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-xs sticky top-24 space-y-4">
      <h3 className="text-base font-bold text-foreground font-serif-title pb-3 border-b border-border">
        {isBn ? 'অর্ডার সামারি' : 'Checkout Summary'}
      </h3>

      {/* Selected Details Snippet */}
      <div className="space-y-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border">
        <div>
          <span className="font-bold text-foreground">{isBn ? 'ডেলিভারি ঠিকানা:' : 'Shipping Address:'}</span>{' '}
          {selectedAddress ? (
            <span>
              {selectedAddress.fullName} ({selectedAddress.area}, {selectedAddress.district})
            </span>
          ) : (
            <span className="text-red-500 font-semibold">{isBn ? 'নির্বাচন করা হয়নি' : 'Not selected'}</span>
          )}
        </div>

        <div>
          <span className="font-bold text-foreground">{isBn ? 'ডেলিভারি মেথড:' : 'Delivery Method:'}</span>{' '}
          <span>{isBn ? deliveryMethod.nameBn : deliveryMethod.nameEn}</span>
        </div>

        <div>
          <span className="font-bold text-foreground">{isBn ? 'পেমেন্ট মেথড:' : 'Payment Method:'}</span>{' '}
          <span>{isBn ? paymentMethod.nameBn : paymentMethod.nameEn}</span>
        </div>
      </div>

      {/* Savings Highlight */}
      {summary.totalSavings > 0 && (
        <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-white shadow-xs text-xs">
          <span className="flex items-center gap-1.5 font-bold">
            <Tag className="h-3.5 w-3.5" />
            {isBn ? 'মোট সাশ্রয়' : 'Total Savings'}
          </span>
          <span className="font-extrabold">{formatPrice(summary.totalSavings, isBn ? 'bn' : 'en')}</span>
        </div>
      )}

      {/* Financial Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>{isBn ? 'পণ্যমূল্য (সাবটোটাল)' : 'Item Subtotal'}</span>
          <span className="font-semibold text-foreground">
            {formatPrice(summary.subtotal, isBn ? 'bn' : 'en')}
          </span>
        </div>

        {summary.mrpDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>{isBn ? 'প্রোডাক্ট ছাড়' : 'MRP Discount'}</span>
            <span>-{formatPrice(summary.mrpDiscount, isBn ? 'bn' : 'en')}</span>
          </div>
        )}

        {summary.couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>{isBn ? 'কুপন ছাড়' : 'Coupon Discount'}</span>
            <span>-{formatPrice(summary.couponDiscount, isBn ? 'bn' : 'en')}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" />
            {isBn ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}
          </span>
          <span>
            {summary.deliveryCharge === 0 ? (
              <span className="font-bold text-emerald-600">{isBn ? 'ফ্রি' : 'FREE'}</span>
            ) : (
              formatPrice(summary.deliveryCharge, isBn ? 'bn' : 'en')
            )}
          </span>
        </div>

        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <span className="text-sm font-extrabold text-foreground">{isBn ? 'সর্বমোট প্রদেয়' : 'Grand Total'}</span>
          <span className="text-lg font-black text-primary">
            {formatPrice(summary.grandTotal, isBn ? 'bn' : 'en')}
          </span>
        </div>
      </div>

      {/* Place Order CTA */}
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isSubmitting || !selectedAddress}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-sm font-extrabold text-white shadow-md hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{isBn ? 'অর্ডার প্রক্রিয়াজাত হচ্ছে...' : 'Processing Order...'}</span>
          </>
        ) : (
          <>
            <span>{isBn ? 'অর্ডার নিশ্চিত করুন' : 'Place Order'}</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground pt-1">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>{isBn ? 'ডিজিডিএ লাইসেন্সপ্রাপ্ত আসল ওষুধের নিশ্চয়তা' : 'DGDA Certified Authentic Pharmacy'}</span>
      </div>
    </div>
  );
}
