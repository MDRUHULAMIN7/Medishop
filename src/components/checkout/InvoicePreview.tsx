'use client';

import React from 'react';
import { Printer, ShieldCheck, Download, Pill } from 'lucide-react';
import { Order } from '@/types/order';
import { invoiceService } from '@/services/invoice.service';
import { formatPrice } from '@/utils/cart';

interface InvoicePreviewProps {
  order: Order;
  isBn?: boolean;
}

export function InvoicePreview({ order, isBn = true }: InvoicePreviewProps) {
  const invoiceData = invoiceService.generateInvoiceData(order);

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <h3 className="text-base font-bold text-foreground font-serif-title">
          {isBn ? 'ইনভয়েস প্রাকদর্শন' : 'Invoice Preview'}
        </h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => invoiceService.printInvoice()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>{isBn ? 'ইনভয়েস প্রিন্ট করুন' : 'Print Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="rounded-3xl border border-border bg-background p-6 sm:p-8 shadow-sm space-y-6 print:shadow-none print:border-none print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
                m
              </div>
              <span className="font-serif-title text-2xl font-bold text-primary">
                mediShop
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              DGDA Licensed Digital Pharmacy (#DAR-2026-BD)
            </p>
            <p className="text-xs text-muted-foreground">
              Hotline: 16780 | Email: support@medishop.com.bd
            </p>
          </div>

          <div className="text-right">
            <span className="inline-block rounded-xl bg-primary/10 px-3 py-1 text-xs font-black text-primary uppercase tracking-wider mb-1">
              {isBn ? 'ক্যাশ ইনভয়েস / রশিদ' : 'Tax Invoice'}
            </span>
            <p className="text-sm font-extrabold text-foreground">{invoiceData.invoiceNumber}</p>
            <p className="text-xs text-muted-foreground">Order #: {invoiceData.orderNumber}</p>
            <p className="text-xs text-muted-foreground">Date: {invoiceData.issueDate}</p>
          </div>
        </div>

        {/* Customer & Shipping Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-border text-xs">
          <div>
            <p className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-1">
              {isBn ? 'গ্রাহকের বিবরণ:' : 'Billed & Shipped To:'}
            </p>
            <p className="font-extrabold text-foreground text-sm">{invoiceData.customerName}</p>
            <p className="text-muted-foreground font-semibold">Phone: {invoiceData.customerPhone}</p>
            <p className="text-muted-foreground mt-1">{invoiceData.customerAddress}</p>
          </div>

          <div className="sm:text-right">
            <p className="font-bold text-foreground uppercase tracking-wider text-[11px] mb-1">
              {isBn ? 'পেমেন্ট ও ডেলিভারি বিবরণ:' : 'Payment & Delivery Info:'}
            </p>
            <p className="text-muted-foreground">
              Payment Method: <span className="font-bold text-foreground">{invoiceData.paymentMethodName}</span>
            </p>
            <p className="text-muted-foreground">
              Payment Status:{' '}
              <span className="font-bold text-emerald-600 uppercase">{invoiceData.paymentStatus}</span>
            </p>
            <p className="text-muted-foreground">
              Delivery Type: <span className="font-bold text-foreground">{order.deliveryMethod.nameEn}</span>
            </p>
          </div>
        </div>

        {/* Item Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="py-2.5 px-3 font-bold text-foreground">#</th>
                <th className="py-2.5 px-3 font-bold text-foreground">{isBn ? 'পণ্য' : 'Item Description'}</th>
                <th className="py-2.5 px-3 font-bold text-foreground text-right">{isBn ? 'একক মূল্য' : 'Unit Price'}</th>
                <th className="py-2.5 px-3 font-bold text-foreground text-center">{isBn ? 'পরিমাণ' : 'Qty'}</th>
                <th className="py-2.5 px-3 font-bold text-foreground text-right">{isBn ? 'মোট' : 'Total'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {invoiceData.items.map((item, idx) => (
                <tr key={item.productId}>
                  <td className="py-3 px-3 text-muted-foreground font-semibold">{idx + 1}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-foreground">{isBn ? item.nameBn : item.nameEn}</p>
                    <p className="text-[10px] text-muted-foreground">{item.brand} ({item.unit})</p>
                  </td>
                  <td className="py-3 px-3 text-right font-medium">
                    {formatPrice(item.sellingPrice, isBn ? 'bn' : 'en')}
                  </td>
                  <td className="py-3 px-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-foreground">
                    {formatPrice(item.sellingPrice * item.quantity, isBn ? 'bn' : 'en')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-border text-xs">
          <div className="max-w-xs space-y-1 text-muted-foreground">
            <p className="font-bold text-foreground mb-1">{isBn ? 'শর্তাবলী & তথ্য:' : 'Terms & Conditions:'}</p>
            <p>1. All products sold are 100% authentic DGDA certified.</p>
            <p>2. Keep this tax invoice for return or claim guarantees.</p>
          </div>

          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal:</span>
              <span className="font-semibold text-foreground">
                {formatPrice(invoiceData.summary.subtotal, isBn ? 'bn' : 'en')}
              </span>
            </div>

            {invoiceData.summary.mrpDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>MRP Discount:</span>
                <span>-{formatPrice(invoiceData.summary.mrpDiscount, isBn ? 'bn' : 'en')}</span>
              </div>
            )}

            {invoiceData.summary.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon Discount:</span>
                <span>-{formatPrice(invoiceData.summary.couponDiscount, isBn ? 'bn' : 'en')}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee:</span>
              <span>
                {invoiceData.summary.deliveryCharge === 0
                  ? 'FREE'
                  : formatPrice(invoiceData.summary.deliveryCharge, isBn ? 'bn' : 'en')}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>VAT / Tax (Included):</span>
              <span>৳0</span>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-baseline text-sm">
              <span className="font-extrabold text-foreground">Grand Total:</span>
              <span className="font-black text-primary">
                {formatPrice(invoiceData.summary.grandTotal, isBn ? 'bn' : 'en')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-6 border-t border-border text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Computer-generated invoice. No physical signature required. Thank you for choosing mediShop.</span>
        </div>
      </div>
    </div>
  );
}
