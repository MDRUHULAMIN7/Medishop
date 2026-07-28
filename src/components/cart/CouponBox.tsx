'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, CheckCircle2, X, Sparkles, Loader2, Info } from 'lucide-react';
import { useCoupon } from '@/hooks/useCoupon';
import { formatPrice } from '@/utils/cart';

interface CouponBoxProps {
  isBn?: boolean;
}

export function CouponBox({ isBn = true }: CouponBoxProps) {
  const {
    couponCodeInput,
    setCouponCodeInput,
    appliedCoupon,
    isLoading,
    errorMsg,
    applyCoupon,
    removeCoupon,
    availableCoupons,
  } = useCoupon();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyCoupon();
  };

  const handleChipClick = (code: string) => {
    setCouponCodeInput(code);
    applyCoupon(code);
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Tag className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">
            {isBn ? 'প্রোমো কোড / কুপন প্রয়োগ করুন' : 'Apply Promo Code / Coupon'}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            {isBn ? 'অতিরিক্ত ছাড়ের জন্য কুপন কোড লিখুন' : 'Enter a promo code for extra discounts'}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {appliedCoupon ? (
          /* Applied Coupon Tag Card */
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 p-3.5 border border-emerald-200"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-emerald-900 uppercase tracking-wider">
                    {appliedCoupon.code}
                  </span>
                  <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    {appliedCoupon.type === 'free_shipping'
                      ? isBn
                        ? 'ফ্রি শিপিং'
                        : 'Free Shipping'
                      : `${formatPrice(appliedCoupon.discountAmount, isBn ? 'bn' : 'en')} ${isBn ? 'ছাড়' : 'OFF'}`}
                  </span>
                </div>
                <p className="text-xs text-emerald-700 truncate">
                  {isBn ? appliedCoupon.descriptionBn : appliedCoupon.descriptionEn}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={removeCoupon}
              aria-label={isBn ? 'কুপন সরান' : 'Remove coupon'}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-emerald-800 hover:bg-emerald-200/60 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          /* Form Input */
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  placeholder={isBn ? 'কোড লিখুন (যেমন: SAVE10)' : 'Enter code (e.g. SAVE10)'}
                  className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  maxLength={20}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !couponCodeInput.trim()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>{isBn ? 'প্রয়োগ করুন' : 'Apply'}</span>
                )}
              </button>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <p className="mt-2 text-xs font-semibold text-red-600 flex items-center gap-1">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}

            {/* Recommended Coupon Chips */}
            <div className="mt-3.5 pt-3 border-t border-border">
              <p className="text-[11px] font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-accent" />
                {isBn ? 'প্রাপ্য কুপনসমূহ:' : 'Available Offers:'}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {availableCoupons.map((coupon) => (
                  <button
                    key={coupon.code}
                    type="button"
                    onClick={() => handleChipClick(coupon.code)}
                    className="inline-flex items-center gap-1 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span>{coupon.code}</span>
                    <span className="text-[9px] opacity-75">
                      ({isBn ? coupon.descriptionBn : coupon.descriptionEn})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
