'use client';

import React from 'react';
import { Order } from '@/types/order';
import { InvoicePreview } from '../checkout/InvoicePreview';

interface OrderInvoiceProps {
  order: Order;
  isBn?: boolean;
}

export function OrderInvoice({ order, isBn = true }: OrderInvoiceProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <InvoicePreview order={order} isBn={isBn} />
    </div>
  );
}
