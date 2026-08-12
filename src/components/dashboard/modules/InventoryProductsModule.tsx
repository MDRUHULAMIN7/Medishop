'use client';

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
  AlertCircle,
  Package,
  History,
  Building2,
  X,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProductService, Product } from '@/services/product.service';
import { PosService, StockLedgerEntry } from '@/services/pos.service';
import { StoreService, PharmacyStore } from '@/services/store.service';

interface InventoryProductsModuleProps {
  isBn?: boolean;
}

export function InventoryProductsModule({ isBn = true }: InventoryProductsModuleProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);

  // Adjustment form state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qtyChange, setQtyChange] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<'purchase_restock' | 'manual_adjustment' | 'damage_expiry_writeoff'>('purchase_restock');
  const [adjustNote, setAdjustNote] = useState('');
  const [submittingAdjust, setSubmittingAdjust] = useState(false);

  // Ledger state
  const [ledgerEntries, setLedgerEntries] = useState<StockLedgerEntry[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(false);

  // Stores state
  const [stores, setStores] = useState<PharmacyStore[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreCode, setNewStoreCode] = useState('');
  const [newStoreAddress, setNewStoreAddress] = useState('');
  const [newStorePhone, setNewStorePhone] = useState('');
  const [submittingStore, setSubmittingStore] = useState(false);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await ProductService.getProducts({ limit: 100, includeInactive: true });
      setProducts(res.products || []);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ইনভেন্টরি লোড করতে ব্যর্থ হয়েছে' : 'Failed to fetch inventory'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openAdjustModal = (product: Product) => {
    setSelectedProduct(product);
    setQtyChange(10);
    setAdjustReason('purchase_restock');
    setAdjustNote('');
    setIsAdjustModalOpen(true);
  };

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      setSubmittingAdjust(true);
      await PosService.adjustStock({
        productId: selectedProduct.id,
        quantityChange: qtyChange,
        reason: adjustReason,
        note: adjustNote,
      });

      toast.success(
        isBn
          ? `${selectedProduct.name} স্টকের সমন্বয় সফল হয়েছে! (পরিবর্তন: ${qtyChange > 0 ? '+' : ''}${qtyChange})`
          : `Stock adjusted for ${selectedProduct.name} (${qtyChange > 0 ? '+' : ''}${qtyChange})`
      );

      setIsAdjustModalOpen(false);
      fetchInventory();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'স্টক এডজাস্ট করতে ব্যর্থ হয়েছে' : 'Failed to adjust stock'));
    } finally {
      setSubmittingAdjust(false);
    }
  };

  const openLedgerModal = async () => {
    setIsLedgerModalOpen(true);
    try {
      setLoadingLedger(true);
      const data = await PosService.getStockLedger();
      setLedgerEntries(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'স্টক লেজার ব্যর্থ হয়েছে' : 'Failed to load stock ledger'));
    } finally {
      setLoadingLedger(false);
    }
  };

  const openStoreModal = async () => {
    setIsStoreModalOpen(true);
    try {
      setLoadingStores(true);
      const data = await StoreService.getStores();
      setStores(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ফার্মেসি আউটলেট লোড করা যায়নি' : 'Failed to load stores'));
    } finally {
      setLoadingStores(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreName || !newStoreCode || !newStoreAddress || !newStorePhone) {
      toast.error(isBn ? 'অনুগ্রহ করে সকল ফিল্ড পূরণ করুন' : 'Please fill in all store fields');
      return;
    }

    try {
      setSubmittingStore(true);
      const created = await StoreService.createStore({
        name: newStoreName,
        code: newStoreCode,
        address: newStoreAddress,
        phone: newStorePhone,
      });

      toast.success(isBn ? 'নতুন ফার্মেসি ব্রাঞ্চ তৈরি হয়েছে!' : 'Pharmacy store branch created!');
      setStores((prev) => [created, ...prev]);
      setNewStoreName('');
      setNewStoreCode('');
      setNewStoreAddress('');
      setNewStorePhone('');
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ব্রাঞ্চ তৈরি ব্যর্থ হয়েছে' : 'Failed to create branch'));
    } finally {
      setSubmittingStore(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      (p.nameEn || p.name).toLowerCase().includes(search.toLowerCase()) ||
      (p.nameBn || '').includes(search) ||
      (p.genericName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.brandName || p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground font-serif-title">
              {isBn ? 'শেয়ার্ড ইনভেন্টরি ও সেন্ট্রাল স্টক লেজার' : 'Shared Central Inventory & Stock Ledger'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? 'অনলাইন শপ ও ইন-স্টোর POS কাউন্টারের মধ্যে অটো-সিঙ্ক্রোনাইজড স্টক ও রিয়েল-টাইম অডিট ট্রেইল'
                : 'Real-time multi-channel inventory synchronized between online orders & POS counter'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={openLedgerModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted cursor-pointer"
          >
            <History className="h-4 w-4 text-indigo-600" />
            <span>{isBn ? 'স্টক অডিট লেজার' : 'Audit Stock Ledger'}</span>
          </button>

          <button
            type="button"
            onClick={openStoreModal}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted cursor-pointer"
          >
            <Building2 className="h-4 w-4 text-emerald-600" />
            <span>{isBn ? 'ফার্মেসি ব্রাঞ্চ আউটলেটস' : 'Store Outlets'}</span>
          </button>

          <button
            type="button"
            onClick={fetchInventory}
            className="inline-flex items-center gap-1 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isBn ? 'ব্র্যান্ড, ওষুধ বা জেনেরিক নামে খুঁজুন...' : 'Search brand, medicine or generic name...'}
          className="w-full rounded-2xl border border-border bg-background py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden"
        />
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-border bg-background shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-[11px] font-black uppercase text-muted-foreground">
                <tr>
                  <th className="py-3.5 px-4">{isBn ? 'মেডিসিনের নাম' : 'Medicine Name'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'জেনেরিক ও ব্র্যান্ড' : 'Generic & Manufacturer'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'ইউনিট মূল্য' : 'Unit Price'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'লাইভ স্টক' : 'Live Central Stock'}</th>
                  <th className="py-3.5 px-4 text-right">{isBn ? 'স্টক এডজাস্টমেন্ট' : 'Stock Adjustment'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs font-bold text-muted-foreground">
                      {isBn ? 'কোনো ওষুধ পাওয়া যায়নি' : 'No medicine found'}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isLowStock = p.stock <= 10;
                    return (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-foreground">
                          <div>
                            <span className="block font-bold">{isBn ? (p.nameBn || p.name) : (p.nameEn || p.name)}</span>
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              {p.dosageForm} • {p.strength || 'N/A'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground">
                          <p className="font-semibold text-foreground">{p.genericName || 'Paracetamol'}</p>
                          <p className="text-[10px]">{p.brandName || p.brand || 'Beximco'}</p>
                        </td>

                        <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                          ৳{p.price.toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          {isLowStock ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-black text-rose-700 border border-rose-200">
                              <AlertCircle className="h-3 w-3" /> Low ({p.stock} units)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                              <Package className="h-3 w-3" /> {p.stock} units
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => openAdjustModal(p)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-[11px] font-extrabold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-3 w-3" />
                            <span>{isBn ? 'স্টক এডজাস্ট করুন' : 'Adjust Stock'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'স্টক পরিমাণ এডজাস্ট করুন' : 'Adjust Central Inventory Stock'}
                </h3>
                <p className="text-xs text-muted-foreground truncate max-w-xs">{selectedProduct.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'বর্তমান কেন্দ্রিক স্টক' : 'Current Live Stock'}
                </label>
                <div className="p-2.5 rounded-xl bg-muted/40 font-black text-sm text-foreground">
                  {selectedProduct.stock} units
                </div>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'স্টক পরিবর্তনের সংখ্যা (+ বা -)' : 'Stock Quantity Change (+ or -)'}
                </label>
                <input
                  type="number"
                  value={qtyChange}
                  onChange={(e) => setQtyChange(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  {isBn ? 'নতুন স্টক হবে:' : 'New stock level will be:'}{' '}
                  <strong className="text-emerald-600">{selectedProduct.stock + qtyChange} units</strong>
                </span>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'এডজাস্টমেন্টের কারণ' : 'Adjustment Reason'}
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                >
                  <option value="purchase_restock">{isBn ? 'নতুন পচেস / রিস্টক' : 'Purchase Restock'}</option>
                  <option value="manual_adjustment">{isBn ? 'ম্যানুয়াল এডজাস্টমেন্ট' : 'Manual Audit Adjustment'}</option>
                  <option value="damage_expiry_writeoff">{isBn ? 'মেয়াদোত্তীর্ণ / ড্যামেজ রাইট-অফ' : 'Damage/Expiry Write-off'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'নোট / রিমার্কস (ঐচ্ছিক)' : 'Note / Audit Remark'}
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder={isBn ? 'যেমন: নতুন ব্যাচ প্রাপ্তি...' : 'e.g. Received new shipment...'}
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="rounded-xl border border-border bg-background px-4 py-2 font-bold text-foreground hover:bg-muted"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjust}
                  className="rounded-xl bg-primary px-4 py-2 font-black text-white shadow-xs hover:bg-primary-dark disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingAdjust && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isBn ? 'স্টক সেভ করুন' : 'Save Adjustment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Audit Ledger Drawer Modal */}
      {isLedgerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-3xl border border-border bg-background p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'অপরিবর্তনীয় স্টক মুভমেন্ট অডিট লেজার' : 'Immutable Audit Stock Ledger History'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn ? 'প্রতিটি অনলাইন অর্ডার, পজ সেল ও রিস্টকের টাইমস্ট্যাম্পড লগ' : 'All order deductions, POS sales and restock movement logs'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLedgerModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingLedger ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : ledgerEntries.length === 0 ? (
                <div className="py-12 text-center text-xs font-bold text-muted-foreground">
                  {isBn ? 'কোনো লেজার এন্ট্রি পাওয়া যায়নি' : 'No ledger movement entries recorded yet'}
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-[11px] font-black uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">{isBn ? 'তারিখ ও সময়' : 'Timestamp'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'কারণ / টাইপ' : 'Reason / Action'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'পরিবর্তন' : 'Quantity Change'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'পূর্ববর্তী → নতুন' : 'Stock (Old → New)'}</th>
                      <th className="py-2.5 px-3 text-right">{isBn ? 'ব্যবহারকারী' : 'Performed By'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {ledgerEntries.map((log) => {
                      const isPositive = log.quantityChange > 0;
                      return (
                        <tr key={log.id} className="hover:bg-muted/20">
                          <td className="py-2.5 px-3 font-semibold text-muted-foreground whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-foreground">
                            <span className="capitalize">{log.reason.replace(/_/g, ' ')}</span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-0.5 font-black text-xs ${
                                isPositive ? 'text-emerald-600' : 'text-rose-600'
                              }`}
                            >
                              {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                              {isPositive ? `+${log.quantityChange}` : log.quantityChange}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-foreground">
                            {log.previousStock} → <strong className="text-primary">{log.newStock}</strong>
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-muted-foreground">
                            {log.performedByName || 'System/Admin'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stores Outlets Modal */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl max-h-[85vh] rounded-3xl border border-border bg-background p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'ফার্মেসি ব্রাঞ্চ আউটলেটস' : 'Pharmacy Store Branches'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn ? 'মাল্টি-ব্রাঞ্চ আউটলেট আউটলেট ম্যানেজমেন্ট' : 'Physical pharmacy outlet locations'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsStoreModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Create store form */}
            <form onSubmit={handleCreateStore} className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/30 border border-border text-xs">
              <input
                type="text"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                placeholder={isBn ? 'ব্রাঞ্চের নাম (e.g. Mirpur Branch)' : 'Branch Name'}
                className="rounded-xl border border-border bg-background p-2 font-semibold"
                required
              />
              <input
                type="text"
                value={newStoreCode}
                onChange={(e) => setNewStoreCode(e.target.value)}
                placeholder={isBn ? 'কোড (e.g. MRP-01)' : 'Branch Code'}
                className="rounded-xl border border-border bg-background p-2 font-semibold"
                required
              />
              <input
                type="text"
                value={newStoreAddress}
                onChange={(e) => setNewStoreAddress(e.target.value)}
                placeholder={isBn ? 'ঠিকানা (e.g. Mirpur-10, Dhaka)' : 'Address'}
                className="rounded-xl border border-border bg-background p-2 font-semibold"
                required
              />
              <input
                type="text"
                value={newStorePhone}
                onChange={(e) => setNewStorePhone(e.target.value)}
                placeholder={isBn ? 'ফোন নম্বর' : 'Phone Number'}
                className="rounded-xl border border-border bg-background p-2 font-semibold"
                required
              />
              <div className="col-span-2 text-right">
                <button
                  type="submit"
                  disabled={submittingStore}
                  className="rounded-xl bg-emerald-600 px-4 py-2 font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                >
                  {submittingStore ? 'তৈরি হচ্ছে...' : (isBn ? '+ ব্রাঞ্চ যোগ করুন' : '+ Add Branch')}
                </button>
              </div>
            </form>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              {loadingStores ? (
                <div className="flex h-32 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : stores.length === 0 ? (
                <div className="py-6 text-center text-xs font-bold text-muted-foreground">
                  {isBn ? 'কোনো আউটলেট পাওয়া যায়নি' : 'No store outlets found'}
                </div>
              ) : (
                stores.map((s) => (
                  <div key={s.id} className="p-3 rounded-2xl border border-border bg-muted/10 flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-extrabold text-foreground">{s.name} ({s.code})</h4>
                      <p className="text-[11px] text-muted-foreground">{s.address} • {s.phone}</p>
                    </div>
                    {s.isMainBranch && (
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-black text-indigo-700 border border-indigo-200">
                        Main Branch
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
