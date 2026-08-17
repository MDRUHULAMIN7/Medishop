'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartDrawerItem } from './CartDrawerItem';
import { FreeDeliveryProgress } from './FreeDeliveryProgress';
import { RemoveItemDialog } from './RemoveItemDialog';
import { CartItem } from '@/types/cart';
import { formatPrice, formatNumber } from '@/utils/cart';
import { useAppSelector } from '@/store';

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    summary,
    trackBeginCheckout,
  } = useCart();

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);

  // Focus trap & Keyboard listeners & Scroll lock
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, closeDrawer]);

  const handleCheckoutClick = () => {
    trackBeginCheckout(items, summary.grandTotal);
    closeDrawer();
    router.push('/checkout');
  };

  return (
    <>
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-over Drawer Container */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label={isBn ? 'আপনার শপিং কার্ট' : 'Your Shopping Cart'}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="w-screen max-w-full sm:max-w-[420px] bg-background shadow-2xl flex flex-col justify-between border-l border-border"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border p-4 bg-primary/5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-foreground font-serif-title">
                          {isBn ? 'আপনার শপিং কার্ট' : 'Shopping Cart'}
                        </h2>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-extrabold text-primary">
                          {formatNumber(summary.totalQuantity, isBn ? 'bn' : 'en')}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        {isBn ? '১০০% আসল ওষুধ ও হেলথ প্রোডাক্ট' : '100% Genuine Medicines & Supplies'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={closeDrawer}
                    aria-label={isBn ? 'বন্ধ করুন' : 'Close drawer'}
                    className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Free Delivery Progress Header */}
                {items.length > 0 && (
                  <div className="px-4 pt-3 pb-2 border-b border-border bg-muted/20">
                    <FreeDeliveryProgress subtotal={summary.subtotal} isBn={isBn} />
                  </div>
                )}

                {/* Pre-Order Notice Banner if cart has Pre-Order items */}
                {items.some((item) => Boolean(item.preOrderQuantity && item.preOrderQuantity > 0) || Boolean(item.allowPreOrder)) && (
                  <div className="mx-4 mt-2.5 rounded-xl border border-primary/20 bg-primary/5 p-2.5 flex items-center gap-2 text-xs">
                    <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-black text-primary border border-primary/20 shrink-0">
                      {isBn ? 'Pre-Order' : 'Pre-Order'}
                    </span>
                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      {isBn
                        ? 'কার্টে প্রি-অর্ডারের ওষুধ রয়েছে (ডেলিভারি ৩-৫ দিন)'
                        : 'Includes pre-order medicines (3-5 days delivery)'}
                    </p>
                  </div>
                )}

                {/* Item List / Empty State */}
                <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar bg-background">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center py-12">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                        <ShoppingBag className="h-10 w-10" />
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-1">
                        {isBn ? 'আপনার কার্ট খালি!' : 'Your cart is empty!'}
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-[240px] mb-6">
                        {isBn
                          ? 'আপনার প্রয়োজনীয় ওষুধ ও হেলথকেয়ার প্রোডাক্ট যোগ করুন'
                          : 'Add items to your cart to get started with fast home delivery.'}
                      </p>
                      <button
                        onClick={closeDrawer}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all"
                      >
                        {isBn ? 'ওষুধ খুঁজুন' : 'Browse Medicines'}
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {items.map((item) => (
                        <CartDrawerItem
                          key={item.productId}
                          item={item}
                          isBn={isBn}
                          onUpdateQuantity={updateQuantity}
                          onRemoveRequest={(item) => setItemToRemove(item)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Section */}
                {items.length > 0 && (
                  <div className="border-t border-border bg-background p-4 shadow-lg">
                    {/* Savings Badge if any */}
                    {summary.totalSavings > 0 && (
                      <div className="mb-3 flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-1.5 text-emerald-800 text-xs font-bold border border-emerald-200">
                        <span className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-emerald-600" />
                          {isBn ? 'মোট সাশ্রয়' : 'Total Savings'}
                        </span>
                        <span>{formatPrice(summary.totalSavings, isBn ? 'bn' : 'en')}</span>
                      </div>
                    )}

                    {/* Financial Breakdown */}
                    <div className="space-y-1.5 text-xs mb-4">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
                        <span className="font-semibold text-foreground">
                          {formatPrice(summary.subtotal, isBn ? 'bn' : 'en')}
                        </span>
                      </div>

                      <div className="flex justify-between text-muted-foreground">
                        <span>{isBn ? 'ডেলিভারি চার্জ' : 'Delivery Fee'}</span>
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

                      <div className="flex justify-between text-sm font-extrabold text-foreground pt-2 border-t border-border">
                        <span>{isBn ? 'সর্বমোট' : 'Grand Total'}</span>
                        <span className="text-base text-primary">
                          {formatPrice(summary.grandTotal, isBn ? 'bn' : 'en')}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2.5">
                      <Link
                        href="/cart"
                        onClick={closeDrawer}
                        className="flex-1 inline-flex items-center justify-center rounded-xl border border-border bg-muted/40 px-3 py-3 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                      >
                        {isBn ? 'কার্ট দেখুন' : 'View Full Cart'}
                      </Link>

                      <button
                        type="button"
                        onClick={handleCheckoutClick}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-dark active:scale-[0.98] transition-all"
                      >
                        <span>{isBn ? 'অর্ডার করুন' : 'Checkout'}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Trust guarantee */}
                    <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent-dark" />
                      <span>{isBn ? 'ডিজিডিএ অনুমোদিত ক্যাশ অন ডেলিভারি' : 'DGDA Certified Authentic Pharmacy'}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove confirmation modal */}
      <RemoveItemDialog
        isOpen={Boolean(itemToRemove)}
        item={itemToRemove}
        isBn={isBn}
        onClose={() => setItemToRemove(null)}
        onConfirmRemove={(id) => removeFromCart(id)}
      />
    </>
  );
}
