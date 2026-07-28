'use client';

import React, { useState } from 'react';
import { Product } from '@/types/home';
import { useAppSelector } from '@/store';
import { cn } from '@/lib/utils';

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'desc' | 'dosage' | 'warnings' | 'reviews'>('desc');
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const TABS = [
    { id: 'desc', labelBn: 'বিবরণ', labelEn: 'Description' },
    { id: 'dosage', labelBn: 'মাত্রা ও সেবনবিধি', labelEn: 'Dosage & Usage' },
    { id: 'warnings', labelBn: 'পার্শ্বপ্রতিক্রিয়া ও সতর্কতা', labelEn: 'Side Effects & Warnings' },
    { id: 'reviews', labelBn: 'রিভিউসমূহ (৩)', labelEn: 'Reviews (3)' },
  ] as const;

  return (
    <div className="flex flex-col gap-4 w-full my-6 rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-xs">
      {/* Tabs Header */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all',
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
            <p className="font-semibold text-foreground text-danger">
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
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-border bg-muted/20 p-3">
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>আব্দুর রহমান</span>
                <span className="text-amber-500">★★★★★ 5.0</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isBn ? 'খুব দ্রুত ডেলিভারি পেয়েছি। ওষুধ আসল ছিল।' : 'Very fast delivery and genuine medicine.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
