'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ArrowRight, Pill, Plus, Clock } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/cart';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store';
import { openPreOrderModal } from '@/store/slices/cartSlice';

interface EmptyCartProps {
  isBn?: boolean;
}

export function EmptyCart({ isBn = true }: EmptyCartProps) {
  const dispatch = useAppDispatch();
  const { addToCart } = useCart();
  const recommendedProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="py-8 space-y-12">
      {/* Empty State Hero Card */}
      <div className="max-w-md mx-auto text-center bg-background rounded-3xl p-8 border border-border shadow-xs">
        {/* Vector SVG Illustration Container */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="w-16 h-16 text-primary animate-pulse" />
          <div className="absolute -bottom-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
            <Pill className="h-5 w-5" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-foreground font-serif-title mb-2">
          {isBn ? 'আপনার কার্ট বর্তমানে খালি' : 'Your cart is currently empty'}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-6 leading-relaxed">
          {isBn
            ? 'আপনার প্রয়োজনীয় ওষুধ, হেলথকেয়ার এবং পার্সোনাল কেয়ার প্রোডাক্ট দ্রুত খুঁজে পেতে কেনাকাটা শুরু করুন।'
            : 'Explore thousands of authentic medicines and healthcare essentials with express same-day delivery.'}
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-primary-dark active:scale-[0.98] transition-all"
        >
          <span>{isBn ? 'কেনাকাটা শুরু করুন' : 'Continue Shopping'}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Recommended Products Grid */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-foreground font-serif-title">
              {isBn ? 'জনপ্রিয় ওষুধ ও প্রোডাক্টসমূহ' : 'Popular Essential Products'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBn ? 'গ্রাহকদের পছন্দের টপ সেলিং প্রোডাক্ট' : 'Top selling products recommended for you'}
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>{isBn ? 'সব দেখুন' : 'View All'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommendedProducts.map((prod) => {
            const isOut = prod.stockCount <= 0;
            return (
              <div
                key={prod.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div>
                  <div className="relative h-32 w-full mb-3 rounded-xl overflow-hidden bg-muted/20 border border-border p-2">
                    <Image
                      src={prod.image}
                      alt={isBn ? prod.nameBn : prod.nameEn}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-muted-foreground">{prod.brand}</p>
                  <h4 className="text-xs font-bold text-foreground line-clamp-1">
                    {isBn ? prod.nameBn : prod.nameEn}
                  </h4>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <span className="text-xs font-extrabold text-primary">
                      {formatPrice(prod.price, isBn ? 'bn' : 'en')}
                    </span>
                    {prod.mrp > prod.price && (
                      <span className="ml-1.5 text-[10px] text-muted-foreground line-through">
                        {formatPrice(prod.mrp, isBn ? 'bn' : 'en')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (isOut) {
                        dispatch(
                          openPreOrderModal({
                            item: {
                              productId: prod.id,
                              slug: prod.slug,
                              nameBn: prod.nameBn,
                              nameEn: prod.nameEn,
                              brand: prod.brand,
                              image: prod.image,
                              unit: prod.unit,
                              sellingPrice: prod.price,
                              mrp: prod.mrp,
                              prescriptionRequired: prod.requiresRx,
                              stock: 0,
                              quantity: 1,
                            },
                            requestedQuantity: 1,
                            availableStock: 0,
                          })
                        );
                        return;
                      }

                      addToCart({
                        productId: prod.id,
                        slug: prod.slug,
                        nameBn: prod.nameBn,
                        nameEn: prod.nameEn,
                        brand: prod.brand,
                        image: prod.image,
                        unit: prod.unit,
                        sellingPrice: prod.price,
                        mrp: prod.mrp,
                        prescriptionRequired: prod.requiresRx,
                        stock: prod.stockCount,
                        quantity: 1,
                      });
                    }}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-xl transition-all cursor-pointer',
                      'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    )}
                    title={isOut ? (isBn ? 'Pre-Order করুন' : 'Pre-Order') : (isBn ? 'কার্টে যোগ করুন' : 'Add to cart')}
                  >
                    {isOut ? <Clock className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
