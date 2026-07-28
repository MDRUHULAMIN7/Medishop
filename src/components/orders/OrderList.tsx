'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '@/types/order';
import { OrderCard } from './OrderCard';
import { OrderEmptyState } from './OrderEmptyState';

interface OrderListProps {
  orders: Order[];
  isBn?: boolean;
}

export function OrderList({ orders, isBn = true }: OrderListProps) {
  if (orders.length === 0) {
    return <OrderEmptyState isBn={isBn} isFiltered={true} />;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <OrderCard order={order} isBn={isBn} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
