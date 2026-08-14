'use client';

import React from 'react';
import { Order } from '@/types/order';
import { CustomerOrdersTable } from './CustomerOrdersTable';
import { OrderEmptyState } from './OrderEmptyState';

interface OrderListProps {
  orders: Order[];
  isBn?: boolean;
  onRefresh?: () => void;
}

export function OrderList({ orders, isBn = true, onRefresh }: OrderListProps) {
  if (orders.length === 0) {
    return <OrderEmptyState isBn={isBn} isFiltered={true} />;
  }

  return <CustomerOrdersTable orders={orders} isBn={isBn} onRefresh={onRefresh} />;
}
