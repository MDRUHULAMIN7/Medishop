'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  Clock,
  HelpCircle,
} from 'lucide-react';
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
    <div className="rounded-2xl border border-border bg-background p-5 shadow-xs sticky top-24">
      <h3 className="text-base font-bold text-foreground font-serif-title pb-3 border-b border-border flex items-center justify-between">
        <span>{isBn ? 'অর্ডার সামারি' : 'Order Summary'}</span>
        <span className="text-xs font-normal text-muted-foreground">
          ({summary.totalQuantity} {isBn ? 'টি আইটেম' : 'items'})
        </span>
      </h3>

      {/* Total Savings Highlight Banner */}
      {summary.totalSavings > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2.5 text-white shadow-xs">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 shrink-0" />
            <span className="text-xs font-bold">
              {isBn ? 'আপনার মোট সাশ্রয়' : 'Total Savings'}
            </span>
          </div>
          <span className="text-sm font-extrabold">
            {formatPrice(summary.totalSavings, isBn ? 'bn' : 'en')}
          </span>
        </div>
      )}

      {/* Price Details */}
      <div className="mt-4 space-y-3 text-xs sm:text-sm">
        {/* MRP Total / Original Price */}
        {summary.mrpDiscount > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>{isBn ? 'মূল্য (MRP মোট)' : 'Original MRP Total'}</span>
            <span className="line-through">
              {formatPrice(summary.mrpTotal, isBn ? 'bn' : 'en')}
            </span>
          </div>
        )}

        {/* Subtotal */}
        <div className="flex justify-between text-muted-foreground">
          <span>{isBn ? 'পণ্যমূল্য (সাবটোটাল)' : 'Item Subtotal'}</span>
          <span className="font-semibold text-foreground">
            {formatPrice(summary.subtotal, isBn ? 'bn' : 'en')}
          </span>
        </div>

        {/* Product MRP Discount */}
        {summary.mrpDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>{isBn ? 'প্রোডাক্ট ছাড়' : 'Product MRP Discount'}</span>
            <span>-{formatPrice(summary.mrpDiscount, isBn ? 'bn' : 'en')}</span>
          </div>
        )}

        {/* Coupon Discount */}
        {summary.couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>{isBn ? 'কুপন ছাড়' : 'Coupon Discount'}</span>
            <span>-{formatPrice(summary.couponDiscount, isBn ? 'bn' : 'en')}</span>
          </div>
        )}

        {/* Delivery Charge */}
        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-muted-foreground" />
            {isBn ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}
          </span>
          <span>
            {summary.deliveryCharge === 0 ? (
              <span className="font-bold text-emerald-600">
                {isBn ? 'ফ্রি' : 'FREE'}
              </span>
            ) : (
              formatPrice(summary.deliveryCharge, isBn ? 'bn' : 'en')
            )}
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <div>
            <span className="text-base font-extrabold text-foreground">
              {isBn ? 'সর্বমোট প্রদেয়' : 'Grand Total'}
            </span>
            <p className="text-[10px] text-muted-foreground">
              {isBn ? '(সকল ট্যাক্স অন্তর্ভুক্ত)' : '(Inclusive of all taxes)'}
            </p>
          </div>
          <span className="text-xl font-black text-primary">
            {formatPrice(summary.grandTotal, isBn ? 'bn' : 'en')}
          </span>
        </div>
      </div>

      {/* Estimated Delivery Time */}
      <div className="mt-5 rounded-xl bg-muted/40 p-3 border border-border flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">
            {isBn ? 'আনুমানিক ডেলিভারি সময়' : 'Estimated Delivery Time'}
          </p>
          <p className="text-xs font-bold text-foreground">
            {isBn ? 'ঢাকায় ২-৪ ঘণ্টার মধ্যে এক্সপ্রেস ডেলিভারি' : '2-4 Hours Express Delivery in Dhaka'}
          </p>
        </div>
      </div>

      {/* Proceed to Checkout CTA */}
      <button
        type="button"
        onClick={handleCheckoutClick}
        disabled={items.length === 0}
        className="mt-5 w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 text-sm font-extrabold text-white shadow-md hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <span>{isBn ? 'অর্ডার সম্পন্ন করুন' : 'Proceed to Checkout'}</span>
        <ArrowRight className="h-4 w-4" />
      </button>

      {/* Trust Badges */}
      <div className="mt-4 pt-3 border-t border-border space-y-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{isBn ? '১০০% আসল ওষুধ এবং ক্যাশ অন ডেলিভারি' : '100% Authentic Products & Cash on Delivery'}</span>
        </div>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-sky-600 shrink-0" />
          <span>{isBn ? '২৪/৭ হেল্পলাইন: ১৬৭৮০' : '24/7 Helpline Support: 16780'}</span>
        </div>
      </div>
    </div>
  );
}

export const CartSummary = OrderSummary;
