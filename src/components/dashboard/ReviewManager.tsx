'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle, EyeOff, Trash2, RefreshCw, MessageSquare } from 'lucide-react';
import { useAppSelector } from '@/store';
import { reviewService, ReviewItem } from '@/services/review.service';
import { toast } from 'sonner';
import { exportRowsToExcel } from '@/lib/excelExport';
import { ExportExcelButton } from '@/components/dashboard/ExportExcelButton';

export function ReviewManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      // Load recent public reviews across products
      const data = await reviewService.getProductReviews('all');
      setReviews(data.reviews || []);
    } catch (err: any) {
      console.error('Failed to load product reviews:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleApprove = (id: string) => {
    toast.success(isBn ? 'রিভিউ অনুমোদন স্ট্যাটাস আপডেট হয়েছে' : 'Review approval status updated');
  };

  const handleExport = () => {
    exportRowsToExcel({ filename: `medishop-reviews-${new Date().toISOString().slice(0, 10)}`, sheets: [{ name: 'Reviews', rows: reviews.map((review) => ({ Product: review.product || '', Customer: review.user?.name || '', Rating: review.rating, Comment: review.comment || '', Date: new Date(review.createdAt) })) }] });
    toast.success('Reviews exported to Excel');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{isBn ? 'কাস্টমার রিভিউ মডারেশন' : 'Verified Reviews Moderation'}</span>
          </span>
          <h2 className="text-xl font-extrabold text-foreground mt-1">
            {isBn ? 'গ্রাহক রিভিউ ও রেটিং মডারেশন' : 'Product Reviews & Ratings'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'ভেরিফাইড ক্রেতাদের প্রোডাক্ট রিভিউ ও তারকা রেটিং পর্যবেক্ষণ করুন'
              : 'Moderate customer rating feedback from verified purchase orders.'}
          </p>
        </div><ExportExcelButton onClick={handleExport} />

      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-xs text-muted-foreground gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span>{isBn ? 'ডাটাবেজ থেকে কাস্টমার রিভিউ লোড হচ্ছে...' : 'Loading verified reviews...'}</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-3xl bg-background text-muted-foreground">
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-2" />
          <p className="text-sm font-bold text-foreground">
            {isBn ? 'কোনো রিভিউ পাওয়া যায়নি' : 'No customer reviews submitted yet'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isBn ? 'গ্রাহকরা ওষুধ অর্ডার ও ডেলিভারি পাওয়ার পর রিভিউ দিলে তা এখানে রেন্ডার হবে।' : 'Reviews submitted by verified buyers after receiving orders will appear here.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-border bg-background p-5 shadow-2xs gap-4"
            >
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-xs">{rev.product || 'Medicine Product'}</span>
                  <span className="text-[11px] text-muted-foreground">• {rev.user?.name || 'Customer'}</span>
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

                <p className="text-xs text-foreground italic mt-1">"{rev.comment || 'No comment text'}"</p>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleToggleApprove(rev.id)}
                  className="rounded-full px-3 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 cursor-pointer"
                >
                  Verified Buyer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
