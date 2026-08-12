'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ShoppingBag,
  Trash2,
  Heart,
  ShieldCheck,
  Truck,
  Lock,
  Headset,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartList } from '@/components/cart/CartList';
import { FreeDeliveryProgress } from '@/components/cart/FreeDeliveryProgress';
import { OrderSummary } from '@/components/cart/OrderSummary';
import { CouponBox } from '@/components/cart/CouponBox';
import { EmptyCart } from '@/components/cart/EmptyCart';
import { CartSkeleton } from '@/components/cart/CartSkeleton';
import { RecommendedProducts } from '@/components/cart/RecommendedProducts';
import { useAppSelector } from '@/store';
import { formatNumber } from '@/utils/cart';
import { toast } from 'sonner';

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

  const handleWishlistClick = () => {
    toast.info(isBn ? 'আপনার পছন্দের সব পণ্য উইশলিস্টে পাবেন' : 'Wishlist items updated');
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-8">
        <CartSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Container */}
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-2 text-xs font-medium text-gray-500"
        >
          <Link href="/" className="hover:text-blue-600 transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
          <span className="font-bold text-gray-900">
            {isBn ? 'শপিং কার্ট' : 'Shopping Cart'}
          </span>
        </nav>

        {/* Page Header matching Screenshot */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  {isBn ? 'আপনার শপিং কার্ট' : 'Shopping Cart'}
                </h1>
                {items.length > 0 && (
                  <span className="text-xs font-medium text-gray-500">
                    ({formatNumber(items.length, isBn ? 'bn' : 'en')} {isBn ? 'টি আইটেম' : 'items'})
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isBn
                  ? 'অরিজিনাল প্রোডাক্ট, সেরা দাম ও দ্রুত ডেলিভারি নিশ্চিত করুন'
                  : 'Genuine products, best prices and fast delivery guaranteed'}
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleWishlistClick}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Heart className="h-4 w-4 text-rose-500" />
                <span>{isBn ? 'উইশলিস্ট' : 'Wishlist'}</span>
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isBn ? 'কার্ট খালি করুন' : 'Clear Cart'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        {items.length === 0 ? (
          <EmptyCart isBn={isBn} />
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols): Cart Items, Free Delivery Bar & Recommended Products */}
              <div className="lg:col-span-8 space-y-6">
                {/* Cart Items List */}
                <CartList
                  items={items}
                  isBn={isBn}
                  onUpdateQuantity={updateQuantity}
                  onRemoveFromCart={removeFromCart}
                />

                {/* Free Delivery Progress Banner */}
                <FreeDeliveryProgress subtotal={summary.subtotal} isBn={isBn} />

                {/* Recommended Products Carousel matching Screenshot */}
                <RecommendedProducts isBn={isBn} />
              </div>

              {/* Right Column (4 cols): Order Summary & Coupon Box Sticky */}
              <div className="lg:col-span-4 space-y-5">
                <OrderSummary isBn={isBn} />
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
                  <CouponBox isBn={isBn} />
                </div>
              </div>
            </div>

            {/* Bottom Trust Features Row matching Screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{isBn ? 'অরিজিনাল মেডিসিন' : '100% Authentic'}</h4>
                  <p className="text-[11px] text-gray-400">{isBn ? '১০০% অথেন্টিক প্রোডাক্ট' : 'Genuine medicines'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Truck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{isBn ? 'দ্রুত ডেলিভারি' : 'Fast Delivery'}</h4>
                  <p className="text-[11px] text-gray-400">{isBn ? '২-৩ কার্যদিবসে ডেলিভারি' : '2-3 Days Doorstep'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{isBn ? 'নিরাপদ পেমেন্ট' : 'Secure Payment'}</h4>
                  <p className="text-[11px] text-gray-400">{isBn ? 'সব ধরনের পেমেন্ট সুরক্ষিত' : 'Protected Checkout'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Headset className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{isBn ? '২৪/৭ সাপোর্ট' : '24/7 Support'}</h4>
                  <p className="text-[11px] text-gray-400">{isBn ? 'আমরা আছি আপনার পাশে' : 'Always here to help'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
