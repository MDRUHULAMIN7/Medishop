'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  CreditCard,
  CheckCircle2,
  Pill,
} from 'lucide-react';
import { toast } from 'sonner';

interface PosSalesModuleProps {
  isBn?: boolean;
}

interface PosItem {
  id: string;
  nameEn: string;
  nameBn: string;
  price: number;
  unit: string;
  qty: number;
}

const POS_DEMO_PRODUCTS = [
  { id: 'p1', nameEn: 'Napa Extra 500mg', nameBn: 'নাপা এক্সট্রা ৫০০ মিগ্রা', price: 2.5, unit: 'Tablet' },
  { id: 'p2', nameEn: 'Seclo 20mg Capsule', nameBn: 'সেকলো ২০ মিগ্রা ক্যাপসুল', price: 7.0, unit: 'Capsule' },
  { id: 'p3', nameEn: 'Sergel 20mg Tablet', nameBn: 'সারজেল ২০ মিগ্রা ট্যাবলেট', price: 7.0, unit: 'Tablet' },
  { id: 'p4', nameEn: 'Alatrol 10mg Tablet', nameBn: 'এলাট্রোল ১০ মিগ্রা ট্যাবলেট', price: 3.0, unit: 'Tablet' },
  { id: 'p5', nameEn: 'Beximco Hand Sanitizer 100ml', nameBn: 'হ্যান্ড স্যানিটাইজার ১০০মিমি', price: 120.0, unit: 'Bottle' },
];

export function PosSalesModule({ isBn = true }: PosSalesModuleProps) {
  const [cartItems, setCartItems] = useState<PosItem[]>([
    { id: 'p1', nameEn: 'Napa Extra 500mg', nameBn: 'নাপা এক্সট্রা ৫০০ মিগ্রা', price: 2.5, unit: 'Tablet', qty: 10 },
  ]);
  const [search, setSearch] = useState('');
  const [customerPhone, setCustomerPhone] = useState('01712345678');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'BKASH' | 'CARD'>('CASH');

  const filteredProducts = POS_DEMO_PRODUCTS.filter((p) =>
    p.nameEn.toLowerCase().includes(search.toLowerCase()) || p.nameBn.includes(search)
  );

  const addToCart = (product: typeof POS_DEMO_PRODUCTS[0]) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : item;
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const grandTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckoutPOS = () => {
    if (cartItems.length === 0) {
      toast.error(isBn ? 'কাউন্টার কার্ট খালি' : 'POS cart is empty');
      return;
    }
    toast.success(
      isBn
        ? `৳${grandTotal.toFixed(2)} টাকার কাউন্টার বিল সফলভাবে সম্পূর্ণ হয়েছে! প্রিন্ট রিসিপ্ট তৈরি হচ্ছে...`
        : `POS Invoice ৳${grandTotal.toFixed(2)} completed! Printing receipt...`
    );
    setCartItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground font-serif-title">
              {isBn ? 'ফার্মেসী কাউন্টার সেলস টার্মিনাল (POS)' : 'In-Store Counter Sales POS'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? 'দ্রুত ড্রাগ বারকোড স্ক্যানার, ক্যাশ কালেকশন ও ইন-স্টোর গ্রাহক রসিদ প্রিন্টিং'
                : 'Fast counter sales billing, customer lookup and thermal receipt printing'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Search & Quick Add Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isBn ? 'মেডিসিনের নাম বা বারকোড স্ক্যান করুন...' : 'Search medicine name or scan barcode...'}
              className="w-full rounded-2xl border border-border bg-background py-3 pl-10 pr-4 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => addToCart(p)}
                className="flex items-center justify-between rounded-2xl border border-border bg-background p-3.5 shadow-xs hover:border-primary hover:shadow-md transition-all text-left cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-extrabold text-foreground group-hover:text-primary transition-colors">
                    {isBn ? p.nameBn : p.nameEn}
                  </h4>
                  <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                    ৳{p.price.toFixed(2)} / {p.unit}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Plus className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: POS Billing Terminal Cart (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-background p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground font-serif-title">
                {isBn ? 'কাউন্টার মেমো বিল' : 'Counter Sales Cart'}
              </h3>
              <span className="text-xs font-extrabold text-primary">
                {cartItems.length} {isBn ? 'টি ওষুধ' : 'items'}
              </span>
            </div>

            {/* Customer Lookup */}
            <div>
              <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                {isBn ? 'গ্রাহকের মোবাইল নম্বর' : 'Customer Phone'}
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
              {cartItems.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-muted-foreground">
                  {isBn ? 'কাউন্টার কার্টে ওষুধ যোগ করুন' : 'No items added yet'}
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-muted/20 text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-foreground truncate">{isBn ? item.nameBn : item.nameEn}</p>
                      <p className="text-[10px] text-muted-foreground">
                        ৳{item.price.toFixed(2)} x {item.qty} = ৳{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1 rounded-lg border border-border bg-background text-foreground hover:bg-muted"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 font-extrabold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 rounded-lg border border-border bg-background text-foreground hover:bg-muted"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
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

          {/* Payment Summary */}
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex items-center justify-between text-sm font-black">
              <span>{isBn ? 'সর্বমোট (Grand Total):' : 'Grand Total:'}</span>
              <span className="text-emerald-600 text-lg">৳{grandTotal.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['CASH', 'BKASH', 'CARD'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                    paymentMethod === method
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-muted/30 border-border text-foreground hover:bg-muted'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCheckoutPOS}
              className="w-full rounded-2xl bg-emerald-600 py-3.5 px-4 text-xs font-black text-white shadow-md hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>{isBn ? 'বিল সম্পন্ন ও মেমো প্রিন্ট করুন' : 'Complete Sale & Print Receipt'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
