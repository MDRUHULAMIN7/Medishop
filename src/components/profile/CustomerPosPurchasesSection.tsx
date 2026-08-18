'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { posService, PosSaleRecord } from '@/services/pos.service';
import {
  Store,
  Receipt,
  Search,
  Printer,
  Calendar,
  CreditCard,
  Banknote,
  DollarSign,
  Package,
  Loader2,
  CheckCircle2,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

interface CustomerPosPurchasesSectionProps {
  isBn?: boolean;
}

export function CustomerPosPurchasesSection({ isBn = true }: CustomerPosPurchasesSectionProps) {
  const [purchases, setPurchases] = useState<PosSaleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<PosSaleRecord | null>(null);

  const fetchPurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await posService.getMyPurchases();
      setPurchases(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load in-store purchases:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const filteredPurchases = purchases.filter((sale) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      sale.invoiceNumber.toLowerCase().includes(q) ||
      sale.items.some((item) => item.productName?.toLowerCase().includes(q))
    );
  });

  const totalSpent = purchases.reduce((acc, curr) => acc + (curr.status === 'completed' ? curr.grandTotal : 0), 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3 rounded-3xl border border-border bg-background p-12 text-center shadow-xs">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-muted-foreground">
          {isBn ? 'ফার্মেসি কাউন্টার ক্রয়ের তথ্য লোড হচ্ছে...' : 'Loading pharmacy counter purchase history...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* 1. Header Banner & Metrics */}
      <div className="rounded-3xl border border-border bg-gradient-to-br from-background to-muted/20 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {isBn ? 'ইন-স্টোর ও কাউন্টার পারচেজ' : 'In-Store & Counter Purchases'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-foreground font-serif-title mt-1">
            {isBn ? 'ফার্মেসি কাউন্টার থেকে ক্রয়কৃত ওষুধের তালিকা' : 'Pharmacy Counter Invoices & Receipts'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'ফার্মেসিতে সরাসরি গিয়ে কেনা ওষুধের মেমো, পণ্যের বিবরণ ও প্রিন্ট কপি দেখুন।'
              : 'View physical store purchase receipts, dispensed medicines and print copies.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-border bg-background px-3 py-2 text-right shadow-2xs">
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">
              {isBn ? 'মোট মেমো' : 'Total Invoices'}
            </span>
            <strong className="text-base font-black text-foreground">{purchases.length}</strong>
          </div>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 px-3 py-2 text-right shadow-2xs">
            <span className="text-[10px] font-bold text-primary block uppercase">
              {isBn ? 'মোট খরচ' : 'Total Spent'}
            </span>
            <strong className="text-base font-black text-primary">৳{totalSpent.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      {purchases.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'ইনভয়েস নম্বর বা ওষুধের নাম দিয়ে খুঁজুন...' : 'Search by invoice # or medicine name...'}
            className="w-full rounded-2xl border border-border bg-background py-2 pl-10 pr-4 text-xs font-semibold text-foreground shadow-2xs focus:border-primary focus:outline-hidden"
          />
        </div>
      )}

      {/* 3. Empty State */}
      {purchases.length === 0 ? (
        <div className="flex min-h-[340px] flex-col items-center justify-center rounded-3xl border border-border bg-background p-10 text-center shadow-xs space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Receipt className="h-8 w-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="text-base font-black text-foreground font-serif-title">
              {isBn ? 'কোনো কাউন্টার ক্রয় পাওয়া যায়নি' : 'No in-store purchases found'}
            </h4>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'ফার্মেসি কাউন্টারে ওষুধ কেনার সময় আপনার ফোন নম্বর বা অ্যাকাউন্ট জানালে আপনার সমস্ত মেমো এখানে স্বয়ংক্রিয়ভাবে যুক্ত হবে।'
                : 'Whenever you purchase medicines at our physical pharmacy counter, provide your registered phone number to automatically save receipts here.'}
            </p>
          </div>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="rounded-3xl border border-border bg-background p-8 text-center text-xs font-bold text-muted-foreground">
          {isBn ? 'সার্চের সাথে মিল রেখে কোনো ইনভয়েস পাওয়া যায়নি' : 'No counter invoices matching your search.'}
        </div>
      ) : (
        /* 4. Purchases List Cards */
        <div className="space-y-4">
          {filteredPurchases.map((sale) => (
            <div
              key={sale._id || sale.id || sale.invoiceNumber}
              className="rounded-3xl border border-border bg-background p-5 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              {/* Card Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-foreground">
                      #{sale.invoiceNumber}
                    </span>
                    <span className="text-[10px] uppercase font-black bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                      {sale.paymentMethod}
                    </span>
                    {sale.status === 'completed' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-600 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        {isBn ? 'সফল' : 'Paid & Completed'}
                      </span>
                    ) : (
                      <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-black text-rose-600 border border-rose-500/20">
                        {isBn ? 'বাতিল' : 'Voided'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(sale.createdAt).toLocaleString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Store className="h-3.5 w-3.5" />
                      {sale.store?.name || 'Central Pharmacy Counter'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                      {isBn ? 'পরিশোধিত মূল্য' : 'Grand Total'}
                    </span>
                    <strong className="text-lg font-black text-primary">৳{sale.grandTotal.toFixed(2)}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedInvoice(sale)}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-muted/20 px-3.5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer shadow-2xs shrink-0"
                  >
                    <Printer className="h-3.5 w-3.5 text-primary" />
                    <span>{isBn ? 'রিসিপ্ট দেখুন' : 'View Receipt'}</span>
                  </button>
                </div>
              </div>

              {/* Items Dispensed List */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground block">
                  {isBn ? 'ওষুধ ও পণ্যের তালিকা:' : 'Purchased Medicines & Items:'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {sale.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="p-2.5 rounded-2xl border border-border bg-muted/15 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-bold text-foreground truncate">{item.productName}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">
                          {item.quantity} units • ৳{item.unitPrice.toFixed(2)}/unit
                        </p>
                      </div>
                      <span className="font-black text-foreground shrink-0">৳{item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Printable Thermal Cash Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-black text-sm font-serif-title">{isBn ? 'ফার্মেসি ক্যাশ মেমো' : 'Pharmacy Cash Receipt'}</h3>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-border bg-white text-slate-900 space-y-3">
              <div className="text-center space-y-0.5">
                <h2 className="text-lg font-black tracking-tight">mediShop Pharmacy</h2>
                <p className="text-[10px] text-slate-600">Central Pharmacy Counter • Hotline: 16780</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2 text-[11px] space-y-0.5">
                <p>
                  <strong>Invoice:</strong> {selectedInvoice.invoiceNumber}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Customer:</strong> {selectedInvoice.customerName || 'Registered Customer'}
                </p>
                {selectedInvoice.customerPhone && (
                  <p>
                    <strong>Phone:</strong> {selectedInvoice.customerPhone}
                  </p>
                )}
                {selectedInvoice.customerEmail && (
                  <p>
                    <strong>Email:</strong> {selectedInvoice.customerEmail}
                  </p>
                )}
                {(selectedInvoice.customerAddress || selectedInvoice.customerUser?.addresses?.[0]?.address) && (
                  <p>
                    <strong>Address:</strong>{' '}
                    {selectedInvoice.customerAddress ||
                      `${selectedInvoice.customerUser?.addresses?.[0]?.address || ''}, ${
                        selectedInvoice.customerUser?.addresses?.[0]?.district || ''
                      }`}
                  </p>
                )}
                <p className="pt-1">
                  <strong>Payment Method:</strong> {selectedInvoice.paymentMethod?.toUpperCase()}
                </p>
              </div>

              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoice.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-semibold">{item.productName}</td>
                      <td className="py-1 text-center">{item.quantity}</td>
                      <td className="py-1 text-right">৳{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-0.5 text-right font-semibold">
                <p>Subtotal: ৳{selectedInvoice.subtotal?.toFixed(2)}</p>
                {selectedInvoice.discountAmount > 0 && <p>Discount: -৳{selectedInvoice.discountAmount?.toFixed(2)}</p>}
                <p className="text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  Grand Total: ৳{selectedInvoice.grandTotal?.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-2xl border border-border bg-background py-3 font-bold text-foreground shadow-xs hover:bg-muted flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Printer className="h-4 w-4 text-primary" />
                <span>{isBn ? 'প্রিন্ট মেমো' : 'Print Receipt'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const printWin = window.open('', '_blank');
                  if (!printWin) {
                    window.print();
                    return;
                  }
                  const html = `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>${selectedInvoice.invoiceNumber}.pdf</title>
                        <style>
                          body { font-family: monospace; font-size: 12px; margin: 20px; color: #0f172a; }
                          .box { max-width: 360px; margin: 0 auto; border: 1px dashed #cbd5e1; padding: 15px; border-radius: 8px; }
                          .text-center { text-align: center; }
                          .divider { border-top: 1px dashed #cbd5e1; margin: 8px 0; }
                          .row { display: flex; justify-content: space-between; margin: 3px 0; }
                          table { width: 100%; border-collapse: collapse; margin: 8px 0; }
                          th { text-align: left; border-bottom: 1px solid #cbd5e1; padding: 4px 0; font-size: 11px; }
                          td { padding: 4px 0; font-size: 11px; }
                          .text-right { text-align: right; }
                          .text-center { text-align: center; }
                          .total { font-size: 14px; font-weight: bold; border-top: 1px solid #e2e8f0; padding-top: 5px; margin-top: 5px; }
                        </style>
                      </head>
                      <body>
                        <div class="box">
                          <div class="text-center">
                            <h2 style="margin:0;font-size:18px;">mediShop Pharmacy</h2>
                            <p style="margin:2px 0 0;font-size:10px;color:#64748b;">Central Pharmacy Counter • Hotline: 16780</p>
                          </div>
                          <div class="divider"></div>
                          <div class="row"><span><strong>Invoice:</strong></span><span>${selectedInvoice.invoiceNumber}</span></div>
                          <div class="row"><span><strong>Date:</strong></span><span>${new Date(selectedInvoice.createdAt).toLocaleString()}</span></div>
                          <div class="row"><span><strong>Customer:</strong></span><span>${selectedInvoice.customerName || 'Registered Customer'}</span></div>
                          ${selectedInvoice.customerPhone ? `<div class="row"><span><strong>Phone:</strong></span><span>${selectedInvoice.customerPhone}</span></div>` : ''}
                          ${selectedInvoice.customerEmail ? `<div class="row"><span><strong>Email:</strong></span><span>${selectedInvoice.customerEmail}</span></div>` : ''}
                          ${selectedInvoice.customerAddress ? `<div class="row"><span><strong>Address:</strong></span><span>${selectedInvoice.customerAddress}</span></div>` : ''}
                          <div class="row"><span><strong>Payment:</strong></span><span>${selectedInvoice.paymentMethod?.toUpperCase()}</span></div>
                          <div class="divider"></div>
                          <table>
                            <thead>
                              <tr>
                                <th>Item</th>
                                <th class="text-center">Qty</th>
                                <th class="text-right">Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${selectedInvoice.items?.map((i) => `
                                <tr>
                                  <td>${i.productName}</td>
                                  <td class="text-center">${i.quantity}</td>
                                  <td class="text-right">৳${i.totalPrice.toFixed(2)}</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                          <div class="divider"></div>
                          <div class="row"><span>Subtotal:</span><span>৳${selectedInvoice.subtotal?.toFixed(2)}</span></div>
                          ${selectedInvoice.discountAmount > 0 ? `<div class="row"><span>Discount:</span><span>-৳${selectedInvoice.discountAmount?.toFixed(2)}</span></div>` : ''}
                          <div class="row total"><span>Grand Total:</span><span>৳${selectedInvoice.grandTotal?.toFixed(2)}</span></div>
                          <div class="row"><span>Paid Amount:</span><span>৳${selectedInvoice.paidAmount?.toFixed(2)}</span></div>
                          ${selectedInvoice.changeAmount > 0 ? `<div class="row"><span>Change:</span><span>৳${selectedInvoice.changeAmount?.toFixed(2)}</span></div>` : ''}
                        </div>
                        <script>
                          window.onload = function() { window.print(); };
                        </script>
                      </body>
                    </html>
                  `;
                  printWin.document.write(html);
                  printWin.document.close();
                }}
                className="rounded-2xl bg-primary py-3 font-extrabold text-white shadow-md hover:bg-primary-dark flex items-center justify-center gap-1.5 cursor-pointer text-xs"
              >
                <Download className="h-4 w-4" />
                <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
