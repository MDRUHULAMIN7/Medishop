'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, EyeOff, Trash2 } from 'lucide-react';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

interface ReviewItem {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  isApproved: boolean;
}

export function ReviewManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      productName: 'Napa Extra 500mg',
      customerName: 'সাকিব আল হাসান',
      rating: 5,
      comment: 'খুবই চমৎকার ও দ্রুত ঢাকা ডেলিভারি পেয়েছি। ১০০% আসল ওষুধ।',
      date: '2026-08-01',
      isApproved: true,
    },
    {
      id: 'rev-2',
      productName: 'OneTouch Select Plus Strips',
      customerName: 'ফারজানা আক্তার',
      rating: 4,
      comment: 'স্ট্রিপের মেয়ার ২০২৭ পর্যন্ত আছে, প্যাকেজিং খুব ভালো ছিল।',
      date: '2026-08-02',
      isApproved: true,
    },
  ]);

  const handleToggleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
    toast.success(isBn ? 'রিভিউ মডারেশন আপডেট হয়েছে' : 'Review approval updated');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'গ্রাহক রিভিউ ও রেটিং মডারেশন' : 'Product Reviews & Ratings'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'গ্রাহকদের দেওয়া রিভিউ মডারেট ও অনুমোদন করুন'
              : 'Moderate customer reviews and approve rating feedback'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border bg-background p-5 shadow-2xs gap-4"
          >
            <div className="flex flex-col gap-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary text-xs">{rev.productName}</span>
                <span className="text-[11px] text-muted-foreground">• {rev.customerName}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rev.rating ? 'fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-foreground ml-1.5">{rev.rating}.0</span>
              </div>

              <p className="text-xs text-foreground italic mt-1">"{rev.comment}"</p>
              <span className="text-[10px] text-muted-foreground">{rev.date}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleApprove(rev.id)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  rev.isApproved
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {rev.isApproved ? 'Approved' : 'Pending Review'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
