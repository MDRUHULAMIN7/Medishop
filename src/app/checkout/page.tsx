'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ShieldCheck, Lock } from 'lucide-react';
import { useCheckout } from '@/hooks/useCheckout';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { CheckoutSummary } from '@/components/checkout/CheckoutSummary';
import { useAppSelector } from '@/store';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    selectedAddress,
    deliveryMethod,
    paymentMethod,
    summary,
    isSubmitting,
    placeOrder,
    isBn,
  } = useCheckout();

  const isCartHydrated = useAppSelector((state) => state.cart.isHydrated);

  // Redirect to cart if cart is empty after hydration
  useEffect(() => {
    if (isCartHydrated && items.length === 0) {
      router.push('/cart');
    }
  }, [isCartHydrated, items.length, router]);

  if (!isCartHydrated || items.length === 0) {
    return (
      <div className="mx-auto max-w-[1700px] px-4 py-16 text-center">
        <div className="h-8 w-48 mx-auto rounded-xl bg-muted animate-pulse mb-4" />
        <div className="h-64 max-w-xl mx-auto rounded-3xl bg-muted/40 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <Link href="/cart" className="hover:text-primary transition-colors">
            {isBn ? 'কার্ট' : 'Cart'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-bold text-foreground">
            {isBn ? 'চেকআউট' : 'Checkout'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-background p-4 sm:p-6 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                {isBn ? 'নিরাপদ চেকআউট' : 'Secure Checkout'}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBn
                  ? 'আপনার ডেলিভারি ও পেমেন্ট বিবরণ সম্পন্ন করে অর্ডার প্লেস করুন'
                  : 'Complete your delivery and payment details to finalize order.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="h-4 w-4" />
            <span>{isBn ? '২৫৬-বিট এনক্রিপ্টেড পেমেন্ট' : '256-Bit SSL Encrypted'}</span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Checkout Form (Address, Delivery, Payment, Review) */}
          <div className="lg:col-span-7 xl:col-span-8">
            <CheckoutForm isBn={isBn} />
          </div>

          {/* Right Column (4 cols): Sticky Checkout Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <CheckoutSummary
              summary={summary}
              selectedAddress={selectedAddress}
              deliveryMethod={deliveryMethod}
              paymentMethod={paymentMethod}
              isSubmitting={isSubmitting}
              onPlaceOrder={placeOrder}
              isBn={isBn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
