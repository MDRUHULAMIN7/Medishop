'use client';

import React, { useState } from 'react';
import { Star, X, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { reviewService, CreateReviewInput } from '@/services/review.service';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
}

export function WriteReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isBn = language === 'bn';

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error(isBn ? 'রিভিউ দিতে আগে লগইন করুন' : 'Please sign in to submit a review');
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error(isBn ? '১ থেকে ৫ তারকা রেটিং নির্বাচন করুন' : 'Please select a star rating between 1 and 5');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      await reviewService.createReview(productId, {
        rating,
        comment: comment.trim() || undefined,
      });

      toast.success(
        isBn
          ? 'আপনার ভেরিফাইড রিভিউটি সফলভাবে সংরক্ষিত হয়েছে!'
          : 'Your verified purchase review has been submitted successfully!'
      );
      onReviewSubmitted();
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to submit review';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isBn ? 'ভেরিফাইড কাস্টমার রিভিউ' : 'Verified Buyer Review'}</span>
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-foreground mt-1 line-clamp-1">
              {productName}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-bold">{isBn ? 'অনুমতি নেই' : 'Verification Check Failed'}</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">
              {isBn ? 'রেটিং দিন (১-৫ তারকা):' : 'Select Rating (1 to 5 Stars):'}
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-extrabold text-amber-600">
                {rating}.0 / 5.0
              </span>
            </div>
          </div>

          {/* Comment Textarea */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              {isBn ? 'আপনার মন্তব্য বা মতামত:' : 'Your Feedback / Comment:'}
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isBn
                  ? 'ওষুধটির ফলপ্রসূতা, মান ও ডেলিভারি অভিজ্ঞতা জানান...'
                  : 'Share your experience about medicine efficacy, packaging, or delivery...'
              }
              className="w-full rounded-2xl border border-border bg-muted/20 p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isBn ? 'সাবমিট হচ্ছে...' : 'Submitting...'}</span>
                </>
              ) : (
                <span>{isBn ? 'রিভিউ জমা দিন' : 'Submit Review'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
