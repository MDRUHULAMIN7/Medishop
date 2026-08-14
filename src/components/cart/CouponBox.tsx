'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, X } from 'lucide-react';
import { useCoupon } from '@/hooks/useCoupon';

interface CouponBoxProps {
  isBn?: boolean;
}

export function CouponBox({ isBn = true }: CouponBoxProps) {
  const {
    couponCodeInput,
    setCouponCodeInput,
    appliedCoupon,
    isLoading,
    applyCoupon,
    removeCoupon,
  } = useCoupon();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    await applyCoupon();
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900">
        {isBn ? 'কুপন কোড ব্যবহার করুন' : 'Apply Coupon Code'}
      </h3>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={couponCodeInput}
          onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
          placeholder={isBn ? 'কুপন কোড লিখুন' : 'Enter coupon code'}
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-blue-600 focus:bg-white focus:outline-hidden"
          maxLength={20}
        />

        <button
          type="submit"
          disabled={isLoading || !couponCodeInput.trim()}
          className="inline-flex items-center justify-center rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>{isBn ? 'প্রয়োগ করুন' : 'Apply'}</span>
          )}
        </button>
      </form>

      {/* Applied Active Coupon Pill Banner matching Screenshot */}
      <AnimatePresence>
        {appliedCoupon && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 space-y-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-emerald-900 text-xs tracking-wider">
                  {appliedCoupon.code}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                  {isBn ? 'প্রযোজ্য হয়েছে' : 'Applied'}
                </span>
              </div>

              <button
                type="button"
                onClick={removeCoupon}
                className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-red-600 cursor-pointer"
              >
                <span>{isBn ? 'মুছুন' : 'Remove'}</span>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-emerald-700 font-medium">
              {isBn
                ? '১০% ছাড় (সর্বোচ্চ ৳১০০ ছাড়)'
                : '10% OFF (Max ৳100 discount)'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
