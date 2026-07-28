'use client';

import React from 'react';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { OrderSuccess } from '@/components/checkout/OrderSuccess';

export default function OrderSuccessPage() {
  const { order, isBn } = useOrderDetails();

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <OrderSuccess order={order} isBn={isBn} />
    </div>
  );
}
