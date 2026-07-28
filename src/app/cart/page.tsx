'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartList } from '@/components/cart/CartList';
import { FreeDeliveryProgress } from '@/components/cart/FreeDeliveryProgress';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { CouponBox } from '@/components/cart/CouponBox';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { CartSkeleton } from '@/components/cart/CartSkeleton';
import { useAppSelector } from '@/store';
import { formatNumber } from '@/utils/cart';

export default function CartPage() {
  const {
    items,
    isHydrated,
    updateQuantity,
    removeFromCart,
    clearCart,
    summary,
  } = useCart();

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-[1700px] px-4 sm:px-6 lg:px-8 py-8">
        <CartSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      {/* Container */}
      <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-bold text-foreground">
            {isBn ? 'শপিং কার্ট' : 'Shopping Cart'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-background p-4 sm:p-6 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                  {isBn ? 'আপনার শপিং কার্ট' : 'Shopping Cart'}
                </h1>
                {items.length > 0 && (
                  <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-extrabold text-primary">
                    {formatNumber(items.length, isBn ? 'bn' : 'en')}{' '}
                    {isBn ? 'টি আইটেম' : 'items'}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBn
                  ? 'আপনার নির্বাচিত ওষুধ ও হেলথকেয়ার প্রোডাক্টসমূহ অর্ডার করার প্রস্তুত'
                  : 'Review your selected authentic medicines and health items before checkout.'}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-muted-foreground shadow-xs hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isBn ? 'কার্ট খালি করুন' : 'Clear Cart'}</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        {items.length === 0 ? (
          <EmptyCart isBn={isBn} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (8 cols): Free Delivery Bar & Cart Items */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              {/* Free Delivery Progress Banner */}
              <FreeDeliveryProgress subtotal={summary.subtotal} isBn={isBn} />

              {/* Cart Items Animated List */}
              <CartList
                items={items}
                isBn={isBn}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
              />
            </div>

            {/* Right Column (4 cols): Coupon & Order Summary Sticky */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-5">
              <CouponBox isBn={isBn} />
              <OrderSummary isBn={isBn} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
