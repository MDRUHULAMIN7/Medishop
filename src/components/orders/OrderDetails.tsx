'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Printer,
  Clock,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Ban,
  FileText,
} from 'lucide-react';
import { Order } from '@/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { OrderItem } from './OrderItem';
import { InvoicePreview } from '../checkout/InvoicePreview';
import { formatPrice } from '@/utils/cart';
import { invoiceService } from '@/services/invoice.service';

interface OrderDetailsProps {
  order: Order;
  onCancelOrder?: () => void;
  isBn?: boolean;
}

export function OrderDetails({
  order,
  onCancelOrder,
  isBn = true,
}: OrderDetailsProps) {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted transition-colors"
            title={isBn ? 'পিছনে যান' : 'Back to orders'}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                {order.orderNumber}
              </h1>
              <OrderStatusBadge status={order.orderStatus} isBn={isBn} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {isBn ? 'অর্ডারের সময়:' : 'Placed on:'} {formattedDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => invoiceService.printInvoice()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground shadow-xs hover:bg-muted transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>{isBn ? 'ইনভয়েস প্রিন্ট' : 'Print Invoice'}</span>
          </button>

          {onCancelOrder && order.orderStatus === 'placed' && (
            <button
              type="button"
              onClick={onCancelOrder}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-600 shadow-xs hover:bg-red-100 transition-colors"
            >
              <Ban className="h-4 w-4" />
              <span>{isBn ? 'অর্ডার বাতিল করুন' : 'Cancel Order'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left 7 cols Timeline & Items; Right 5 cols Address & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Tracking Timeline & Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tracking Timeline */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-xs">
            <OrderTimeline timeline={order.timeline} isBn={isBn} />
          </section>

          {/* Ordered Products List */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
              {isBn ? 'অর্ডারের পণ্যসমূহ' : 'Ordered Products'} ({order.items.length})
            </h3>
            <div className="divide-y divide-border">
              {order.items.map((item) => (
                <OrderItem key={item.productId} item={item} isBn={isBn} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (5 cols): Address, Payment & Billing Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address Card */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground pb-2 border-b border-border">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{isBn ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}</span>
            </div>
            <div className="text-xs space-y-1 pt-1">
              <p className="font-extrabold text-foreground">{order.shippingAddress.fullName}</p>
              <p className="text-primary font-bold">{order.shippingAddress.phone}</p>
              <p className="text-muted-foreground leading-relaxed">
                {order.shippingAddress.streetAddress}, {order.shippingAddress.area},{' '}
                {order.shippingAddress.district}, {order.shippingAddress.division}
              </p>
            </div>
          </section>

          {/* Payment & Delivery Info */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground pb-2 border-b border-border">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>{isBn ? 'পেমেন্ট ও ডেলিভারি বিবরণ' : 'Payment & Delivery Info'}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[11px] text-muted-foreground">{isBn ? 'পেমেন্ট পদ্ধতি:' : 'Payment Method:'}</p>
                <p className="font-bold text-foreground mt-0.5">
                  {isBn ? order.paymentMethod.nameBn : order.paymentMethod.nameEn}
                </p>
                <span className="inline-block mt-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 uppercase">
                  {order.paymentStatus}
                </span>
              </div>

              <div>
                <p className="text-[11px] text-muted-foreground">{isBn ? 'ডেলিভারি অপশন:' : 'Delivery Method:'}</p>
                <p className="font-bold text-foreground mt-0.5">
                  {isBn ? order.deliveryMethod.nameBn : order.deliveryMethod.nameEn}
                </p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-muted-foreground">
                  {order.estimatedDeliveryDate}
                </span>
              </div>
            </div>
          </section>

          {/* Billing Breakdown */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-foreground pb-2 border-b border-border">
              {isBn ? 'পেমেন্ট সামারি' : 'Billing Breakdown'}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(order.summary.subtotal, isBn ? 'bn' : 'en')}
                </span>
              </div>

              {order.summary.mrpDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{isBn ? 'প্রোডাক্ট ছাড়' : 'MRP Discount'}</span>
                  <span>-{formatPrice(order.summary.mrpDiscount, isBn ? 'bn' : 'en')}</span>
                </div>
              )}

              {order.summary.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{isBn ? 'কুপন ছাড়' : 'Coupon Discount'}</span>
                  <span>-{formatPrice(order.summary.couponDiscount, isBn ? 'bn' : 'en')}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>{isBn ? 'ডেলিভারি ফি' : 'Delivery Fee'}</span>
                <span>
                  {order.summary.deliveryCharge === 0
                    ? 'FREE'
                    : formatPrice(order.summary.deliveryCharge, isBn ? 'bn' : 'en')}
                </span>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-foreground">{isBn ? 'সর্বমোট' : 'Grand Total'}</span>
                <span className="font-black text-primary">
                  {formatPrice(order.summary.grandTotal, isBn ? 'bn' : 'en')}
                </span>
              </div>
            </div>
          </section>

          {/* Printable Invoice Component Preview */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-xs">
            <InvoicePreview order={order} isBn={isBn} />
          </section>
        </div>
      </div>
    </div>
  );
}
