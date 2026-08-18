'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, PackageCheck, ShoppingBag, Store } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { OrderList } from '@/components/orders/OrderList';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import { OrderEmptyState } from '@/components/orders/OrderEmptyState';
import { CustomerPosPurchasesSection } from '@/components/profile/CustomerPosPurchasesSection';

export default function OrderHistoryPage() {
  const { orders, allOrders, filters, isLoading, updateFilters, isBn } = useOrders();
  const [orderType, setOrderType] = useState<'online' | 'pos'>('online');

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-bold text-foreground">
            {isBn ? 'আমার অর্ডারসমূহ' : 'My Orders'}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-background p-4 sm:p-6 rounded-2xl border border-border shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PackageCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                {isBn ? 'আমার অর্ডার ও কেনাকাটার হিস্ট্রি' : 'Order History & Purchases'}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBn
                  ? 'আপনার অনলাইন হোম ডেলিভারি ও সরাসরি ফার্মেসি কাউন্টার থেকে কেনার সমস্ত মেমো দেখুন'
                  : 'Track online shipments and view your in-store counter cash receipts.'}
              </p>
            </div>
          </div>

          {/* Sub-tab toggle */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-border bg-muted/20 text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => setOrderType('online')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                orderType === 'online'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 text-primary" />
              <span>{isBn ? 'অনলাইন অর্ডার' : 'Online Orders'}</span>
            </button>

            <button
              type="button"
              onClick={() => setOrderType('pos')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                orderType === 'pos'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Store className="h-3.5 w-3.5 text-primary" />
              <span>{isBn ? 'কাউন্টার মেমো' : 'In-Store / POS'}</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {orderType === 'pos' ? (
          <CustomerPosPurchasesSection isBn={isBn} />
        ) : isLoading ? (
          <OrderSkeleton />
        ) : allOrders.length === 0 ? (
          <OrderEmptyState isBn={isBn} isFiltered={false} />
        ) : (
          <div className="space-y-6">
            <OrderFilters
              filters={filters}
              onUpdateFilters={updateFilters}
              isBn={isBn}
            />

            <OrderList orders={orders} isBn={isBn} />
          </div>
        )}
      </div>
    </div>
  );
}
