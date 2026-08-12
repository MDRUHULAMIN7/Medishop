'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, CheckCircle2, X, Loader2, Info } from 'lucide-react';
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
  } = useCoupon();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyCoupon();
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-700">
        {isBn ? 'কুপন প্রয়োগ করুন' : 'Apply Coupon'}
      </label>

      <AnimatePresence mode="wait">
        {appliedCoupon ? (
          /* Applied Coupon Status Box matching Screenshot */
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 border border-emerald-200"
          >
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-semibold text-emerald-800 truncate">
                {isBn
                  ? `কুপন "${appliedCoupon.code}" প্রয়োগ করা হয়েছে`
                  : `Coupon "${appliedCoupon.code}" applied`}
              </span>
            </div>

            <button
              type="button"
              onClick={removeCoupon}
              className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline shrink-0 cursor-pointer"
            >
              {isBn ? 'সরান' : 'Remove'}
            </button>
          </motion.div>
        ) : (
          /* Input Field + Apply Button matching Screenshot */
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                placeholder={isBn ? 'কুপন কোড দিন' : 'Enter coupon code'}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                maxLength={20}
              />

              <button
                type="submit"
                disabled={isLoading || !couponCodeInput.trim()}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>{isBn ? 'প্রয়োগ' : 'Apply'}</span>
                )}
              </button>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                <Info className="h-3.5 w-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
