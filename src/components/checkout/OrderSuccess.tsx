'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  PackageCheck,
  Clock,
  MapPin,
  ArrowRight,
  FileText,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { Order } from '@/types/order';
import { formatPrice } from '@/utils/cart';
import { invoiceService } from '@/services/invoice.service';

interface OrderSuccessProps {
  order: Order | null;
  isBn?: boolean;
}

export function OrderSuccess({ order, isBn = true }: OrderSuccessProps) {
  if (!order) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-xl font-bold text-foreground mb-4">
          {isBn ? 'কোনো অর্ডার তথ্য পাওয়া যায়নি' : 'No order details found'}
        </h2>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs"
        >
          {isBn ? 'হোম পেইজে যান' : 'Go to Homepage'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-lg text-center space-y-6"
      >
        {/* Animated Celebration Icon */}
        <div className="relative mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-12 w-12" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute -top-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white shadow-md"
          >
            <Sparkles className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Title */}
        <div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700 border border-emerald-200">
            🎉 {isBn ? 'অর্ডার সফল হয়েছে!' : 'Order Placed Successfully!'}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-foreground font-serif-title">
            {isBn ? 'ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে' : 'Thank You! Your Order has been Received'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            {isBn
              ? 'আমদের অনুমোদিত ফার্মাসিস্ট আপনার অর্ডারটি পরীক্ষা করছেন'
              : 'Our certified pharmacists are currently processing your medicine package.'}
          </p>
        </div>

        {/* Identifiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-muted/30 p-4 border border-border text-left">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">
              {isBn ? 'অর্ডার নম্বর' : 'Order Number'}
            </p>
            <p className="text-sm font-extrabold text-primary">{order.orderNumber}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">
              {isBn ? 'ইনভয়েস নম্বর' : 'Invoice Number'}
            </p>
            <p className="text-xs font-bold text-foreground">{order.invoiceNumber}</p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">
              {isBn ? 'ট্র্যাকিং নম্বর' : 'Tracking Number'}
            </p>
            <p className="text-xs font-bold text-foreground">{order.trackingNumber}</p>
          </div>
        </div>

        {/* Delivery & Address Snippet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          <div className="flex items-start gap-3 rounded-2xl border border-border p-4 bg-background">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                {isBn ? 'আনুমানিক ডেলিভারি সময়' : 'Estimated Delivery'}
              </p>
              <p className="text-sm font-extrabold text-emerald-600 mt-0.5">
                {order.estimatedDeliveryDate}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {isBn ? order.deliveryMethod.nameBn : order.deliveryMethod.nameEn}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-border p-4 bg-background">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                {isBn ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}
              </p>
              <p className="text-xs font-semibold text-foreground mt-0.5 truncate">
                {order.shippingAddress.fullName}
              </p>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {order.shippingAddress.streetAddress}, {order.shippingAddress.area}
              </p>
            </div>
          </div>
        </div>

        {/* Grand Total & Payment Method */}
        <div className="flex items-center justify-between rounded-2xl bg-primary/5 p-4 border border-primary/20 text-left">
          <div>
            <p className="text-xs font-bold text-foreground">{isBn ? 'প্রদেয় মোট মূল্য' : 'Total Amount Paid / Due'}</p>
            <p className="text-[11px] text-muted-foreground">
              {isBn ? 'পেমেন্ট মেথড:' : 'Method:'} {isBn ? order.paymentMethod.nameBn : order.paymentMethod.nameEn}
            </p>
          </div>

          <span className="text-xl font-black text-primary">
            {formatPrice(order.summary.grandTotal, isBn ? 'bn' : 'en')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/orders/${order.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all"
          >
            <PackageCheck className="h-4 w-4" />
            <span>{isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track Order Status'}</span>
          </Link>

          <Link
            href="/orders"
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 px-4 text-xs font-bold text-foreground hover:bg-muted transition-all"
          >
            <FileText className="h-4 w-4" />
            <span>{isBn ? 'সকল অর্ডার তালিকা' : 'View All Orders'}</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 py-3 px-4 text-xs font-bold text-foreground hover:bg-muted transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isBn ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
