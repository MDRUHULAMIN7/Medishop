'use client';

import React, { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { OrderFilters } from '@/components/orders/OrderFilters';
import { OrderList } from '@/components/orders/OrderList';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import { OrderEmptyState } from '@/components/orders/OrderEmptyState';
import { CustomerPosPurchasesSection } from './CustomerPosPurchasesSection';
import { ShoppingBag, Store } from 'lucide-react';

interface MyOrdersSectionProps {
  isBn?: boolean;
}

export function MyOrdersSection({ isBn = true }: MyOrdersSectionProps) {
  const { orders, allOrders, filters, isLoading, updateFilters, refreshOrders } = useOrders();
  const [orderType, setOrderType] = useState<'online' | 'pos'>('online');

  return (
    <div className="space-y-6">
      {/* Tab Switcher: Online Delivery Orders vs Physical Pharmacy Counter Purchases */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-border bg-muted/20 w-fit text-xs font-bold shadow-2xs">
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
          <span>{isBn ? 'অনলাইন হোম ডেলিভারি অর্ডার' : 'Online Delivery Orders'}</span>
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
          <span>{isBn ? 'কাউন্টার ক্রয় ও ক্যাশ মেমো' : 'In-Store / POS Receipts'}</span>
        </button>
      </div>

      {orderType === 'pos' ? (
        <CustomerPosPurchasesSection isBn={isBn} />
      ) : isLoading ? (
        <OrderSkeleton />
      ) : allOrders.length === 0 ? (
        <OrderEmptyState isBn={isBn} isFiltered={false} />
      ) : (
        <div className="space-y-5">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-background to-muted/20 p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                  {isBn ? 'অর্ডার সেন্টার' : 'Order Center'}
                </p>
                <h3 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                  {isBn ? 'আপনার সব অনলাইন অর্ডার' : 'All your online orders'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isBn
                    ? 'ফিল্টার, স্ট্যাটাস আর ট্র্যাকিং অপশনগুলো সহজে দেখুন।'
                    : 'Browse filters, statuses, and live tracking in one tidy view.'}
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
      )}
    </div>
  );
}
