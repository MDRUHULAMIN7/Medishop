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
    isSplitDelivery,
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
        <div className="h-8 w-48 mx-auto rounded-xl bg-gray-100 animate-pulse mb-4" />
        <div className="h-64 max-w-xl mx-auto rounded-3xl bg-gray-50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumbs matching Screenshot */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-2 text-xs font-medium text-gray-500"
        >
          <Link href="/" className="hover:text-blue-600 transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <Link href="/cart" className="hover:text-blue-600 transition-colors">
            {isBn ? 'কার্ট' : 'Cart'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="font-bold text-gray-900">
            {isBn ? 'চেকআউট' : 'Checkout'}
          </span>
        </nav>

        {/* Secure Checkout Header Banner matching Screenshot */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                {isBn ? 'সিকিউর চেকআউট' : 'Secure Checkout'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                {isBn
                  ? 'কয়েকটি সহজ ধাপে আপনার অর্ডার সম্পন্ন করুন'
                  : 'Complete your order in a few simple steps'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{isBn ? '১০০% এনক্রিপ্টেড পেমেন্ট' : '100% Secure & Encrypted'}</span>
          </div>
        </div>

        {/* Two Column Layout matching Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Checkout Form (Address, Delivery, Payment, Trust Badges) */}
          <div className="lg:col-span-8">
            <CheckoutForm isBn={isBn} />
          </div>

          {/* Right Column (4 cols): Sticky Checkout Summary, Order Items & Need Help */}
          <div className="lg:col-span-4">
            <CheckoutSummary
              summary={summary}
              items={items}
              selectedAddress={selectedAddress}
              deliveryMethod={deliveryMethod}
              paymentMethod={paymentMethod}
              isSubmitting={isSubmitting}
              onPlaceOrder={placeOrder}
              isSplitDelivery={isSplitDelivery}
              isBn={isBn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
