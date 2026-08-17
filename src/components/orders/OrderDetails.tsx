'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Clock,
  MapPin,
  CreditCard,
  Ban,
  Download,
  PackageCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Order } from '@/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderTimeline } from './OrderTimeline';
import { OrderItem } from './OrderItem';
import { formatPrice } from '@/utils/cart';
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
  const [paymentTarget, setPaymentTarget] = useState<'all' | 'shipment1' | 'shipment2'>('all');

  let formattedDate = 'N/A';
  try {
    if (order.createdAt) {
      const d = new Date(order.createdAt);
      if (!Number.isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    }
  } catch {
    // Keep N/A fallback
  }

  const grandTotal = Number(order.summary?.grandTotal || (order as any).grandTotal || 0);
  const subtotal = Number(order.summary?.subtotal || (order as any).subtotal || 0);
  const mrpDiscount = Number(order.summary?.mrpDiscount || (order as any).discountTotal || 0);
  const couponDiscount = Number(order.summary?.couponDiscount || (order as any).couponDiscount || 0);
  const deliveryCharge = Number(order.summary?.deliveryCharge ?? (order as any).deliveryCharge ?? 60);

  const isSplitDelivery = Boolean((order as any).isSplitDelivery);
  const isPreOrder = Boolean(order.isPreOrder || order.items?.some((i: any) => Number(i.preOrderQuantity || 0) > 0 || i.fulfillmentType === 'mixed' || i.fulfillmentType === 'preorder'));

  const shipment1Status = (order as any).shipment1Status || order.orderStatus || 'pending';
  const shipment2Status = (order as any).shipment2Status || (isPreOrder ? 'pending' : 'pending');

  const shipment1PaymentStatus = (order as any).shipment1PaymentStatus || order.paymentStatus || 'pending';
  const shipment2PaymentStatus = (order as any).shipment2PaymentStatus || order.paymentStatus || 'pending';

  const shipment1Total = Number((order as any).shipment1Total || (isSplitDelivery ? Math.round(grandTotal / 2) : grandTotal));
  const shipment2Total = Number((order as any).shipment2Total || (isSplitDelivery ? Math.max(0, grandTotal - shipment1Total) : (isPreOrder ? grandTotal : 0)));

  const isFullPending = order.paymentStatus === 'pending' || order.paymentStatus === 'partially_paid';

  const shippingAddress = order.shippingAddress as any;
  const recipientName =
    shippingAddress?.recipientName ||
    shippingAddress?.fullName ||
    shippingAddress?.name ||
    'Valued Customer';
  const phone = shippingAddress?.phone || 'N/A';
  const addressLine = shippingAddress?.addressLine || shippingAddress?.streetAddress || '';
  const thana = shippingAddress?.thana || shippingAddress?.area || '';
  const district = shippingAddress?.district || 'Dhaka';
  const division = shippingAddress?.division || 'Dhaka';

  const deliveryMethod = (order as any).deliveryMethod || null;
  const shipment1Method = (order as any).shipment1DeliveryMethodDetails || null;
  const shipment2Method = (order as any).shipment2DeliveryMethodDetails || null;

  const deliveryMethodName = isBn
    ? deliveryMethod?.nameBn || deliveryMethod?.nameEn
    : deliveryMethod?.nameEn || deliveryMethod?.nameBn;

  const shipment1Items = (order.items || []).filter((item: any) => {
    return Number(item.availableQuantity ?? item.quantity ?? 1) > 0 && item.fulfillmentType !== 'preorder';
  });

  const shipment2Items = (order.items || []).filter((item: any) => {
    return Number(item.preOrderQuantity || 0) > 0 || item.fulfillmentType === 'preorder' || item.fulfillmentType === 'mixed';
  });

  const handleOpenPayment = (target: 'all' | 'shipment1' | 'shipment2' = 'all') => {
    setPaymentTarget(target);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
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
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
                #{order.orderNumber}
              </h1>
              <OrderStatusBadge status={order.orderStatus} isBn={isBn} />
              {isSplitDelivery && (
                <span className="rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 px-2.5 py-0.5 text-[10px] font-black border border-blue-200">
                  {isBn ? '২ চালানে স্প্লিট ডেলিভারি' : 'Split (2 Shipments)'}
                </span>
              )}
              {isPreOrder && !isSplitDelivery && (
                <span className="rounded-full bg-primary/15 text-primary px-2.5 py-0.5 text-[10px] font-black border border-primary/20">
                  {isBn ? 'প্রি-অর্ডার' : 'Pre-Order'}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 font-medium">
              <Clock className="h-3.5 w-3.5" />
              {isBn ? 'অর্ডারের সময়:' : 'Placed on:'} {formattedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isFullPending && order.orderStatus !== 'cancelled' && (
            <button
              type="button"
              onClick={() => handleOpenPayment('all')}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-black text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer animate-pulse"
            >
              <CreditCard className="h-4 w-4" />
              <span>{isBn ? 'পেমেন্ট করুন' : 'Pay Now'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => orderService.downloadInvoicePdf(order.id, order.orderNumber)}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-primary" />
            <span>{isBn ? 'ইনভয়েস PDF ডাউনলোড' : 'Download Invoice'}</span>
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

      {/* Main Grid: Lifecycles & Items (Left 7 Cols) + Summary & Addresses (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Dual Independent Lifecycles when Split Delivery is active */}
          {isSplitDelivery ? (
            <div className="space-y-6">
              {/* Shipment 1 (In-Stock) Card */}
              <section className="rounded-3xl border border-emerald-200/80 bg-background p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs">
                      ১
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-foreground">
                        {isBn ? '১ম চালান: ইন-স্টক পণ্য' : 'Shipment 1: In-Stock Medicines'}
                      </h3>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        {isBn ? '⚡ দ্রুত ২৪ ঘণ্টায় ডেলিভারি' : '⚡ 24 Hours Express Delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                        shipment1PaymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {shipment1PaymentStatus === 'paid' ? (isBn ? 'পেইড' : 'PAID') : (isBn ? 'আনপেইড' : 'UNPAID')}
                    </span>

                    {shipment1PaymentStatus !== 'paid' && order.orderStatus !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleOpenPayment('shipment1')}
                        className="rounded-xl bg-emerald-600 px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
                      >
                        {isBn ? `পে করুন (${formatPrice(shipment1Total, 'bn')})` : `Pay (${formatPrice(shipment1Total, 'en')})`}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                    {isBn ? '১ম চালানের ট্র্যাকিং অগ্রগতি' : 'Shipment 1 Timeline'}
                  </span>
                  <OrderTimeline status={shipment1Status} isBn={isBn} />
                </div>

                {/* Items in Shipment 1 */}
                <div className="pt-2 border-t border-border/60">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    {isBn ? '১ম চালানের পণ্যসমূহ' : 'Shipment 1 Items'} ({shipment1Items.length})
                  </span>
                  <div className="divide-y divide-border/60">
                    {shipment1Items.map((item: any, idx: number) => (
                      <OrderItem key={'ship1-' + idx} item={item} isBn={isBn} />
                    ))}
                  </div>
                </div>
              </section>

              {/* Shipment 2 (Pre-Order) Card */}
              <section className="rounded-3xl border border-primary/30 bg-background p-5 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary font-bold text-xs">
                      ২
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-foreground">
                        {isBn ? '২য় চালান: প্রি-অর্ডার পণ্য' : 'Shipment 2: Pre-Order Medicines'}
                      </h3>
                      <p className="text-[11px] text-primary font-medium">
                        {isBn ? '📦 ৩-৫ কার্যদিবসে ডেলিভারি' : '📦 3-5 Working Days Delivery'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                        shipment2PaymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {shipment2PaymentStatus === 'paid' ? (isBn ? 'পেইড' : 'PAID') : (isBn ? 'আনপেইড' : 'UNPAID')}
                    </span>

                    {shipment2PaymentStatus !== 'paid' && order.orderStatus !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleOpenPayment('shipment2')}
                        className="rounded-xl bg-primary px-3 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-primary-dark transition-all cursor-pointer"
                      >
                        {isBn ? `পে করুন (${formatPrice(shipment2Total, 'bn')})` : `Pay (${formatPrice(shipment2Total, 'en')})`}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-3">
                    {isBn ? '২য় চালানের প্রি-অর্ডার লাইফসাইকেল ট্র্যাকিং' : 'Pre-Order Lifecycle Timeline'}
                  </span>
                  <OrderTimeline status={shipment2Status} isPreOrder isBn={isBn} />
                </div>

                {/* Items in Shipment 2 */}
                <div className="pt-2 border-t border-border/60">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">
                    {isBn ? '২য় চালানের প্রি-অর্ডার পণ্যসমূহ' : 'Shipment 2 Pre-Order Items'} ({shipment2Items.length})
                  </span>
                  <div className="divide-y divide-border/60">
                    {shipment2Items.map((item: any, idx: number) => (
                      <OrderItem key={'ship2-' + idx} item={item} isBn={isBn} />
                    ))}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            /* Single Shipment Order View */
            <>
              <section className="rounded-2xl border border-border bg-background p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider border-b border-border pb-3">
                  {isPreOrder
                    ? isBn ? 'প্রি-অর্ডার লাইফসাইকেল ট্র্যাকিং' : 'Pre-Order Tracking Timeline'
                    : isBn ? 'অর্ডার ট্র্যাকিং স্ট্যাটাস' : 'Order Tracking Timeline'}
                </h3>
                <OrderTimeline
                  timeline={order.timeline}
                  status={order.orderStatus}
                  isPreOrder={isPreOrder}
                  isBn={isBn}
                />
              </section>

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
            </>
          )}
        </div>

        {/* Right 5 Columns: Shipping Address, Payment & Billing Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Shipping Address */}
          <section className="rounded-2xl border border-border bg-background p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-foreground uppercase tracking-wider pb-2.5 border-b border-border">
              <MapPin className="h-4 w-4 text-rose-600" />
              <span>{isBn ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}</span>
            </div>
            <div className="text-xs space-y-1.5 pt-0.5">
              <p className="font-extrabold text-foreground text-sm">{recipientName}</p>
              <p className="text-sky-600 font-bold flex items-center gap-1">
                <span>{phone}</span>
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {addressLine}
                {addressLine && thana ? ', ' : ''}
                {thana}
                {(addressLine || thana) && district ? ', ' : ''}
                {district}
                {division ? `, ${division}` : ''}
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
                      : order.paymentStatus === 'partially_paid'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  {order.paymentStatus === 'partially_paid'
                    ? (isBn ? 'আংশিক পরিশোধিত' : 'PARTIALLY PAID')
                    : order.paymentStatus || 'PENDING'}
                </span>
              </div>

              <div>
                <p className="text-[11px] text-muted-foreground font-semibold">
                  {isBn ? 'ডেলিভারি ধরন:' : 'Delivery Type:'}
                </p>
                <p className="font-bold text-foreground mt-0.5">
                  {isSplitDelivery
                    ? isBn ? '২ চালানে ডেলিভারি' : 'Split (2 Shipments)'
                    : deliveryMethodName || (isBn ? 'রেগুলার ডেলিভারি' : 'Standard Delivery')}
                </p>
              </div>
            </div>

            {isSplitDelivery && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs space-y-2 mt-2">
                <span className="font-bold text-primary block">
                  {isBn ? '২ চালানের ডেলিভারি সময়সূচি:' : '2-Shipment Schedule:'}
                </span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50/80 border border-emerald-200 p-2 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <span className="font-semibold">{isBn ? '১ম চালান (ইন-স্টক)' : 'Shipment 1 (In-Stock)'}</span>
                    <span className="font-bold">{isBn ? '২৪ ঘণ্টায় ডেলিভারি' : '24 Hours Delivery'}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-primary/10 border border-primary/20 p-2 text-primary">
                    <span className="font-semibold">{isBn ? '২য় চালান (প্রি-অর্ডার)' : 'Shipment 2 (Pre-Order)'}</span>
                    <span className="font-bold">{isBn ? '৩-৫ কার্যদিবসে ডেলিভারি' : '3-5 Working Days'}</span>
                  </div>
                </div>
              </div>
            )}
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
                  {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge, isBn ? 'bn' : 'en')}
                </span>
              </div>

              {/* Split Breakdown Details if applicable */}
              {isSplitDelivery && (
                <div className="rounded-xl bg-muted/40 border border-border/80 p-2.5 space-y-1.5 text-[11px] my-2">
                  <div className="flex justify-between items-center text-foreground font-semibold">
                    <span>{isBn ? '১ম চালানের পরিমাণ (ইন-স্টক):' : 'Shipment 1 Total:'}</span>
                    <span className="text-emerald-700 font-bold">{formatPrice(shipment1Total, isBn ? 'bn' : 'en')}</span>
                  </div>
                  <div className="flex justify-between items-center text-foreground font-semibold">
                    <span>{isBn ? '২য় চালানের পরিমাণ (প্রি-অর্ডার):' : 'Shipment 2 Total:'}</span>
                    <span className="text-primary font-bold">{formatPrice(shipment2Total, isBn ? 'bn' : 'en')}</span>
                  </div>
                </div>
              )}

              <div className="pt-2.5 border-t border-border flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-foreground">
                  {isBn ? 'সর্বমোট প্রদেয়' : 'Grand Total'}
                </span>
                <span className="font-black text-primary text-base">
                  {formatPrice(grandTotal, isBn ? 'bn' : 'en')}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderId={order.id}
          orderNumber={order.orderNumber}
          amount={grandTotal}
          shipment1Total={shipment1Total}
          shipment2Total={shipment2Total}
          shipment1PaymentStatus={shipment1PaymentStatus}
          shipment2PaymentStatus={shipment2PaymentStatus}
          isSplitDelivery={isSplitDelivery}
          isBn={isBn}
          isPreOrder={isPreOrder}
          initialTarget={paymentTarget}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}
