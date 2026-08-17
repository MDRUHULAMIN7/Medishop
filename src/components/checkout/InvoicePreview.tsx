'use client';

import React from 'react';
import Image from 'next/image';
import { Download, ShieldCheck, PhoneCall, CheckCircle2, Sparkles, FileText, Printer, Mail, MapPin } from 'lucide-react';
import { Order } from '@/types/order';
import { orderService } from '@/services/order.service';
import { invoiceService } from '@/services/invoice.service';
import { formatPrice } from '@/utils/cart';
import { useBranding } from '@/context/BrandingContext';

interface InvoicePreviewProps {
  order: Order;
  isBn?: boolean;
}

export function InvoicePreview({ order, isBn = true }: InvoicePreviewProps) {
  const { settings } = useBranding();
  const invoiceData = invoiceService.generateInvoiceData(order);

  // Dynamic Site Settings
  const siteName = settings?.general?.siteName || 'mediShop';
  const tagline = settings?.general?.tagline || 'Digital Pharmacy (Verified DGDA #DAR-2026-BD)';
  const contactPhone = settings?.general?.contactPhone || '+880 1742-643763';
  const contactEmail = settings?.general?.contactEmail || 'support@medishop.com.bd';
  const address = settings?.general?.address || 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh';
  const logoLight = settings?.general?.logoLight;

  // Dynamic Theme Colors
  const primaryColor = settings?.branding?.primaryColor || '#1D4ED8';
  const accentColor = settings?.branding?.accentColor || '#F59E0B';

  // Dynamic Legal & Terms
  const invoiceTerms = settings?.legal?.invoiceTerms || 'Goods once sold are non-refundable unless damaged or incorrect. DGDA verified items.';
  const refundPolicyContent = settings?.legal?.refundPolicyContent || 'Returns accepted within 7 days with original seal & invoice receipt.';
  const warrantyPolicyContent = settings?.legal?.warrantyPolicyContent || 'Manufacturer warranty applies where applicable with official invoice.';

  const getStatusBadgeStyle = (status: string) => {
    const s = (status || 'pending').toLowerCase();
    switch (s) {
      case 'paid':
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
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" style={{ color: primaryColor }} />
          <h3 className="text-base font-extrabold text-foreground font-serif-title">
            {isBn ? 'ইনভয়েস প্রাকদর্শন' : 'Invoice Preview'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => invoiceService.downloadInvoice('printable-invoice', invoiceData.invoiceNumber)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground shadow-xs hover:bg-muted transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4 text-muted-foreground" />
            <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
          </button>

          <button
            type="button"
            onClick={() => orderService.downloadInvoicePdf(order.id, invoiceData.invoiceNumber)}
            style={{ backgroundColor: primaryColor }}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-extrabold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>{isBn ? 'ইনভয়েস PDF ডাউনলোড' : 'Download Invoice (PDF)'}</span>
          </button>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div
        id="printable-invoice"
        className="rounded-3xl border border-border bg-background p-6 sm:p-10 shadow-xs space-y-8 print:shadow-none print:border-none print:p-0"
      >
        {/* 1. Header with Brand & DGDA Verified Badge */}
        <div
          className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b-2"
          style={{ borderColor: primaryColor }}
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              {logoLight &&
              !logoLight.includes('undefined') &&
              logoLight !== '/images/logo.png' &&
              logoLight.trim() !== '' && (
                <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-xs border border-primary/20 bg-white shrink-0">
                  <Image
                    src={logoLight}
                    alt={siteName}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
              )}
              <span
                className="font-serif-title text-2xl font-black tracking-tight"
                style={{ color: primaryColor }}
              >
                {siteName}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 uppercase">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                <span>Verified Pharmacy</span>
              </span>
            </div>

            <p className="text-xs font-bold text-muted-foreground">
              {tagline}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <PhoneCall className="h-3 w-3" style={{ color: primaryColor }} />
                <span>Hotline: <strong className="text-foreground">{contactPhone}</strong></span>
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" style={{ color: primaryColor }} />
                <span>Email: <strong className="text-foreground">{contactEmail}</strong></span>
              </span>
            </div>

            {address && (
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 shrink-0" style={{ color: primaryColor }} />
                <span>{address}</span>
              </p>
            )}
          </div>

          <div className="sm:text-right space-y-1">
            <span
              className="inline-block rounded-xl px-3.5 py-1 text-xs font-black uppercase tracking-wider"
              style={{
                backgroundColor: `${primaryColor}15`,
                color: primaryColor,
              }}
            >
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
            <p
              className="text-[11px] font-black uppercase tracking-wider"
              style={{ color: primaryColor }}
            >
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
            <p
              className="text-[11px] font-black uppercase tracking-wider"
              style={{ color: primaryColor }}
            >
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
                            {item.brand || siteName}{unitLabel ? ` (${unitLabel})` : ''}
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
              All items sold are 100% authentic DGDA certified medicines and healthcare products from {siteName}.
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

            <div
              className="p-3 rounded-xl flex justify-between items-center text-white"
              style={{ backgroundColor: primaryColor }}
            >
              <span className="font-black text-xs uppercase tracking-wider">TOTAL:</span>
              <span className="font-black text-lg">
                {formatPrice(invoiceData.summary.grandTotal, isBn ? 'bn' : 'en')}
              </span>
            </div>
          </div>
        </div>

        {/* 5. Invoice Terms & Policy Box (Pushed to bottom near footer) */}
        <div className="border-t border-border pt-6 space-y-2.5 text-xs">
          <p
            className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: primaryColor }}
          >
            <FileText className="h-4 w-4" style={{ color: primaryColor }} />
            <span>{isBn ? 'ইনভয়েস শর্তাবলী ও পলিসি' : 'INVOICE TERMS & POLICIES:'}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] text-muted-foreground">
            <div className="space-y-1">
              <strong className="text-foreground block text-[11px]">
                {isBn ? '• বিক্রয় শর্তাবলী:' : '• Invoice Terms:'}
              </strong>
              <p>{invoiceTerms}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-foreground block text-[11px]">
                {isBn ? '• রিফান্ড পলিসি:' : '• Return & Refund:'}
              </strong>
              <p>{refundPolicyContent}</p>
            </div>
            <div className="space-y-1">
              <strong className="text-foreground block text-[11px]">
                {isBn ? '• ওয়ারেন্টি পলিসি:' : '• Warranty Policy:'}
              </strong>
              <p>{warrantyPolicyContent}</p>
            </div>
          </div>
        </div>

        {/* 6. Professional 3-Column Footer */}
        <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-5 text-center sm:text-left text-[11px]">
          <div>
            <p className="font-extrabold flex items-center gap-1" style={{ color: primaryColor }}>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Authenticity</span>
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              100% authentic medicines & healthcare products.
            </p>
          </div>

          <div>
            <p className="font-extrabold flex items-center gap-1" style={{ color: primaryColor }}>
              <PhoneCall className="h-3.5 w-3.5 text-sky-600 shrink-0" />
              <span>Customer Support</span>
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              Hotline: {contactPhone} | {contactEmail}
            </p>
          </div>

          <div>
            <p className="font-extrabold flex items-center gap-1" style={{ color: primaryColor }}>
              <CheckCircle2 className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <span>Important Notice</span>
            </p>
            <p className="text-muted-foreground text-[10px] mt-0.5">
              Computer-generated tax invoice. No signature required.
            </p>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="pt-3 text-center text-[10px] font-bold" style={{ color: primaryColor }}>
          Thank you for choosing {siteName} — {tagline}
        </div>
      </div>
    </div>
  );
}

