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
    <div className="space-y-6">
      <OrderFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        isBn={isBn}
      />

      <OrderList orders={orders} isBn={isBn} onRefresh={refreshOrders} />
    </div>
  );
}
