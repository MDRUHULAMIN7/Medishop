'use client';

import React from 'react';
import { useOrders } from '@/hooks/useOrders';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { OrderList } from '@/components/orders/OrderList';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import { OrderEmptyState } from '@/components/orders/OrderEmptyState';

interface MyOrdersSectionProps {
  isBn?: boolean;
}

export function MyOrdersSection({ isBn = true }: MyOrdersSectionProps) {
  const { orders, allOrders, filters, isLoading, updateFilters, refreshOrders } = useOrders();

  if (isLoading) {
    return <OrderSkeleton />;
  }

  if (allOrders.length === 0) {
    return <OrderEmptyState isBn={isBn} isFiltered={false} />;
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-gradient-to-br from-background to-muted/20 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              {isBn ? 'অর্ডার সেন্টার' : 'Order Center'}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
              {isBn ? 'আপনার সব অর্ডার এক নজরে' : 'All your orders at a glance'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isBn
                ? 'ফিল্টার, স্ট্যাটাস আর পুনরায় পেমেন্ট অপশনগুলো সহজে দেখুন।'
                : 'Browse filters, statuses, and payment actions in one tidy view.'}
            </p>
          </div>

          <div className="inline-flex rounded-2xl border border-border bg-background px-3 py-2 text-xs font-bold text-muted-foreground">
            <span>{isBn ? 'মোট অর্ডার' : 'Total orders'}</span>
            <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              {allOrders.length}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-background p-4 sm:p-5 shadow-sm space-y-5">
        <OrderFilters filters={filters} onUpdateFilters={updateFilters} isBn={isBn} />
        <OrderList orders={orders} isBn={isBn} onRefresh={refreshOrders} />
      </div>
    </div>
  );
}
