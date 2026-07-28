'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useOrderDetails } from '@/hooks/useOrderDetails';
import { OrderDetails } from '@/components/orders/OrderDetails';
import { OrderSkeleton } from '@/components/orders/OrderSkeleton';
import { OrderEmptyState } from '@/components/orders/OrderEmptyState';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const { order, isLoading, cancelOrder, isBn } = useOrderDetails(orderId);

  return (
    <div className="min-h-screen bg-muted/30 pb-16">
      <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            {isBn ? 'হোম' : 'Home'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <Link href="/orders" className="hover:text-primary transition-colors">
            {isBn ? 'অর্ডারসমূহ' : 'Orders'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
          <span className="font-bold text-foreground">
            {order ? order.orderNumber : orderId}
          </span>
        </nav>

        {/* Content */}
        {isLoading ? (
          <OrderSkeleton />
        ) : !order ? (
          <OrderEmptyState isBn={isBn} isFiltered={true} />
        ) : (
          <OrderDetails
            order={order}
            onCancelOrder={cancelOrder}
            isBn={isBn}
          />
        )}
      </div>
    </div>
  );
}
