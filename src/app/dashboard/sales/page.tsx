'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { PosSalesModule } from '@/components/dashboard/modules/PosSalesModule';
import { AdminChatManager } from '@/components/dashboard/AdminChatManager';
import { OrderManager } from '@/components/dashboard/OrderManager';
import { ProductManager } from '@/components/dashboard/ProductManager';
import { posService, PosTodayStats, PosSaleRecord } from '@/services/pos.service';
import { staffInvitationService, SearchedCustomer } from '@/services/staffInvitation.service';
import {
  Store,
  Receipt,
  Users,
  Search,
  Pill,
  TrendingUp,
  CreditCard,
  Banknote,
  DollarSign,
  Package,
  Printer,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  MessageSquare,
  LayoutDashboard,
  User,
  MapPin,
  Mail,
  Phone,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';

type SalesSectionTab = 'pos_sales' | 'overview' | 'orders' | 'chat' | 'products' | 'customers';

function SalesDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get('tab') || 'pos_sales';
  const language = useAppSelector((state) => state.ui.language);
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const isBn = language === 'bn';
  const userRole = reduxUser?.role || 'customer';

  // Normalize tabParam
  const normalizeTab = (t: string): SalesSectionTab => {
    if (t === 'pos' || t === 'pos_sales') return 'pos_sales';
    if (t === 'overview') return 'overview';
    if (t === 'orders') return 'orders';
    if (t === 'chat' || t === 'livechat') return 'chat';
    if (t === 'products' || t === 'stock_checker') return 'products';
    if (t === 'customers' || t === 'users') return 'customers';
    return 'pos_sales';
  };

  const [activeTab, setActiveTab] = useState<SalesSectionTab>(normalizeTab(rawTab));

  useEffect(() => {
    setActiveTab(normalizeTab(rawTab));
  }, [rawTab]);

  // Stats State
  const [stats, setStats] = useState<PosTodayStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Invoices Server-Side State
  const [invoices, setInvoices] = useState<PosSaleRecord[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<PosSaleRecord | null>(null);

  // Customer Directory Server-Side State
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState<SearchedCustomer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Page Guard
  if (!isInitialized || !isAuthenticated || !['sales_staff', 'admin', 'super_admin'].includes(userRole)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fetch Daily Stats
  const fetchTodayStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await posService.getTodayStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load sales stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Invoices
  const fetchInvoices = useCallback(async () => {
    try {
      setLoadingInvoices(true);
      const data = await posService.getPosSales();
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  }, []);

  // Initial load for overview tab
  useEffect(() => {
    if (activeTab === 'overview') {
      fetchTodayStats();
      fetchInvoices();
    }
  }, [activeTab, fetchTodayStats, fetchInvoices]);

  // Debounced Customer Search
  useEffect(() => {
    if (activeTab !== 'customers') return;
    const clean = customerSearch.trim();
    if (clean.length < 2) {
      setCustomers([]);
      setLoadingCustomers(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingCustomers(true);
        const data = await staffInvitationService.searchCustomers(clean);
        setCustomers(data || []);
      } catch (err) {
        console.error('Failed to search customers:', err);
      } finally {
        setLoadingCustomers(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [customerSearch, activeTab]);

  // Void Sale
  const handleVoidSale = async (invoiceNumber: string) => {
    if (
      !confirm(
        isBn
          ? `আপনি কি ইনভয়েস #${invoiceNumber} বাতিল করে সেন্ট্রাল স্টক রিস্টোর করতে চান?`
          : `Are you sure you want to void invoice #${invoiceNumber} and restore stock?`
      )
    ) {
      return;
    }

    try {
      await posService.voidPosSale(invoiceNumber);
      toast.success(
        isBn
          ? `ইনভয়েস #${invoiceNumber} বাতিল করা হয়েছে ও পণ্য স্টকে রিস্টোর করা হয়েছে!`
          : `Invoice #${invoiceNumber} voided and stock restored!`
      );
      fetchInvoices();
      fetchTodayStats();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ইনভয়েস বাতিল করা যায়নি' : 'Failed to void invoice'));
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (!invoiceSearch.trim()) return true;
    const q = invoiceSearch.toLowerCase().trim();
    return (
      inv.invoiceNumber?.toLowerCase().includes(q) ||
      inv.customerName?.toLowerCase().includes(q) ||
      inv.customerPhone?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header Banner */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground font-semibold">
              Shift: {reduxUser?.name || 'Staff'} • {new Date().toLocaleDateString()}
            </span>
            <h1 className="text-xl font-black text-foreground font-serif-title mt-1">
              {isBn ? 'কাউন্টার পিওএস ও বিক্রয় ড্যাশবোর্ড' : 'Pharmacy POS & Sales Command Center'}
            </h1>
          </div>
        </div>
      </div>

      {/* 2. Active Section Area */}

      {/* TAB A: POS Billing Terminal */}
      {activeTab === 'pos_sales' && (
        <div className="space-y-4">
          <PosSalesModule isBn={isBn} />
        </div>
      )}

      {/* TAB B: Shift Overview & KPI Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
                {isBn ? 'আজকের বিক্রয় ও শিফট ওভারভিউ' : "Today's Shift Sales Overview"}
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground">{isBn ? 'মোট বিক্রয়' : 'Total Sales'}</span>
                <p className="text-2xl font-black text-emerald-600">৳{stats?.todayTotalRevenue?.toFixed(0) || '0'}</p>
                <span className="text-[10px] text-muted-foreground block">{stats?.todayInvoiceCount || 0} {isBn ? 'টি মেমো' : 'invoices'}</span>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground">{isBn ? 'ক্যাশ পেমেন্ট' : 'Cash Sales'}</span>
                <p className="text-2xl font-black text-foreground">৳{stats?.paymentBreakdown?.cash?.toFixed(0) || '0'}</p>
                <span className="text-[10px] text-muted-foreground block">{isBn ? 'কাউন্টার নগদ' : 'Cash register'}</span>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-pink-600">{isBn ? 'বিকাশ / নগদ' : 'bKash / Nagad'}</span>
                <p className="text-2xl font-black text-pink-600">
                  ৳{((stats?.paymentBreakdown?.bkash || 0) + (stats?.paymentBreakdown?.nagad || 0)).toFixed(0)}
                </p>
                <span className="text-[10px] text-muted-foreground block">{isBn ? 'ডিজিটাল এমএফএস' : 'Mobile Banking'}</span>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-indigo-600">{isBn ? 'কার্ড পেমেন্ট' : 'Card POS'}</span>
                <p className="text-2xl font-black text-indigo-600">৳{stats?.paymentBreakdown?.card?.toFixed(0) || '0'}</p>
                <span className="text-[10px] text-muted-foreground block">{isBn ? 'পিওএস সোয়াইপ' : 'Card machines'}</span>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground">{isBn ? 'মোট ওষুধ আইটেম' : 'Items Sold'}</span>
                <p className="text-2xl font-black text-foreground">{stats?.totalItemsSold || 0}</p>
                <span className="text-[10px] text-muted-foreground block">{isBn ? 'ইউনিট ডিসপেন্সড' : 'Units dispensed'}</span>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-muted-foreground">{isBn ? 'গড় মেমো মূল্য' : 'Avg Basket'}</span>
                <p className="text-2xl font-black text-foreground">৳{stats?.avgBillValue?.toFixed(0) || '0'}</p>
                <span className="text-[10px] text-muted-foreground block">{isBn ? 'প্রতি কাস্টমার' : 'Per receipt'}</span>
              </div>
            </div>
          </div>

          {/* Invoices Ledger with Customer Profile Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-indigo-600" />
                <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
                  {isBn ? 'কাউন্টার ইনভয়েস লেজার ও গ্রাহক প্রোফাইল' : 'POS Sales Invoices & Customer Profiles'}
                </h2>
              </div>

              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={invoiceSearch}
                  onChange={(e) => setInvoiceSearch(e.target.value)}
                  placeholder={isBn ? 'ইনভয়েস # বা গ্রাহকের নাম দিয়ে খুঁজুন...' : 'Search invoice # or customer...'}
                  className="w-full rounded-2xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-background shadow-xs overflow-hidden">
              {loadingInvoices ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="py-10 text-center text-xs font-bold text-muted-foreground">
                  {isBn ? 'কোনো ইনভয়েস পাওয়া যায়নি' : 'No matching sales invoices found'}
                </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/40 border-b border-border text-[11px] font-black uppercase text-muted-foreground">
                      <tr>
                        <th className="py-3 px-4">Invoice #</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Customer Profile</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {filteredInvoices.slice(0, 20).map((inv, idx) => (
                        <tr key={inv._id || (inv as any).id || inv.invoiceNumber || idx} className="hover:bg-muted/20">
                          <td className="py-3 px-4 font-mono font-bold text-foreground">{inv.invoiceNumber}</td>
                          <td className="py-3 px-4 text-muted-foreground">{new Date(inv.createdAt).toLocaleString()}</td>
                          
                          {/* Customer Profile Column */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-black text-xs shrink-0 border border-primary/20">
                                {inv.customerUser?.avatar ? (
                                  <img
                                    src={inv.customerUser.avatar}
                                    alt=""
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  (inv.customerName || 'W').charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-foreground truncate max-w-[140px]">
                                    {inv.customerName || 'Walk-in Customer'}
                                  </p>
                                  {inv.customerUser?.role && (
                                    <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.2 rounded-full font-bold capitalize">
                                      {inv.customerUser.role}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-muted-foreground truncate">
                                  {inv.customerPhone || inv.customerEmail || 'Cash counter'}
                                </p>
                                {(inv.customerAddress ||
                                  (inv.customerUser?.addresses && inv.customerUser.addresses.length > 0)) && (
                                  <p className="text-[9px] text-muted-foreground/80 truncate max-w-[150px]">
                                    📍{' '}
                                    {inv.customerAddress ||
                                      `${inv.customerUser?.addresses[0]?.address || ''}, ${
                                        inv.customerUser?.addresses[0]?.district || ''
                                      }`}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 uppercase font-bold text-primary">{inv.paymentMethod}</td>
                          <td className="py-3 px-4 font-black text-emerald-600 text-sm">৳{inv.grandTotal.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            {inv.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="h-3 w-3" /> Completed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-black text-rose-700 border border-rose-200">
                                Voided
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedInvoice(inv)}
                                className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-muted cursor-pointer"
                              >
                                <Printer className="h-3 w-3" />
                                <span>{isBn ? 'মেমো' : 'Receipt'}</span>
                              </button>
                              {inv.status === 'completed' && (
                                <button
                                  type="button"
                                  onClick={() => handleVoidSale(inv.invoiceNumber)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                  <span>{isBn ? 'ভয়েড' : 'Void'}</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB C: Customer Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <OrderManager />
        </div>
      )}

      {/* TAB D: Live Customer Support Chat */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <AdminChatManager />
        </div>
      )}

      {/* TAB E: All Medicine & Products Management (Exact Same Component as Admin Panel) */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <ProductManager />
        </div>
      )}

      {/* TAB F: Customer Directory Lookup */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-600" />
              <h2 className="text-sm font-black text-foreground uppercase tracking-wider">
                {isBn ? 'গ্রাহক তথ্য অনুসন্ধান' : 'Customer Account & Address Lookup'}
              </h2>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder={isBn ? 'নাম, মোবাইল বা ইমেইল লিখুন...' : 'Type name, phone or email...'}
                className="w-full rounded-2xl border border-border bg-background py-1.5 pl-8 pr-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background p-5 shadow-xs">
            {customerSearch.trim().length < 2 ? (
              <div className="py-8 text-center text-xs font-bold text-muted-foreground">
                {isBn ? 'গ্রাহকের নাম, মোবাইল নম্বর বা ইমেইল লিখুন' : 'Type at least 2 characters to search registered customer accounts'}
              </div>
            ) : loadingCustomers ? (
              <div className="flex h-24 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : customers.length === 0 ? (
              <div className="py-6 text-center text-xs font-bold text-muted-foreground">
                {isBn ? 'কোনো গ্রাহক পাওয়া যায়নি' : 'No registered customer found matching query'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {customers.map((c, idx) => (
                  <div
                    key={c._id || (c as any).id || idx}
                    className="p-3.5 rounded-2xl border border-border bg-muted/20 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-extrabold text-foreground">{c.name}</p>
                      <span className="text-[10px] font-bold text-primary capitalize bg-primary/10 px-2 py-0.5 rounded-full">
                        {c.role}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{c.phone || c.email}</p>
                    {c.addresses && c.addresses.length > 0 && (
                      <p className="text-[11px] text-muted-foreground/80 truncate">
                        📍 {c.addresses[0].address || ''}, {c.addresses[0].district || ''}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thermal Receipt Modal with Complete Customer Profile */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="font-black text-sm font-serif-title">{isBn ? 'মেমো ক্যাশ রিসিপ্ট' : 'Thermal Print Receipt'}</h3>
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
                <p><strong>Invoice:</strong> {selectedInvoice.invoiceNumber}</p>
                <p><strong>Date:</strong> {new Date(selectedInvoice.createdAt).toLocaleString()}</p>
                
                {/* Customer Details */}
                <div className="pt-1 mt-1 border-t border-dotted border-slate-200">
                  <p><strong>Customer:</strong> {selectedInvoice.customerName || 'Walk-in'}</p>
                  {selectedInvoice.customerPhone && <p><strong>Phone:</strong> {selectedInvoice.customerPhone}</p>}
                  {selectedInvoice.customerEmail && <p><strong>Email:</strong> {selectedInvoice.customerEmail}</p>}
                  {(selectedInvoice.customerAddress || selectedInvoice.customerUser?.addresses?.[0]?.address) && (
                    <p>
                      <strong>Address:</strong>{' '}
                      {selectedInvoice.customerAddress ||
                        `${selectedInvoice.customerUser?.addresses?.[0]?.address || ''}, ${
                          selectedInvoice.customerUser?.addresses?.[0]?.district || ''
                        }`}
                    </p>
                  )}
                </div>

                <p className="pt-1"><strong>Payment:</strong> {selectedInvoice.paymentMethod.toUpperCase()}</p>
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
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-semibold">{item.productName}</td>
                      <td className="py-1 text-center">{item.quantity}</td>
                      <td className="py-1 text-right">৳{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-dashed border-slate-300 pt-2 space-y-0.5 text-right font-semibold">
                <p>Subtotal: ৳{selectedInvoice.subtotal.toFixed(2)}</p>
                {selectedInvoice.discountAmount > 0 && <p>Discount: -৳{selectedInvoice.discountAmount.toFixed(2)}</p>}
                <p className="text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                  Grand Total: ৳{selectedInvoice.grandTotal.toFixed(2)}
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
                          <div class="row"><span><strong>Customer:</strong></span><span>${selectedInvoice.customerName || 'Walk-in'}</span></div>
                          ${selectedInvoice.customerPhone ? `<div class="row"><span><strong>Phone:</strong></span><span>${selectedInvoice.customerPhone}</span></div>` : ''}
                          ${selectedInvoice.customerEmail ? `<div class="row"><span><strong>Email:</strong></span><span>${selectedInvoice.customerEmail}</span></div>` : ''}
                          ${selectedInvoice.customerAddress ? `<div class="row"><span><strong>Address:</strong></span><span>${selectedInvoice.customerAddress}</span></div>` : ''}
                          <div class="row"><span><strong>Payment:</strong></span><span>${selectedInvoice.paymentMethod.toUpperCase()}</span></div>
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
                              ${selectedInvoice.items.map((i) => `
                                <tr>
                                  <td>${i.productName}</td>
                                  <td class="text-center">${i.quantity}</td>
                                  <td class="text-right">৳${i.totalPrice.toFixed(2)}</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>
                          <div class="divider"></div>
                          <div class="row"><span>Subtotal:</span><span>৳${selectedInvoice.subtotal.toFixed(2)}</span></div>
                          ${selectedInvoice.discountAmount > 0 ? `<div class="row"><span>Discount:</span><span>-৳${selectedInvoice.discountAmount.toFixed(2)}</span></div>` : ''}
                          <div class="row total"><span>Grand Total:</span><span>৳${selectedInvoice.grandTotal.toFixed(2)}</span></div>
                          <div class="row"><span>Paid:</span><span>৳${selectedInvoice.paidAmount.toFixed(2)}</span></div>
                          ${selectedInvoice.changeAmount > 0 ? `<div class="row"><span>Change:</span><span>৳${selectedInvoice.changeAmount.toFixed(2)}</span></div>` : ''}
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

export default function SalesDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <SalesDashboardContent />
    </Suspense>
  );
}
