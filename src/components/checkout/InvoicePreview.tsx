'use client';

import React from 'react';
import { Download, ShieldCheck, PhoneCall, CheckCircle2, Sparkles, FileText } from 'lucide-react';
import { Order } from '@/types/order';
import { orderService } from '@/services/order.service';
import { invoiceService } from '@/services/invoice.service';
import { formatPrice } from '@/utils/cart';

interface InvoicePreviewProps {
  order: Order;
  isBn?: boolean;
}

export function InvoicePreview({ order, isBn = true }: InvoicePreviewProps) {
  const invoiceData = invoiceService.generateInvoiceData(order);

  const getStatusBadgeStyle = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-base font-extrabold text-foreground font-serif-title">
            {isBn ? 'ইনভয়েস প্রাকদর্শন' : 'Invoice Preview'}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => orderService.downloadInvoicePdf(order.id, invoiceData.invoiceNumber)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-extrabold text-white shadow-md hover:bg-primary-dark transition-all cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>{isBn ? 'ইনভয়েস PDF ডাউনলোড' : 'Download Invoice (PDF)'}</span>
        </button>
      </div>

      {/* Printable Invoice Container */}
      <div
        id="printable-invoice"
        className="rounded-3xl border border-border bg-background p-6 sm:p-10 shadow-xs space-y-8 print:shadow-none print:border-none print:p-0"
      >
        {/* 1. Header with Brand & DGDA Verified Badge */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b-2 border-primary">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-serif-title text-2xl font-black text-primary tracking-tight">
                mediShop
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 uppercase">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Digital Pharmacy</span>
              </span>
            </div>
            <p className="text-xs font-bold text-muted-foreground">
              DGDA Licensed Pharmacy <span className="text-foreground">(#DAR-2026-BD)</span>
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Hotline: <strong className="text-foreground">16780</strong> | Email: <strong className="text-foreground">support@medishop.com.bd</strong>
            </p>
          </div>

          <div className="sm:text-right">
            <span className="inline-block rounded-xl bg-primary/10 px-3.5 py-1 text-xs font-black text-primary uppercase tracking-wider mb-1.5">
              INVOICE
            </span>
            <p className="text-sm font-black text-foreground">Invoice No: {invoiceData.invoiceNumber}</p>
            <p className="text-xs text-muted-foreground font-semibold">Order No: #{invoiceData.orderNumber}</p>
            <p className="text-xs text-muted-foreground">Issue Date: {invoiceData.issueDate}</p>
          </div>
        </div>

        {/* 2. Customer & Order Info Side-by-Side (Clean BORDERLESS Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          {/* Bill To Info */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-black text-primary uppercase tracking-wider">
              {isBn ? 'গ্রাহকের বিবরণ (BILL TO / SHIP TO):' : 'BILL TO / SHIP TO:'}
            </p>
            <p className="text-sm font-extrabold text-foreground">{invoiceData.customerName}</p>
            <p className="text-muted-foreground font-bold">
              Phone: <span className="text-sky-600">{invoiceData.customerPhone}</span>
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Address: {invoiceData.customerAddress}
            </p>
          </div>

          {/* Order & Payment Info */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-black text-primary uppercase tracking-wider">
              {isBn ? 'অর্ডার ও পেমেন্ট বিবরণ:' : 'ORDER & PAYMENT:'}
            </p>
            <p className="text-muted-foreground">
              Payment Method: <strong className="text-foreground uppercase">{invoiceData.paymentMethodName}</strong>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Payment Status:</span>
              <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase border ${getStatusBadgeStyle(invoiceData.paymentStatus)}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span>{invoiceData.paymentStatus}</span>
              </span>
            </div>
            <p className="text-muted-foreground">
              Delivery Partner: <strong className="text-foreground">Express Home Delivery</strong>
            </p>
          </div>
        </div>

        {/* 3. Product Table with Thumbnails */}
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-extrabold uppercase text-muted-foreground tracking-wider">
                <th className="py-3.5 px-4 w-10">#</th>
                <th className="py-3.5 px-4">{isBn ? 'পণ্য সমুহ' : 'Item Description'}</th>
                <th className="py-3.5 px-4 text-right">{isBn ? 'একক মূল্য' : 'Unit Price'}</th>
                <th className="py-3.5 px-4 text-center">{isBn ? 'পরিমাণ' : 'Qty'}</th>
                <th className="py-3.5 px-4 text-right">{isBn ? 'মোট' : 'Total (BDT)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {invoiceData.items.map((item: any, idx: number) => {
                const unitPrice = Number(item.effectiveUnitPrice ?? item.unitPrice ?? item.sellingPrice ?? item.price ?? 0);
                const qty = Number(item.quantity || 1);
                const totalPrice = Number(item.totalPrice ?? (unitPrice * qty));
                const unitLabel = item.unitType || item.unit || '';

                return (
                  <tr key={item.productId || idx} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 px-4 text-muted-foreground font-bold">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 object-cover rounded-lg border border-border shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg border border-border bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0">
                            MED
                          </div>
                        )}
                        <div>
                          <p className="font-extrabold text-foreground">{isBn ? item.nameBn || item.name : item.nameEn || item.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium">
                            {item.brand || 'MediShop'}{unitLabel ? ` (${unitLabel})` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {formatPrice(unitPrice, isBn ? 'bn' : 'en')}
                    </td>
                    <td className="py-3.5 px-4 text-center font-extrabold">{qty}</td>
                    <td className="py-3.5 px-4 text-right font-black text-foreground">
                      {formatPrice(totalPrice, isBn ? 'bn' : 'en')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Financial Summary Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2 text-xs">
          <div className="max-w-xs space-y-2 text-muted-foreground">
            <p className="font-extrabold text-foreground uppercase tracking-wider text-[11px]">
              {isBn ? 'লাইসেন্স & গ্যারান্টি:' : 'Authenticity Guarantee:'}
            </p>
            <p className="leading-relaxed text-[11px]">
              All items sold are 100% authentic DGDA certified medicines and healthcare products.
            </p>
          </div>

          <div className="w-full sm:w-80 space-y-2.5 rounded-2xl border border-border bg-background p-5">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Subtotal:</span>
              <span className="font-bold text-foreground">
                {formatPrice(invoiceData.summary.subtotal, isBn ? 'bn' : 'en')}
              </span>
            </div>

            {invoiceData.summary.mrpDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>MRP Discount:</span>
                <span>-{formatPrice(invoiceData.summary.mrpDiscount, isBn ? 'bn' : 'en')}</span>
              </div>
            )}

            {invoiceData.summary.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Coupon Discount:</span>
                <span>-{formatPrice(invoiceData.summary.couponDiscount, isBn ? 'bn' : 'en')}</span>
              </div>
            )}

            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Delivery Charge:</span>
              <span className="font-bold text-foreground">
                {invoiceData.summary.deliveryCharge === 0
                  ? 'FREE'
                  : formatPrice(invoiceData.summary.deliveryCharge, isBn ? 'bn' : 'en')}
              </span>
            </div>

            <div className="pt-2.5 border-t border-border flex justify-between items-baseline">
              <span className="font-black text-foreground text-sm">TOTAL:</span>
              <span className="font-black text-primary text-xl">
                {formatPrice(invoiceData.summary.grandTotal, isBn ? 'bn' : 'en')}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Invoice Terms & Policy Box (Pushed to bottom near footer) */}
        <div className="border-t border-border pt-6 space-y-2.5 text-xs">
          <p className="text-[11px] font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-primary" />
            <span>{isBn ? 'ইনভয়েস শর্তাবলী ও পলিসি' : 'INVOICE TERMS & POLICIES:'}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-muted-foreground">
            <div className="space-y-1">
              <strong className="text-foreground block text-[11px]">
                {isBn ? '• বিক্রয় শর্তাবলী:' : '• Invoice Terms:'}
              </strong>
              <p>Goods once sold are non-refundable unless damaged or incorrect. DGDA verified items.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-foreground block text-[11px]">
                {isBn ? '• রিফান্ড পলিসি:' : '• Return & Refund:'}
              </strong>
              <p>Returns accepted within 7 days with original seal & invoice receipt.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-foreground block text-[11px]">
                {isBn ? '• ওয়ারেন্টি পলিসি:' : '• Warranty Policy:'}
              </strong>
              <p>Manufacturer warranty applies where applicable with official invoice.</p>
            </div>
          </div>
        </div>

        {/* 6. Professional 3-Column Footer */}
        <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-5 text-center sm:text-left text-[11px]">
          <div>
            <p className="font-extrabold text-primary flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Authenticity</span>
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              100% authentic medicines & healthcare products.
            </p>
          </div>

          <div>
            <p className="font-extrabold text-primary flex items-center gap-1">
              <PhoneCall className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span>Customer Support</span>
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              Hotline: 16780 | support@medishop.com.bd
            </p>
          </div>

          <div>
            <p className="font-extrabold text-primary flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Important Notice</span>
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              Computer-generated tax invoice. No signature required.
            </p>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="pt-3 text-center text-[10px] font-bold text-primary">
          Thank you for choosing mediShop — Your Trusted Digital Pharmacy.
        </div>
      </div>
    </div>
  );
}
