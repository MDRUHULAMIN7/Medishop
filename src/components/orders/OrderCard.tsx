'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText, PackageCheck, Clock } from 'lucide-react';
import { Order } from '@/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatPrice } from '@/utils/cart';

interface OrderCardProps {
  order: Order;
  isBn?: boolean;
}

export function OrderCard({ order, isBn = true }: OrderCardProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const previewItems = order.items.slice(0, 3);
  const remainingCount = order.items.length - previewItems.length;

  return (
    <div className="rounded-2xl border border-border bg-background p-5 shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-extrabold text-foreground">{order.orderNumber}</h3>
            <OrderStatusBadge status={order.orderStatus} isBn={isBn} />
            {(order as any).isPreOrder && (
              <span className="rounded-md bg-primary/10 border border-primary/20 px-1.5 py-0.2 text-[9px] font-black text-primary">
                Pre-Order
              </span>
            )}
            {(order as any).isSplitDelivery && (
              <span className="rounded-md bg-blue-50 border border-blue-200 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                ২ চালান
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {isBn ? 'অর্ডারের তারিখ:' : 'Placed on:'} {formattedDate}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-muted-foreground font-semibold">
            {isBn ? 'সর্বমোট প্রদেয়' : 'Grand Total'}
          </p>
          <p className="text-base font-extrabold text-primary">
            {formatPrice(order.summary.grandTotal, isBn ? 'bn' : 'en')}
          </p>
        </div>
      </div>

      {/* Items Preview */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2 overflow-hidden">
          {previewItems.map((item) => (
            <div
              key={item.productId}
              className="relative h-10 w-10 overflow-hidden rounded-xl border border-border bg-muted/30 p-1 shrink-0"
            >
              <Image
                src={item.image}
                alt={isBn ? item.nameBn : item.nameEn}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-foreground line-clamp-1">
            {isBn ? previewItems[0]?.nameBn : previewItems[0]?.nameEn}
            {order.items.length > 1 && (
              <span className="font-normal text-muted-foreground">
                {' '}
                {isBn ? `এবং আরও ${order.items.length - 1} টি আইটেম` : `& ${order.items.length - 1} more`}
              </span>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {isBn ? 'পেমেন্ট:' : 'Payment:'} {isBn ? order.paymentMethod.nameBn : order.paymentMethod.nameEn}
          </p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground">
          {isBn ? 'আনুমানিক ডেলিভারি:' : 'Est. Delivery:'} <strong className="text-foreground">{order.estimatedDeliveryDate}</strong>
        </span>

        <div className="flex items-center gap-2">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all"
          >
            <span>{isBn ? 'বিস্তারিত & ট্র্যাকিং' : 'View & Track'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
