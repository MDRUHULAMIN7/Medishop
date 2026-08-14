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
  Download,
} from 'lucide-react';
import { Order } from '@/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { OrderItem } from './OrderItem';
import { formatPrice } from '@/utils/cart';
import { invoiceService } from '@/services/invoice.service';
import { orderService } from '@/services/order.service';
import { PaymentModal } from './PaymentModal';

interface OrderDetailsProps {
  order: Order;
  onCancelOrder?: () => void;
  isBn?: boolean;
  onRefresh?: () => void;
}

export function OrderDetails({
  order,
  onCancelOrder,
  isBn = true,
  onRefresh,
}: OrderDetailsProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  let formattedDate = 'N/A';
  try {
    if (order.createdAt) {
      const d = new Date(order.createdAt);
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }
  } catch {}

  const isPendingPayment = order.paymentStatus === 'pending' && order.orderStatus !== 'cancelled';
  const grandTotal = Number(order.summary?.grandTotal || (order as any).grandTotal || 0);
  const subtotal = Number(order.summary?.subtotal || (order as any).subtotal || 0);
  const mrpDiscount = Number(order.summary?.mrpDiscount || (order as any).discountTotal || 0);
  const couponDiscount = Number(order.summary?.couponDiscount || (order as any).couponDiscount || 0);
  const deliveryCharge = Number(order.summary?.deliveryCharge ?? (order as any).deliveryCharge ?? 60);

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background hover:bg-muted transition-colors shadow-2xs"
            title={isBn ? 'পিছনে যান' : 'Back to orders'}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                #{order.orderNumber}
              </h1>
              <OrderStatusBadge status={order.orderStatus} isBn={isBn} />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {isBn ? 'অর্ডারের সময়:' : 'Placed on:'} {formattedDate}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pay Now Button if Payment Pending */}
          {isPendingPayment && (
            <button
              type="button"
              onClick={() => setShowPaymentModal(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-black text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer animate-pulse"
            >
              <CreditCard className="h-4 w-4" />
              <span>{isBn ? 'পেমেন্ট করুন (Pay Now)' : 'Pay Now'}</span>
            </button>
          )}

          {/* Download Invoice (PDF) Button */}
          <button
            type="button"
            onClick={() => orderService.downloadInvoicePdf(order.id, order.orderNumber)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-primary" />
            <span>{isBn ? 'ইনভয়েস PDF ডাউনলোড' : 'Download Invoice (PDF)'}</span>
          </button>

          {onCancelOrder && order.orderStatus === 'pending' && (
            <button
              type="button"
              onClick={onCancelOrder}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 text-xs font-bold text-red-600 shadow-2xs hover:bg-red-100 transition-colors cursor-pointer"
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
          <section className="rounded-2xl border border-border bg-background p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider border-b border-border pb-3">
              {isBn ? 'অর্ডার ট্র্যাকিং স্ট্যাটাস' : 'Order Tracking Timeline'}
            </h3>
            <OrderTimeline timeline={order.timeline} isBn={isBn} />
          </section>

          {/* Ordered Products List */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider pb-3 border-b border-border">
              {isBn ? 'অর্ডারের পণ্যসমূহ' : 'Ordered Products'} ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-border/60">
              {order.items?.map((item) => (
                <OrderItem key={item.productId} item={item} isBn={isBn} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (5 cols): Address, Payment & Billing Summary */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address Card */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-foreground uppercase tracking-wider pb-2.5 border-b border-border">
              <MapPin className="h-4 w-4 text-rose-600" />
              <span>{isBn ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}</span>
            </div>
            <div className="text-xs space-y-1.5 pt-0.5">
              <p className="font-extrabold text-foreground text-sm">
                {order.shippingAddress?.fullName || 'Valued Customer'}
              </p>
              <p className="text-sky-600 font-bold flex items-center gap-1">
                <span>{order.shippingAddress?.phone || 'N/A'}</span>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {order.shippingAddress?.streetAddress}, {order.shippingAddress?.area},{' '}
                {order.shippingAddress?.district}, {order.shippingAddress?.division}
              </p>
            </div>
          </section>

          {/* Payment & Delivery Info */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-foreground uppercase tracking-wider pb-2.5 border-b border-border">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>{isBn ? 'পেমেন্ট ও ডেলিভারি বিবরণ' : 'Payment & Delivery Info'}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[11px] text-muted-foreground font-semibold">
                  {isBn ? 'পেমেন্ট পদ্ধতি:' : 'Payment Method:'}
                </p>
                <p className="font-bold text-foreground mt-0.5">
                  {isBn ? order.paymentMethod?.nameBn : order.paymentMethod?.nameEn}
                </p>
                <span
                  className={`inline-block mt-1.5 rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                    order.paymentStatus === 'paid'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {order.paymentStatus || 'PENDING'}
                </span>
              </div>

              <div>
                <p className="text-[11px] text-muted-foreground font-semibold">
                  {isBn ? 'ডেলিভারি অপশন:' : 'Delivery Method:'}
                </p>
                <p className="font-bold text-foreground mt-0.5">
                  {isBn ? order.deliveryMethod?.nameBn : order.deliveryMethod?.nameEn}
                </p>
                <span className="inline-block mt-1.5 text-[11px] font-semibold text-muted-foreground">
                  {order.estimatedDeliveryDate || '2-3 Working Days'}
                </span>
              </div>
            </div>
          </section>

          {/* Billing Breakdown */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider pb-2.5 border-b border-border">
              {isBn ? 'পেমেন্ট সামারি' : 'Billing Breakdown'}
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(subtotal, isBn ? 'bn' : 'en')}
                </span>
              </div>

              {mrpDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{isBn ? 'প্রোডাক্ট ছাড়' : 'MRP Discount'}</span>
                  <span>-{formatPrice(mrpDiscount, isBn ? 'bn' : 'en')}</span>
                </div>
              )}

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{isBn ? 'কুপন ছাড়' : 'Coupon Discount'}</span>
                  <span>-{formatPrice(couponDiscount, isBn ? 'bn' : 'en')}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>{isBn ? 'ডেলিভারি ফি' : 'Delivery Fee'}</span>
                <span className="font-semibold text-foreground">
                  {deliveryCharge === 0
                    ? 'FREE'
                    : formatPrice(deliveryCharge, isBn ? 'bn' : 'en')}
                </span>
              </div>

              <div className="pt-2.5 border-t border-border flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-foreground">{isBn ? 'সর্বমোট প্রদেয়' : 'Grand Total'}</span>
                <span className="font-black text-primary text-base">
                  {formatPrice(grandTotal, isBn ? 'bn' : 'en')}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderId={order.id}
          orderNumber={order.orderNumber}
          amount={grandTotal}
          isBn={isBn}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}
