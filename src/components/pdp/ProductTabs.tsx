'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Star, ShieldCheck, Plus, Loader2, MessageSquare } from 'lucide-react';
import { Product } from '@/types/home';
import { useAppSelector } from '@/store';
import { reviewService, ReviewItem } from '@/services/review.service';
import { WriteReviewModal } from './WriteReviewModal';
import { cn } from '@/lib/utils';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'dosage' | 'warnings' | 'reviews'>('desc');
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsTotal, setReviewsTotal] = useState(product.reviewCount || 0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    if (!product.id) return;
    setLoadingReviews(true);
    try {
      const res = await reviewService.getProductReviews(product.id, 1, 20);
      setReviews(res.reviews);
      setReviewsTotal(res.meta.total);
    } catch (err: any) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  }, [product.id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const TABS = [
    { id: 'desc', labelBn: 'বিবরণ', labelEn: 'Description' },
    { id: 'dosage', labelBn: 'মাত্রা ও সেবনবিধি', labelEn: 'Dosage & Usage' },
    { id: 'warnings', labelBn: 'পার্শ্বপ্রতিক্রিয়া ও সতর্কতা', labelEn: 'Side Effects & Warnings' },
    {
      id: 'reviews',
      labelBn: `রিভিউসমূহ (${reviewsTotal})`,
      labelEn: `Reviews (${reviewsTotal})`,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-4 w-full my-6 rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-xs">
      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer',
              activeTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {isBn ? tab.labelBn : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed p-1">
        {activeTab === 'desc' && (
          <div className="flex flex-col gap-2">
            <p>
              {isBn
                ? `${product.nameBn} একটি উচ্চমানের রেজিস্টার্ড ওষুধ। এটি প্রস্তুত করেছে বিখ্যাত ফার্মাসিউটিক্যাল কোম্পানি ${product.brand}।`
                : `${product.nameEn} is a trusted medicine manufactured by ${product.brand}.`}
            </p>
            <p className="text-muted-foreground text-xs">
              {isBn
                ? 'সংরক্ষণ নির্দেশিকা: শুষ্ক ও আলো থেকে দূরে ৩০ ডিগ্রি সেলসিয়াসের নিচে রাখুন। শিশুদের নাগালের বাইরে রাখুন।'
                : 'Storage Info: Keep in a cool & dry place below 30°C. Protect from light. Keep out of reach of children.'}
            </p>
          </div>
        )}

        {activeTab === 'dosage' && (
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-foreground">
              {isBn ? 'সাধারণ সেবনবিধি:' : 'General Dosage Instruction:'}
            </p>
            <p>
              {isBn
                ? 'ডাক্তারের পরামর্শ অনুযায়ী প্রতিদিন নির্ধারিত মাত্রায় সেবন করুন। সাধারণত খাবারের আগে বা পরে পানি দিয়ে সেবনযোগ্য।'
                : 'Take as directed by your registered physician. Usually taken orally with water before or after meals.'}
            </p>
          </div>
        )}

        {activeTab === 'warnings' && (
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-foreground text-rose-600">
              {isBn ? 'বিশেষ সতর্কতা:' : 'Special Precaution:'}
            </p>
            <p>
              {isBn
                ? 'যেকোনো ওষুধ সেবনের আগে ডাক্তারের পরামর্শ নিন। কোনো পার্শ্বপ্রতিক্রিয়া বা অ্যালার্জি দেখা দিলে অবিলম্বে ওষুধ সেবন বন্ধ করুন।'
                : 'Consult a physician before use. Discontinue if allergic reactions occur.'}
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Reviews Top Summary & Write Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-muted/20 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold text-foreground">
                    {((product as any).ratingAverage || product.rating || 5.0).toFixed(1)}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round((product as any).ratingAverage || product.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    ({reviewsTotal} {isBn ? 'টি রিভিউ' : 'reviews'})
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isBn
                    ? 'শুধুমাত্র ভেরিফাইড ক্রয়কারী কাস্টমারদের রিভিউ ডিরেক্ট ডাটাবেজ থেকে দেখানো হচ্ছে'
                    : 'Showing customer reviews submitted by verified buyers.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsWriteModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-primary-dark transition-all cursor-pointer w-fit"
              >
                <Plus className="h-4 w-4" />
                <span>{isBn ? 'রিভিউ লিখুন' : 'Write a Review'}</span>
              </button>
            </div>

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span>{isBn ? 'রিভিউ লোড হচ্ছে...' : 'Loading reviews...'}</span>
              </div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border rounded-2xl p-6 text-muted-foreground">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="text-xs font-bold text-foreground">
                  {isBn ? 'এখনো কোনো কাস্টমার রিভিউ পাওয়া যায়নি' : 'No verified reviews yet'}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {isBn
                    ? 'পণ্যটি ক্রয় করে থাকলে প্রথম রিভিউটি আপনিই দিন!'
                    : 'Be the first verified customer to leave a review for this medicine!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          {rev.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            {rev.user?.name || 'Verified Buyer'}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                            <ShieldCheck className="h-3 w-3" />
                            <span>{isBn ? 'ভেরিফাইড ক্রেতা' : 'Verified Buyer'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-foreground/90 leading-relaxed pl-9">
                        "{rev.comment}"
                      </p>
                    )}

                    <div className="text-[10px] text-muted-foreground pl-9">
                      {new Date(rev.createdAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <WriteReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        productId={product.id}
        productName={isBn ? product.nameBn : product.nameEn}
        onReviewSubmitted={fetchReviews}
      />
    </div>
  );
}
