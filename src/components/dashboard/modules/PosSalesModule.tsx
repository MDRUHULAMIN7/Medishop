'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  X,
  Loader2,
  History,
  RotateCcw,
  CheckCircle2,
  Pill,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProductService, Product } from '@/services/product.service';
import { PosService, PosSaleRecord } from '@/services/pos.service';

interface PosSalesModuleProps {
  isBn?: boolean;
}

interface CartPosItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export function PosSalesModule({ isBn = true }: PosSalesModuleProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [search, setSearch] = useState('');

  // POS Cart State
  const [cartItems, setCartItems] = useState<CartPosItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bkash' | 'nagad'>('cash');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [submittingSale, setSubmittingSale] = useState(false);

  // Completed Invoice Modal state
  const [completedInvoice, setCompletedInvoice] = useState<PosSaleRecord | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Sales History Drawer state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [posSalesHistory, setPosSalesHistory] = useState<PosSaleRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await ProductService.getProducts({ search: search || undefined, limit: 30 });
      setProducts(res.products || []);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ওষুধ ক্যাটালগ লোড করতে ব্যর্থ হয়েছে' : 'Failed to load medicine catalog'));
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { product, quantity: 1, unitPrice: product.price }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const grandTotal = Math.max(0, subtotal - discountAmount);
  const changeAmount = Math.max(0, paidAmount - grandTotal);

  const handleCheckoutPOS = async () => {
    if (cartItems.length === 0) {
      toast.error(isBn ? 'কাউন্টার মেমো কার্ট খালি' : 'POS sales cart is empty');
      return;
    }

    const effectivePaid = paidAmount > 0 ? paidAmount : grandTotal;

    try {
      setSubmittingSale(true);
      const saleRecord = await PosService.processPosSale({
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        paidAmount: effectivePaid,
        paymentMethod,
        discountAmount,
      });

      toast.success(
        isBn
          ? `৳${saleRecord.grandTotal.toFixed(2)} টাকার পজ বিক্রি সম্পূর্ণ হয়েছে! মেমো ইনভয়েস: ${saleRecord.invoiceNumber}`
          : `POS sale completed! Invoice: ${saleRecord.invoiceNumber}`
      );

      setCompletedInvoice(saleRecord);
      setIsReceiptModalOpen(true);

      // Clear Cart
      setCartItems([]);
      setCustomerName('');
      setCustomerPhone('');
      setDiscountAmount(0);
      setPaidAmount(0);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'পজ বিক্রয় সম্পন্ন করা যায়নি' : 'Failed to process POS sale'));
    } finally {
      setSubmittingSale(false);
    }
  };

  const openHistoryModal = async () => {
    setIsHistoryModalOpen(true);
    try {
      setLoadingHistory(true);
      const sales = await PosService.getPosSales();
      setPosSalesHistory(Array.isArray(sales) ? sales : []);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'বিক বিক্রয়ের ইতিহাস লোড করা যায়নি' : 'Failed to load sales history'));
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleVoidSale = async (invoiceNumber: string) => {
    if (!confirm(isBn ? `আপনি কি ইনভয়েস ${invoiceNumber} বাতিল করে স্টক ব্যাক করতে চান?` : `Are you sure you want to void invoice ${invoiceNumber}?`)) {
      return;
    }

    try {
      await PosService.voidPosSale(invoiceNumber);
      toast.success(isBn ? `ইনভয়েস ${invoiceNumber} ভয়েড করা হয়েছে ও স্টক রিস্টোর হয়েছে!` : `Invoice ${invoiceNumber} voided and stock restored!`);
      openHistoryModal();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ইনভয়েস ভয়েড করা যায়নি' : 'Failed to void invoice'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground font-serif-title">
              {isBn ? 'ফার্মেসী কাউন্টার সেলস ও পজ মেমো টার্মিনাল (POS)' : 'In-Store Counter Sales POS Billing'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? 'দ্রুত ড্রাগ স্ক্যানিং, তাৎক্ষণিক স্টক ডিডাকশন ও রিয়েল-টাইম মেমো রিসিপ্ট জেনারেটর'
                : 'Live counter sales billing, automatic stock ledger deduction and receipt printing'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openHistoryModal}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-xs font-extrabold text-foreground shadow-2xs hover:bg-muted cursor-pointer"
        >
          <History className="h-4 w-4 text-amber-600" />
          <span>{isBn ? 'কাউন্টার বিক্রয়ের ইতিহাস' : 'Sales History & Voids'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Search & Medicine Quick Add Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBn ? 'ওষুধের নাম বা জেনেরিক দিয়ে টাইপ করুন...' : 'Search medicine name or generic composition...'}
              className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden shadow-xs"
            />
          </div>

          {loadingProducts ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
              {products.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-xs font-bold text-muted-foreground">
                  {isBn ? 'কোনো ওষুধ পাওয়া যায়নি' : 'No medicines available'}
                </div>
              ) : (
                products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addToCart(p)}
                    disabled={p.stock <= 0}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5 shadow-2xs hover:border-primary hover:shadow-md transition-all text-left cursor-pointer group disabled:opacity-50"
                  >
                    <div className="min-w-0 pr-2">
                      <h4 className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors truncate">
                        {isBn ? (p.nameBn || p.name) : (p.nameEn || p.name)}
                      </h4>
                      <p className="text-[10px] text-muted-foreground truncate">{p.genericName || 'Paracetamol'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-black text-emerald-600">
                          ৳{p.price.toFixed(2)} / {p.unit}
                        </span>
                        <span className={`text-[10px] font-bold ${p.stock > 10 ? 'text-indigo-600' : 'text-rose-600'}`}>
                          Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                      <Plus className="h-4 w-4" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: POS Billing Terminal Cart (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-background p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-black text-foreground font-serif-title">
                {isBn ? 'কাউন্টার কার্ট ও মেমো আইটেমস' : 'Counter Sales Cart'}
              </h3>
              <span className="text-xs font-black text-primary">
                {cartItems.length} {isBn ? 'টি আইটেম' : 'items'}
              </span>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                  {isBn ? 'গ্রাহকের নাম' : 'Customer Name'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={isBn ? 'নাম (ঐচ্ছিক)' : 'Name (Optional)'}
                  className="w-full rounded-xl border border-border bg-muted/20 px-2.5 py-1.5 font-semibold text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1">
                  {isBn ? 'মোবাইল নম্বর' : 'Customer Phone'}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={isBn ? '01712345678' : 'Phone'}
                  className="w-full rounded-xl border border-border bg-muted/20 px-2.5 py-1.5 font-semibold text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-52 overflow-y-auto custom-scrollbar pr-1">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-muted-foreground">
                  {isBn ? 'বামপাশ থেকে ওষুধ সিলেক্ট করুন' : 'Select medicines to build POS receipt'}
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/20 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-foreground truncate">
                        {isBn ? (item.product.nameBn || item.product.name) : (item.product.nameEn || item.product.name)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        ৳{item.unitPrice.toFixed(2)} x {item.quantity} = ৳{(item.unitPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="p-1 rounded-lg border border-border bg-background text-foreground hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 font-black">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="p-1 rounded-lg border border-border bg-background text-foreground hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 ml-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="pt-3 border-t border-border space-y-2.5">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{isBn ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                <span className="font-bold text-foreground">৳{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>{isBn ? 'ডিসকাউন্ট (৳):' : 'Discount (৳):'}</span>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-20 rounded-lg border border-border bg-background px-2 py-0.5 font-bold text-right text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex justify-between text-sm font-black pt-1 border-t border-border">
                <span>{isBn ? 'সর্বমোট (Grand Total):' : 'Grand Total:'}</span>
                <span className="text-emerald-600 text-lg">৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-1">
              {(['cash', 'bkash', 'card', 'nagad'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-1.5 rounded-xl text-[11px] font-extrabold uppercase transition-all cursor-pointer border ${
                    paymentMethod === method
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-muted/30 border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            {/* Paid Amount */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground">{isBn ? 'প্রাপ্ত ক্যাশ/পেমেন্ট (৳):' : 'Paid Amount (৳):'}</span>
              <input
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                placeholder={grandTotal.toFixed(2)}
                className="w-24 rounded-lg border border-border bg-background px-2 py-1 font-bold text-right text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>

            {paidAmount > grandTotal && (
              <div className="flex justify-between text-xs font-extrabold text-indigo-600 bg-indigo-50 p-2 rounded-xl border border-indigo-200">
                <span>{isBn ? 'ফেরত দিন (Change):' : 'Change Return:'}</span>
                <span>৳{changeAmount.toFixed(2)}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleCheckoutPOS}
              disabled={submittingSale || cartItems.length === 0}
              className="w-full rounded-2xl bg-emerald-600 py-3.5 px-4 text-xs font-black text-white shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submittingSale ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Printer className="h-4 w-4" />
                  <span>{isBn ? 'বিল সম্পন্ন ও মেমো প্রিন্ট করুন' : 'Complete Sale & Print Receipt'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Printable Thermal Receipt Modal */}
      {isReceiptModalOpen && completedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-black text-sm font-serif-title">{isBn ? 'প্রিন্ট মেমো মেমো' : 'Thermal Print Receipt'}</h3>
              <button type="button" onClick={() => setIsReceiptModalOpen(false)} className="p-1 rounded-xl text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Area */}
            <div id="printable-pos-receipt" className="p-4 rounded-2xl border border-dashed border-border bg-white text-slate-900 space-y-3">
              <div className="text-center space-y-0.5">
                <h2 className="text-lg font-black tracking-tight">mediShop Pharmacy</h2>
                <p className="text-[10px] text-slate-600">Mirpur-10, Dhaka-1216 • DGDA #10294</p>
                <p className="text-[10px] text-slate-600">Hotline: 16263 • support@medishop.com</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-1.5 text-[11px] space-y-0.5">
                <p><strong>Invoice:</strong> {completedInvoice.invoiceNumber}</p>
                <p><strong>Date:</strong> {new Date(completedInvoice.createdAt).toLocaleString()}</p>
                {completedInvoice.customerName && <p><strong>Customer:</strong> {completedInvoice.customerName}</p>}
                {completedInvoice.customerPhone && <p><strong>Phone:</strong> {completedInvoice.customerPhone}</p>}
                <p><strong>Payment:</strong> {completedInvoice.paymentMethod.toUpperCase()}</p>
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
                  {completedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-semibold">{item.productName}</td>
                      <td className="py-1 text-center">{item.quantity}</td>
                      <td className="py-1 text-right">৳{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-0.5 text-right font-semibold">
                <p>Subtotal: ৳{completedInvoice.subtotal.toFixed(2)}</p>
                {completedInvoice.discountAmount > 0 && <p>Discount: -৳{completedInvoice.discountAmount.toFixed(2)}</p>}
                <p className="text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  Grand Total: ৳{completedInvoice.grandTotal.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-600">Paid: ৳{completedInvoice.paidAmount.toFixed(2)} | Change: ৳{completedInvoice.changeAmount.toFixed(2)}</p>
              </div>

              <div className="text-center pt-2 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                <p>Thank you for shopping at mediShop!</p>
                <p>Get well soon • Stay Healthy</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full rounded-2xl bg-emerald-600 py-3 font-black text-white shadow-md hover:bg-emerald-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>{isBn ? 'রিসিপ্ট প্রিন্ট করুন' : 'Print Thermal Receipt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POS Sales History Drawer */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl border border-border bg-background p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'কাউন্টার ইনভয়েস বিক্রয়ের ইতিহাস ও ভয়েড ম্যানেজমেন্ট' : 'POS Sales Invoices & Void Management'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn ? 'সকল কাউন্টার বিক্রয়ের তালিকা ও শেয়ার্ড ইনভেন্টরি স্টক রিফান্ড ব্যবস্থা' : 'View all counter sale receipts and perform stock restoration voids'}
                </p>
              </div>
              <button type="button" onClick={() => setIsHistoryModalOpen(false)} className="p-1 rounded-xl text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingHistory ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : posSalesHistory.length === 0 ? (
                <div className="py-12 text-center text-xs font-bold text-muted-foreground">
                  {isBn ? 'কোনো বিক্রয়ের তথ্য পাওয়া যায়নি' : 'No POS sales records found'}
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-[11px] font-black uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">{isBn ? 'ইনভয়েস নম্বর' : 'Invoice #'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'তারিখ' : 'Date'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'গ্রাহক' : 'Customer'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'পেমেন্ট' : 'Payment'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'মোট মূল্য' : 'Grand Total'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                      <th className="py-2.5 px-3 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {posSalesHistory.map((sale) => (
                      <tr key={sale.id} className="hover:bg-muted/20">
                        <td className="py-2.5 px-3 font-bold text-foreground">{sale.invoiceNumber}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{new Date(sale.createdAt).toLocaleString()}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">
                          {sale.customerName || sale.customerPhone || 'Counter Guest'}
                        </td>
                        <td className="py-2.5 px-3 font-bold uppercase text-primary">{sale.paymentMethod}</td>
                        <td className="py-2.5 px-3 font-black text-emerald-600">৳{sale.grandTotal.toFixed(2)}</td>
                        <td className="py-2.5 px-3">
                          {sale.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="h-3 w-3" /> Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-black text-rose-700 border border-rose-200">
                              Voided
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {sale.status === 'completed' && (
                            <button
                              type="button"
                              onClick={() => handleVoidSale(sale.invoiceNumber)}
                              className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-extrabold text-rose-700 hover:bg-rose-100 cursor-pointer"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span>{isBn ? 'ভয়েড ও স্টক রিস্টোর' : 'Void & Restore Stock'}</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
