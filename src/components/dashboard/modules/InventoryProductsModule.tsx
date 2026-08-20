'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Boxes,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Package,
  Layers,
  Calendar,
  Wrench,
  X,
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { ProductService, Product } from '@/services/product.service';
import {
  inventoryService,
  BatchItem,
  BatchSummaryData,
} from '@/services/inventory.service';
import { posService } from '@/services/pos.service';
import { exportRowsToExcel } from '@/lib/excelExport';
import { ExportExcelButton } from '@/components/dashboard/ExportExcelButton';

interface InventoryProductsModuleProps {
  isBn?: boolean;
}

export function InventoryProductsModule({ isBn = true }: InventoryProductsModuleProps) {
  // Server-side state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
  const [dosageFilter, setDosageFilter] = useState<string>('all');

  // Summary Metrics
  const [batchSummary, setBatchSummary] = useState<BatchSummaryData | null>(null);
  const [recalculatingAll, setRecalculatingAll] = useState(false);

  // Batches Modal / Drawer State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productBatches, setProductBatches] = useState<BatchItem[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // Edit Batch Modal State
  const [editingBatch, setEditingBatch] = useState<BatchItem | null>(null);
  const [editBatchNumber, setEditBatchNumber] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [editCostPrice, setEditCostPrice] = useState<number>(0);
  const [submittingEditBatch, setSubmittingEditBatch] = useState(false);

  // Receive Batch Modal State
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receiveBatchProduct, setReceiveBatchProduct] = useState<Product | null>(null);
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [batchQty, setBatchQty] = useState<number>(100);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [batchUnit, setBatchUnit] = useState('pcs');
  const [purchaseRef, setPurchaseRef] = useState('');
  const [submittingBatch, setSubmittingBatch] = useState(false);

  // Quick Adjust Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustQtyChange, setAdjustQtyChange] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<'purchase_restock' | 'manual_adjustment' | 'damage_expiry_writeoff'>('purchase_restock');
  const [adjustNote, setAdjustNote] = useState('');
  const [submittingAdjust, setSubmittingAdjust] = useState(false);

  // Server-side Product Fetch
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams: any = {
        page,
        limit,
        search: search.trim() || undefined,
        dosageForm: dosageFilter !== 'all' ? dosageFilter : undefined,
        includeInactive: true,
        isAdmin: true,
      };

      const res = await ProductService.getProducts(queryParams);
      setProducts(res.products || []);
      setTotalCount(res.total || 0);
      setTotalPages(res.totalPages || Math.ceil((res.total || 1) / limit) || 1);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ইনভেন্টরি লোড করতে ব্যর্থ হয়েছে' : 'Failed to fetch inventory'));
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, dosageFilter, isBn]);

  // Fetch Summary KPIs once
  const fetchSummary = useCallback(async () => {
    try {
      const summaryRes = await inventoryService.getBatchesSummary();
      setBatchSummary(summaryRes);
    } catch (err) {
      console.warn('Batch summary error:', err);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Open FEFO Batches Modal
  const handleViewBatches = async (product: Product) => {
    setSelectedProduct(product);
    setIsBatchModalOpen(true);
    try {
      setLoadingBatches(true);
      const batches = await inventoryService.getProductBatches(product.id);
      setProductBatches(batches || []);
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ব্যাচ লোড করা যায়নি' : 'Failed to load batches'));
    } finally {
      setLoadingBatches(false);
    }
  };

  // Open Edit Batch Modal
  const handleOpenEditBatch = (batch: BatchItem) => {
    setEditingBatch(batch);
    setEditBatchNumber(batch.batchNumber);
    setEditExpiryDate(new Date(batch.expiryDate).toISOString().slice(0, 10));
    setEditQuantity(batch.quantity);
    setEditCostPrice(batch.costPrice || 0);
  };

  // Submit Edit Batch
  const handleSubmitEditBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    try {
      setSubmittingEditBatch(true);
      await inventoryService.updateBatch(editingBatch._id, {
        batchNumber: editBatchNumber.trim(),
        expiryDate: editExpiryDate,
        quantity: Number(editQuantity),
        costPrice: Number(editCostPrice),
      });

      toast.success(isBn ? 'ব্যাচ সফলভাবে আপডেট হয়েছে!' : 'Batch updated successfully!');
      setEditingBatch(null);

      if (selectedProduct) {
        handleViewBatches(selectedProduct);
      }
      fetchProducts();
      fetchSummary();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ব্যাচ আপডেট ব্যর্থ হয়েছে' : 'Failed to update batch'));
    } finally {
      setSubmittingEditBatch(false);
    }
  };

  // Delete Batch
  const handleDeleteBatch = async (batchId: string, bNum: string) => {
    if (!confirm(isBn ? `আপনি কি ব্যাচ #${bNum} মুছে ফেলতে চান?` : `Are you sure you want to delete batch #${bNum}?`)) {
      return;
    }

    try {
      await inventoryService.deleteBatch(batchId);
      toast.success(isBn ? `ব্যাচ #${bNum} মুছে ফেলা হয়েছে` : `Batch #${bNum} deleted`);
      if (selectedProduct) {
        handleViewBatches(selectedProduct);
      }
      fetchProducts();
      fetchSummary();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ব্যাচ ডিলিট ব্যর্থ হয়েছে' : 'Failed to delete batch'));
    }
  };

  // Open Receive Batch Modal
  const handleOpenReceiveModal = (product?: Product) => {
    if (product) {
    setReceiveBatchProduct(product);
    setBatchUnit(product.unitType || 'pcs');
      setCostPrice(product.price ? Number((product.price * 0.75).toFixed(2)) : 0);
    } else {
      setReceiveBatchProduct(products[0] || null);
    }
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 2);
    setBatchNumber(`B-${Math.floor(10000 + Math.random() * 90000)}`);
    setExpiryDate(nextYear.toISOString().slice(0, 10));
    setBatchQty(100);
    setPurchaseRef(`PO-${Date.now().toString().slice(-6)}`);
    setIsReceiveModalOpen(true);
  };

  // Submit Receive Batch
  const handleSubmitReceiveBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiveBatchProduct) {
      toast.error(isBn ? 'অনুগ্রহ করে একটি ওষুধ নির্বাচন করুন' : 'Please select a medicine');
      return;
    }
    if (!batchNumber.trim() || !expiryDate || batchQty <= 0) {
      toast.error(isBn ? 'অনুগ্রহ করে সঠিক ব্যাচ নম্বর, মেয়াদ ও পরিমাণ দিন' : 'Please fill batch number, expiry date and valid quantity');
      return;
    }

    try {
      setSubmittingBatch(true);
      await inventoryService.receiveBatch({
        productId: receiveBatchProduct.id,
        batchNumber: batchNumber.trim(),
        expiryDate,
        quantity: Number(batchQty),
        costPrice: Number(costPrice) || 0,
        unit: batchUnit,
        purchaseReferenceId: purchaseRef.trim() || undefined,
      });

      toast.success(
        isBn
          ? `${receiveBatchProduct.name} এ নতুন ব্যাচ #${batchNumber} (+${batchQty} units) যুক্ত হয়েছে!`
          : `Batch #${batchNumber} received for ${receiveBatchProduct.name} (+${batchQty} units)!`
      );

      setIsReceiveModalOpen(false);
      fetchProducts();
      fetchSummary();
      if (selectedProduct && selectedProduct.id === receiveBatchProduct.id) {
        handleViewBatches(receiveBatchProduct);
      }
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ব্যাচ রিসিভ ব্যর্থ হয়েছে' : 'Failed to receive batch'));
    } finally {
      setSubmittingBatch(false);
    }
  };

  // Open Quick Stock Adjust
  const handleOpenAdjustModal = (product: Product) => {
    setAdjustProduct(product);
    setAdjustQtyChange(10);
    setAdjustReason('purchase_restock');
    setAdjustNote('');
    setIsAdjustModalOpen(true);
  };

  // Submit Stock Adjustment
  const handleSubmitStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProduct) return;

    try {
      setSubmittingAdjust(true);
      await posService.adjustStock({
        productId: adjustProduct.id,
        quantityChange: Number(adjustQtyChange),
        reason: adjustReason,
        note: adjustNote.trim() || undefined,
      });

      toast.success(
        isBn
          ? `${adjustProduct.name} স্টক সমন্বয় সফল হয়েছে! (${adjustQtyChange > 0 ? '+' : ''}${adjustQtyChange})`
          : `Stock adjusted for ${adjustProduct.name} (${adjustQtyChange > 0 ? '+' : ''}${adjustQtyChange})`
      );

      setIsAdjustModalOpen(false);
      fetchProducts();
      fetchSummary();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'স্টক সমন্বয় ব্যর্থ হয়েছে' : 'Failed to adjust stock'));
    } finally {
      setSubmittingAdjust(false);
    }
  };

  // Single Product Stock Recalculate
  const handleRecalculateSingle = async (product: Product) => {
    try {
      toast.info(isBn ? `${product.name} স্টক সিঙ্ক করা হচ্ছে...` : `Syncing stock for ${product.name}...`);
      const res = await inventoryService.recalculateProductStock(product.id);
      toast.success(
        isBn
          ? `${product.name} এর স্টক ব্যাচ অনুযায়ী সিঙ্ক হয়েছে! লাইভ স্টক: ${res.recalculatedStock} units`
          : `Stock resynced from active batches! Live: ${res.recalculatedStock} units`
      );
      fetchProducts();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to recalculate stock');
    }
  };

  // Global All Stocks Recalculate Tool
  const handleRecalculateAll = async () => {
    if (recalculatingAll) return;
    try {
      setRecalculatingAll(true);
      toast.info(isBn ? 'সেন্ট্রাল ইনভেন্টরি সম্পূর্ণ রি-সিঙ্ক ও অডিট চলছে...' : 'Auditing and resyncing all batch stocks...');
      const res = await inventoryService.recalculateAllStock();
      toast.success(
        isBn
          ? `ইনভেন্টরি অডিট সফল! মোট ${res.totalUpdated} টি ওষুধের স্টক ক্যাশ মেরামত হয়েছে।`
          : `Platform audit complete! Refreshed ${res.totalUpdated} medicine stocks.`
      );
      fetchProducts();
      fetchSummary();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to recalculate all stocks');
    } finally {
      setRecalculatingAll(false);
    }
  };

  // Client-side stock pill filtering on current server page
  const displayedProducts = products.filter((p) => {
    if (filterType === 'in_stock') return p.stock > 10;
    if (filterType === 'low_stock') return p.stock > 0 && p.stock <= 10;
    if (filterType === 'out_of_stock') return p.stock <= 0;
    return true;
  });

  const handleExport = async () => {
    try {
      const result = await ProductService.getProducts({ page: 1, limit: 10000, search: search.trim() || undefined, dosageForm: dosageFilter !== 'all' ? dosageFilter : undefined, includeInactive: true, isAdmin: true });
      const filtered = (result.products || []).filter((product) => {
        if (filterType === 'in_stock') return product.stock > 10;
        if (filterType === 'low_stock') return product.stock > 0 && product.stock <= 10;
        if (filterType === 'out_of_stock') return product.stock <= 0;
        return true;
      });
      exportRowsToExcel({ filename: `medishop-inventory-${new Date().toISOString().slice(0, 10)}`, sheets: [{ name: 'Stock', rows: filtered.map((product) => ({ Product: product.name, Unit: product.unitType, Stock: product.stock, SellingPrice: product.price, Status: product.stock <= 0 ? 'Out of stock' : product.stock <= 10 ? 'Low stock' : 'In stock' })) }] });
      toast.success('Inventory exported to Excel');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Inventory export failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Global Action Tools */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 shadow-xs">
            <Boxes className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground font-serif-title">
              {isBn ? 'ইনভেন্টরি ও ব্যাচ ট্র্যাকিং (FEFO)' : 'Inventory & FEFO Batch Management'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? 'সার্ভার-সাইড ড্রাগ ক্যাটালগ, লাইভ স্টক, ব্যাচ মেয়াদ ট্র্যাকিং ও স্বয়ংক্রিয় অডিট ব্যালেন্স'
                : 'Server-side paginated catalog, live batch expiry tracking, and instant stock balance audits.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <ExportExcelButton onClick={handleExport} />
          <button
            type="button"
            onClick={handleRecalculateAll}
            disabled={recalculatingAll}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/10 px-3.5 py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title={isBn ? 'সবগুলো ওষুধের স্টক মেরামত করুন' : 'Recalculate and repair all cached stocks'}
          >
            <Wrench className={`h-4 w-4 ${recalculatingAll ? 'animate-spin' : ''}`} />
            <span>{isBn ? 'স্টক রি-সিঙ্ক টুল' : 'Recalculate All'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenReceiveModal()}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>{isBn ? 'নতুন ব্যাচ রিসিভ' : 'Receive New Batch'}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground">{isBn ? 'মোট রেজিস্টার্ড মেডিসিন' : 'Total Medicine SKUs'}</span>
          <p className="text-2xl font-black text-foreground">{totalCount}</p>
          <span className="text-[10px] text-muted-foreground block">{isBn ? 'সেন্ট্রাল ক্যাটালগ' : 'In catalog'}</span>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground">{isBn ? 'সক্রিয় মোট ব্যাচ' : 'Active Batches'}</span>
          <p className="text-2xl font-black text-indigo-600">{batchSummary?.activeBatches || 0}</p>
          <span className="text-[10px] text-muted-foreground block">{isBn ? 'ফার্মেসি স্টক লট' : 'Recorded batches'}</span>
        </div>

        <div
          onClick={() => setFilterType(filterType === 'low_stock' ? 'all' : 'low_stock')}
          className={`rounded-2xl border p-4 shadow-2xs space-y-1 cursor-pointer transition-all ${
            filterType === 'low_stock' ? 'border-amber-400 bg-amber-500/10' : 'border-border bg-background hover:border-amber-300'
          }`}
        >
          <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            {isBn ? 'লো স্টক সতর্কতা' : 'Low Stock Warning'}
          </span>
          <p className="text-2xl font-black text-amber-600">
            {products.filter((p) => p.stock > 0 && p.stock <= 10).length}
          </p>
          <span className="text-[10px] text-muted-foreground block">{isBn ? '১০ ইউনিটের কম স্টক' : '≤ 10 units'}</span>
        </div>

        <div
          onClick={() => setFilterType(filterType === 'out_of_stock' ? 'all' : 'out_of_stock')}
          className={`rounded-2xl border p-4 shadow-2xs space-y-1 cursor-pointer transition-all ${
            filterType === 'out_of_stock' ? 'border-rose-400 bg-rose-500/10' : 'border-border bg-background hover:border-rose-300'
          }`}
        >
          <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" />
            {isBn ? 'স্টক শেষ (০ ইউনিট)' : 'Out of Stock'}
          </span>
          <p className="text-2xl font-black text-rose-600">
            {products.filter((p) => p.stock <= 0).length}
          </p>
          <span className="text-[10px] text-muted-foreground block">{isBn ? 'অবিলম্বে রিস্টক প্রয়োজন' : 'Needs restock'}</span>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-purple-600 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {isBn ? 'নিকটবর্তী মেয়াদোত্তীর্ণ' : 'Expiring Soon (<90d)'}
          </span>
          <p className="text-2xl font-black text-purple-600">{batchSummary?.expiringSoonCount || 0}</p>
          <span className="text-[10px] text-muted-foreground block">{isBn ? 'FEFO অগ্রাধিকার বিক্রয়' : 'FEFO priority'}</span>
        </div>
      </div>

      {/* Server Filter, Search & Dosage Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={isBn ? 'ওষুধের নাম, ব্র্যান্ড, জেনেরিক দিয়ে খুঁজুন...' : 'Search medicine name, brand, generic...'}
            className="w-full rounded-2xl border border-border bg-background py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden shadow-2xs"
          />
        </div>

        {/* Dosage Filter & Limit */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={dosageFilter}
            onChange={(e) => {
              setDosageFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-2xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
          >
            <option value="all">{isBn ? 'সকল ফর্ম' : 'All Dosage Forms'}</option>
            <option value="tablet">Tablet</option>
            <option value="capsule">Capsule</option>
            <option value="syrup">Syrup</option>
            <option value="injection">Injection</option>
            <option value="drop">Drop</option>
            <option value="ointment">Ointment</option>
          </select>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-2xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
          >
            <option value={15}>15 per page</option>
            <option value={30}>30 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {/* Main Medicine Inventory Table */}
      <div className="rounded-3xl border border-border bg-background shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border text-[11px] font-black uppercase text-muted-foreground tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">{isBn ? 'ওষুধ ও ফর্ম' : 'Medicine & Dosage'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'জেনেরিক ও প্রস্তুতকারক' : 'Generic & Manufacturer'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'মূল্য ও ইউনিট' : 'Unit Price & Pack'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'লাইভ সেন্ট্রাল স্টক' : 'Live Central Stock'}</th>
                  <th className="py-3.5 px-4 text-right">{isBn ? 'ব্যাচ ও স্টক অ্যাকশনস' : 'Batches & Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs font-bold text-muted-foreground">
                      {isBn ? 'কোনো ওষুধ পাওয়া যায়নি' : 'No medicine items found matching filter'}
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((p) => {
                    const isOutOfStock = p.stock <= 0;
                    const isLowStock = p.stock > 0 && p.stock <= 10;

                    return (
                      <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-foreground text-sm">
                              {isBn ? (p.nameBn || p.name) : (p.nameEn || p.name)}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                              {p.dosageForm} {p.strength ? `• ${p.strength}` : ''}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-foreground truncate max-w-xs">{p.genericName || 'Paracetamol'}</p>
                          <p className="text-[10px] text-muted-foreground">{p.brandName || p.brand || 'Beximco Pharma'}</p>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-black text-emerald-600 text-xs">৳{p.price?.toFixed(2)}</span>
                          <span className="text-[10px] text-muted-foreground block">
                            per {p.unitType || (p as any).baseUnit || 'pcs'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-black text-rose-700 border border-rose-500/20">
                              <AlertCircle className="h-3 w-3" /> 0 units
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-black text-amber-700 border border-amber-500/20">
                              <AlertCircle className="h-3 w-3" /> Low ({p.stock} units)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-500/20">
                              <Package className="h-3 w-3" /> {p.stock} units
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* View Batches Button */}
                            <button
                              type="button"
                              onClick={() => handleViewBatches(p)}
                              className="inline-flex items-center gap-1 rounded-xl border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-[11px] font-extrabold text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer"
                              title={isBn ? 'ব্যাচ সমূহ ও মেয়াদ দেখুন' : 'View batches and FEFO expiry'}
                            >
                              <Layers className="h-3.5 w-3.5" />
                              <span>{isBn ? 'ব্যাচসমূহ' : 'Batches'}</span>
                            </button>

                            {/* Receive Batch Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenReceiveModal(p)}
                              className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title={isBn ? 'নতুন ব্যাচ রিসিভ করুন' : 'Receive new batch intake'}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>{isBn ? 'রিসিভ' : '+ Batch'}</span>
                            </button>

                            {/* Quick Adjust Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenAdjustModal(p)}
                              className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-2.5 py-1 text-[11px] font-extrabold text-foreground hover:bg-muted transition-colors cursor-pointer"
                              title={isBn ? 'ম্যানুয়াল স্টক এডজাস্ট' : 'Quick stock adjust'}
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>

                            {/* Single Sync Tool */}
                            <button
                              type="button"
                              onClick={() => handleRecalculateSingle(p)}
                              className="p-1 rounded-xl border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                              title={isBn ? 'স্টক সিঙ্ক করুন' : 'Resync stock from batches'}
                            >
                              <RefreshCw className="h-3 w-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-Side Pagination Controls */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20 text-xs">
          <span className="text-muted-foreground font-semibold">
            {isBn ? `পৃষ্ঠা ${page} এর ${totalPages}` : `Page ${page} of ${totalPages}`} ({totalCount} {isBn ? 'টি ওষুধ' : 'total items'})
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="rounded-xl border border-border bg-background px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>{isBn ? 'পূর্ববর্তী' : 'Previous'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="rounded-xl border border-border bg-background px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer flex items-center gap-1"
            >
              <span>{isBn ? 'পরবর্তী' : 'Next'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* FEFO Batches Inspector Modal */}
      {isBatchModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-3xl border border-border bg-background p-6 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-foreground font-serif-title">
                    {selectedProduct.name} — {isBn ? 'ব্যাচ ও FEFO ট্র্যাকিং' : 'FEFO Batches'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBn ? 'বর্তমান মোট সেন্ট্রাল স্টক:' : 'Current Live Total Stock:'}{' '}
                    <strong className="text-emerald-600">{selectedProduct.stock} units</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsBatchModalOpen(false);
                    handleOpenReceiveModal(selectedProduct);
                  }}
                  className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{isBn ? 'নতুন ব্যাচ যোগ' : 'Add Batch'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingBatches ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : productBatches.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <p className="text-xs font-bold text-muted-foreground">
                    {isBn ? 'এই মেডিসিনের কোনো সক্রিয় ব্যাচ নেই।' : 'No active batches recorded for this medicine.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBatchModalOpen(false);
                      handleOpenReceiveModal(selectedProduct);
                    }}
                    className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
                  >
                    {isBn ? '+ প্রথম ব্যাচ রিসিভ করুন' : '+ Receive First Batch'}
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border text-[11px] font-black uppercase text-muted-foreground">
                    <tr>
                      <th className="py-2.5 px-3">{isBn ? 'ব্যাচ নম্বর' : 'Batch #'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'মেয়াদোত্তীর্ণের তারিখ' : 'Expiry Date'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'মজুদ পরিমাণ' : 'Quantity'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'ক্রয়মূল্য' : 'Cost Price'}</th>
                      <th className="py-2.5 px-3">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                      <th className="py-2.5 px-3 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {productBatches.map((batch) => {
                      const expDate = new Date(batch.expiryDate);
                      const isExpired = expDate < new Date();
                      const daysLeft = Math.ceil((expDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                      const isNearExpiry = !isExpired && daysLeft <= 90;

                      return (
                        <tr key={batch._id} className="hover:bg-muted/20">
                          <td className="py-2.5 px-3 font-mono font-bold text-foreground">
                            {batch.batchNumber}
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-foreground">
                            {expDate.toLocaleDateString()}
                            <span className="text-[10px] text-muted-foreground block">
                              {isExpired ? 'Expired' : `${daysLeft} days left`}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-extrabold text-foreground">
                            {batch.quantity} units
                          </td>
                          <td className="py-2.5 px-3 font-medium text-muted-foreground">
                            ৳{batch.costPrice?.toFixed(2) || '0.00'}
                          </td>
                          <td className="py-2.5 px-3">
                            {isExpired ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800 px-2 py-0.5 text-[10px] font-black">
                                Expired
                              </span>
                            ) : isNearExpiry ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px] font-black">
                                Near Expiry
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-black">
                                Healthy
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditBatch(batch)}
                                className="p-1 rounded-lg border border-border hover:bg-muted text-foreground cursor-pointer"
                                title={isBn ? 'ব্যাচ এডিট করুন' : 'Edit batch'}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBatch(batch._id, batch.batchNumber)}
                                className="p-1 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                                title={isBn ? 'ব্যাচ ডিলিট করুন' : 'Delete batch'}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
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

      {/* Edit Batch Modal */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'ব্যাচ বিবরণ এডিট করুন' : 'Edit Batch Details'}
                </h3>
                <p className="text-xs text-muted-foreground">Batch #{editingBatch.batchNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingBatch(null)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEditBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'ব্যাচ নম্বর:' : 'Batch Number:'}
                </label>
                <input
                  type="text"
                  value={editBatchNumber}
                  onChange={(e) => setEditBatchNumber(e.target.value)}
                  required
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-mono font-bold text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {isBn ? 'মেয়াদোত্তীর্ণের তারিখ:' : 'Expiry Date:'}
                  </label>
                  <input
                    type="date"
                    value={editExpiryDate}
                    onChange={(e) => setEditExpiryDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {isBn ? 'মজুদ পরিমাণ:' : 'Remaining Quantity:'}
                  </label>
                  <input
                    type="number"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value))}
                    min={0}
                    required
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'ক্রয়মূল্য (৳ Per Unit):' : 'Cost Price (৳):'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editCostPrice}
                  onChange={(e) => setEditCostPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="rounded-xl border border-border px-4 py-2 font-bold text-muted-foreground hover:bg-muted"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submittingEditBatch}
                  className="rounded-xl bg-primary px-5 py-2 font-extrabold text-white shadow-xs hover:bg-primary-dark disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingEditBatch && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isBn ? 'আপডেট সেভ করুন' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receive New Batch Modal */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'নতুন মেডিসিন ব্যাচ রিসিভ করুন' : 'Receive New Medicine Batch'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn ? 'পারচেজ ইনভেন্টরি ড্রাগ ইনটেক' : 'Purchase shipment batch intake'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReceiveModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReceiveBatch} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'মেডিসিন নির্বাচন করুন:' : 'Select Medicine:'}
                </label>
                <select
                  value={receiveBatchProduct?.id || ''}
                  onChange={(e) => {
                    const found = products.find((p) => p.id === e.target.value);
                    if (found) {
                      setReceiveBatchProduct(found);
                      setBatchUnit(found.unitType || found.unit || 'pcs');
                    }
                  }}
                  required
                  className="w-full rounded-2xl border border-border bg-background p-3 font-bold text-foreground shadow-2xs focus:border-primary focus:outline-hidden cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.dosageForm} • Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {isBn ? 'ব্যাচ নম্বর:' : 'Batch Number:'}
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    required
                    placeholder="e.g. BEX-2026-A1"
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-mono font-bold text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {isBn ? 'মেয়াদোত্তীর্ণের তারিখ:' : 'Expiry Date:'}
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {isBn ? 'পরিমাণ (Base Units):' : 'Batch Quantity:'}
                  </label>
                  <input
                    type="number"
                    value={batchQty}
                    onChange={(e) => setBatchQty(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {isBn ? 'ক্রয়মূল্য (নির্বাচিত ইউনিট):' : 'Buying Price (৳ per selected unit):'}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-muted-foreground mb-1">
                    {isBn ? 'ক্রয় ইউনিট:' : 'Buying Unit:'}
                  </label>
                  <select
                    value={batchUnit}
                    onChange={(e) => setBatchUnit(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                  >
                    {Array.from(new Set([
                      receiveBatchProduct?.unitType || receiveBatchProduct?.unit || 'pcs',
                      ...(receiveBatchProduct?.unitPrices || []).map((unit) => unit.unit),
                    ])).map((unit) => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dynamic Packaging Unit Buying Price & Batch Value Breakdown (Exact defined product packaging tiers) */}
              {receiveBatchProduct && costPrice > 0 && (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3.5 space-y-2.5 text-[11px]">
                  <div className="flex items-center justify-between font-extrabold text-foreground">
                    <span className="text-primary font-black">
                      {isBn ? 'প্যাকেজিং ইউনিট ক্রয়মূল্য হিসাব:' : 'Packaging Units Buying Price Scaling:'}
                    </span>
                    <span className="font-mono text-xs">Total Batch Cost: ৳{(costPrice * batchQty / Math.max(1, receiveBatchProduct.unitPrices.find((unit) => unit.unit === batchUnit)?.multiplier || 1)).toFixed(2)}</span>
                  </div>

                  {(() => {
                    const baseUnit = (receiveBatchProduct as any).baseUnit || receiveBatchProduct.unitType || receiveBatchProduct.unit || 'pcs';
                    const list: { label: string; qty: number; buyingPrice: number; isBase: boolean }[] = [];

                    // 1. Base Unit
                    list.push({
                      label: `Per Base Unit (${baseUnit})`,
                      qty: 1,
                      buyingPrice: costPrice,
                      isBase: true,
                    });

                    // 2. Read exact packaging array defined on the product
                    const rawPackaging = (receiveBatchProduct as any).packaging;
                    if (Array.isArray(rawPackaging) && rawPackaging.length > 0) {
                      rawPackaging.forEach((pkg: any) => {
                        const pkgUnit = pkg.unit;
                        const pkgQty = Number(pkg.baseUnitQty) || 1;
                        if (pkgUnit && pkgUnit.toLowerCase() !== baseUnit.toLowerCase() && pkg.isActive !== false) {
                          list.push({
                            label: `Per ${pkgUnit} (${pkgQty}x)`,
                            qty: pkgQty,
                            buyingPrice: costPrice * pkgQty,
                            isBase: false,
                          });
                        }
                      });
                    } else if (Array.isArray(receiveBatchProduct.unitPrices) && receiveBatchProduct.unitPrices.length > 0) {
                      receiveBatchProduct.unitPrices.forEach((up: any) => {
                        const upUnit = up.unit;
                        const upQty = Number(up.multiplier || up.baseUnitQty) || 1;
                        if (upUnit && upUnit.toLowerCase() !== baseUnit.toLowerCase()) {
                          list.push({
                            label: `Per ${upUnit} (${upQty}x)`,
                            qty: upQty,
                            buyingPrice: costPrice * upQty,
                            isBase: false,
                          });
                        }
                      });
                    }

                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {list.map((tier, tIdx) => (
                          <div key={tIdx} className="p-2.5 rounded-2xl bg-background border border-border shadow-2xs space-y-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground block uppercase truncate">
                              {tier.label}
                            </span>
                            <strong className="text-xs font-black text-foreground block">
                              ৳{tier.buyingPrice.toFixed(2)}
                            </strong>
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {receiveBatchProduct.price && receiveBatchProduct.price > 0 && (
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1.5 border-t border-border/60">
                      <span>Selling Price: ৳{receiveBatchProduct.price.toFixed(2)} / base unit</span>
                      <span className="font-bold text-emerald-600">
                        Estimated Margin: {(((receiveBatchProduct.price - costPrice) / receiveBatchProduct.price) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'পারচেজ অর্ডার রেফারেন্স # (ঐচ্ছিক):' : 'Purchase Ref / Invoice # (Optional):'}
                </label>
                <input
                  type="text"
                  value={purchaseRef}
                  onChange={(e) => setPurchaseRef(e.target.value)}
                  placeholder="e.g. PO-89210"
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsReceiveModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submittingBatch}
                  className="rounded-xl bg-primary px-5 py-2 font-extrabold text-white shadow-xs hover:bg-primary-dark disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {submittingBatch && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isBn ? 'ব্যাচ জমা করুন' : 'Confirm & Save Batch'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Adjustment Modal */}
      {isAdjustModalOpen && adjustProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'স্টক সমন্বয় করুন' : 'Adjust Stock Quantity'}
                </h3>
                <p className="text-xs text-muted-foreground truncate max-w-xs">{adjustProduct.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitStockAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'বর্তমান সেন্ট্রাল স্টক:' : 'Current Stock:'}
                </label>
                <div className="p-2.5 rounded-xl bg-muted/40 font-black text-sm text-foreground">
                  {adjustProduct.stock} units
                </div>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'স্টক পরিবর্তনের সংখ্যা (+ অথবা -):' : 'Stock Quantity Change (+ or -):'}
                </label>
                <input
                  type="number"
                  value={adjustQtyChange}
                  onChange={(e) => setAdjustQtyChange(Number(e.target.value))}
                  required
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                />
                <span className="text-[10px] text-muted-foreground mt-0.5 block">
                  {isBn ? 'নতুন স্টক হবে:' : 'New stock will be:'}{' '}
                  <strong className="text-emerald-600">{adjustProduct.stock + adjustQtyChange} units</strong>
                </span>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'সমন্বয়ের কারণ:' : 'Adjustment Reason:'}
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value as any)}
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-bold text-foreground focus:border-primary focus:outline-hidden"
                >
                  <option value="purchase_restock">{isBn ? 'নতুন পারচেজ / রিস্টক' : 'Purchase Restock'}</option>
                  <option value="manual_adjustment">{isBn ? 'ফিজিক্যাল অডিট গণনা' : 'Physical Audit Count'}</option>
                  <option value="damage_expiry_writeoff">{isBn ? 'মেয়াদোত্তীর্ণ / ড্যামেজ রাইট-অফ' : 'Damage/Expiry Write-off'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">
                  {isBn ? 'অডিট নোট / রিমার্কস (ঐচ্ছিক):' : 'Audit Note (Optional):'}
                </label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder={isBn ? 'যেমন: ফিজিক্যাল স্টক কাউন্ট ভেরিফিকেশন...' : 'e.g. Physical inventory count verified...'}
                  className="w-full rounded-xl border border-border bg-background p-2.5 font-medium text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 font-bold text-muted-foreground hover:bg-muted"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjust}
                  className="rounded-xl bg-primary px-5 py-2 font-black text-white shadow-xs hover:bg-primary-dark disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingAdjust && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isBn ? 'স্টক সেভ করুন' : 'Save Adjustment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
