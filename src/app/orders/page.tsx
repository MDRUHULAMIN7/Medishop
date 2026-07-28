'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, PackageCheck } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { OrderList } from '@/components/orders/OrderList';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import { OrderEmptyState } from '@/components/orders/OrderEmptyState';

export default function OrderHistoryPage() {
  const { orders, allOrders, filters, isLoading, updateFilters, isBn } = useOrders();

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
                {isBn ? 'আমার অর্ডার হিস্ট্রি' : 'Order History & Tracking'}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isBn
                  ? 'আপনার সকল বর্তমান ও পূর্বের অর্ডারের স্ট্যাটাস ট্র্যাক করুন'
                  : 'Track current shipments, view invoices, and manage past orders.'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {isLoading ? (
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
