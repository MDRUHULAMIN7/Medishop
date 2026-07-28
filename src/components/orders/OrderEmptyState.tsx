'use client';

import React from 'react';
import Link from 'next/link';
import { PackageX, ShoppingBag, ArrowRight } from 'lucide-react';

interface OrderEmptyStateProps {
  isBn?: boolean;
  isFiltered?: boolean;
}

export function OrderEmptyState({
  isBn = true,
  isFiltered = false,
}: OrderEmptyStateProps) {
  return (
    <div className="py-12 px-4 text-center rounded-3xl border border-border bg-background shadow-xs max-w-md mx-auto my-6">
      <div className="relative mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
        <PackageX className="h-10 w-10 animate-bounce" />
      </div>

      <h3 className="text-lg font-bold text-foreground font-serif-title mb-1">
        {isFiltered
          ? isBn
            ? 'কোনো মেলানো অর্ডার পাওয়া যায়নি'
            : 'No matching orders found'
          : isBn
          ? 'আপনার কোনো অর্ডার ইতিপূর্বে নেই'
          : 'You have no order history yet'}
      </h3>

      <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-6">
        {isFiltered
          ? isBn
            ? 'অনুগ্রহ করে অন্য শব্দ বা ফিল্টার নির্বাচন করে পুনরায় চেষ্টা করুন।'
            : 'Try refining your search terms or status filters.'
          : isBn
          ? 'আমাদের আসল ওষুধ ও স্বাস্থ্য সচেতন পণ্যের ক্যাটালগ থেকে আজই প্রথম অর্ডার করুন।'
          : 'Explore authentic medicines and healthcare products to place your first order.'}
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-dark active:scale-[0.98] transition-all"
      >
        <ShoppingBag className="h-4 w-4" />
        <span>{isBn ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}</span>
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
