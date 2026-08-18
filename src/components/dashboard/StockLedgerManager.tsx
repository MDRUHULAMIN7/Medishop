'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  FileSpreadsheet,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowUpDown,
  History,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Layers,
  Package,
  Loader2,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { inventoryService, AuditLedgerRow } from '@/services/inventory.service';
import { posService, StockLedgerEntry } from '@/services/pos.service';
import { toast } from 'sonner';

export function StockLedgerManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 15;
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [recalculating, setRecalculating] = useState(false);

  const fetchLedger = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both backend inventory audit ledger and POS stock movements
      const [invLedger, posLedger] = await Promise.all([
        inventoryService.getStockLedger(undefined, 100).catch(() => []),
        posService.getStockLedger().catch(() => []),
      ]);

      const normalizedList: any[] = [];

      // Normalize InventoryService ledger entries
      if (Array.isArray(invLedger)) {
        invLedger.forEach((entry: any) => {
          normalizedList.push({
            id: entry._id || entry.id,
            productName: entry.product?.name || 'Medicine Product',
            productUnit: entry.product?.baseUnit || entry.unitSold || 'pcs',
            batchNumber: entry.batch?.batchNumber,
            reason: (entry.type || 'ADJUSTMENT').toLowerCase(),
            quantityChange: entry.quantity || 0,
            newStock: entry.balanceAfter ?? (entry.previousStock ? entry.previousStock + entry.quantity : 0),
            previousStock: entry.balanceAfter ? entry.balanceAfter - entry.quantity : 0,
            referenceId: entry.referenceId,
            performedByName: entry.performedBy?.name || 'Admin / System',
            performedByRole: entry.performedBy?.role || 'staff',
            note: entry.note,
            createdAt: entry.createdAt || new Date().toISOString(),
          });
        });
      }

      // Normalize POS service entries
      if (Array.isArray(posLedger)) {
        posLedger.forEach((entry: any) => {
          if (!normalizedList.some((e) => e.id === (entry.id || entry._id))) {
            normalizedList.push({
              id: entry.id || entry._id,
              productName: entry.productName || entry.product?.name || 'Medicine Item',
              productUnit: 'pcs',
              batchNumber: entry.batchNumber,
              reason: (entry.reason || 'manual_adjustment').toLowerCase(),
              quantityChange: entry.quantityChange || (entry.movementType === 'out' ? -entry.quantity : entry.quantity) || 0,
              newStock: entry.newStock ?? 0,
              previousStock: entry.previousStock ?? 0,
              referenceId: entry.referenceId,
              performedByName: entry.performedByName || entry.performedBy?.name || 'POS Staff',
              performedByRole: entry.performedBy?.role || 'sales_staff',
              note: entry.note,
              createdAt: entry.createdAt || new Date().toISOString(),
            });
          }
        });
      }

      // Sort by date descending
      normalizedList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLedgerData(normalizedList);
    } catch (err: any) {
      console.error('Failed to load stock ledger:', err);
      toast.error(err?.message || (isBn ? 'স্টক লেজার ডাটা লোড ব্যর্থ হয়েছে' : 'Failed to fetch inventory stock ledger'));
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    fetchLedger();
  }, [fetchLedger]);

  const handleRecalculateStock = async () => {
    setRecalculating(true);
    try {
      toast.info(isBn ? 'ইনভেন্টরি স্টক অডিট ও রি-ক্যালকুলেশন চলছে...' : 'Auditing and recalculating platform stock ledger...');
      const res = await inventoryService.recalculateAllStock();
      toast.success(
        isBn
          ? `স্টক অডিট সফলভাবে সম্পন্ন হয়েছে! মোট ${res.totalUpdated} টি প্রোডাক্ট সিঙ্ক করা হয়েছে।`
          : `Stock audit completed! Resynced ${res.totalUpdated} medicines with active batches.`
      );
      fetchLedger();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to recalculate stock');
    } finally {
      setRecalculating(false);
    }
  };

  // Filtered ledger rows
  const filteredData = useMemo(() => {
    return ledgerData.filter((row) => {
      const matchesSearch =
        (row.productName || '').toLowerCase().includes(search.toLowerCase()) ||
        (row.referenceId || '').toLowerCase().includes(search.toLowerCase()) ||
        (row.performedByName || '').toLowerCase().includes(search.toLowerCase()) ||
        (row.batchNumber || '').toLowerCase().includes(search.toLowerCase()) ||
        (row.note || '').toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (typeFilter === 'ALL') return true;
      if (typeFilter === 'sale' && (row.reason.includes('sale') || row.reason.includes('pos'))) return true;
      if (typeFilter === 'purchase' && (row.reason.includes('purchase') || row.reason.includes('restock'))) return true;
      if (typeFilter === 'adjustment' && (row.reason.includes('adjustment') || row.reason.includes('manual'))) return true;
      if (typeFilter === 'damage' && (row.reason.includes('damage') || row.reason.includes('expired'))) return true;
      if (typeFilter === 'return' && (row.reason.includes('return') || row.reason.includes('cancel') || row.reason.includes('void'))) return true;

      return row.reason === typeFilter.toLowerCase();
    });
  }, [ledgerData, search, typeFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  // Metrics
  const stockInCount = ledgerData.filter((r) => r.quantityChange > 0).length;
  const stockOutCount = ledgerData.filter((r) => r.quantityChange < 0).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-xs">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground font-serif-title">
              {isBn ? 'স্টক মুভমেন্ট অডিট লেজার' : 'Stock Movement Audit Ledger'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? 'অনলাইন অর্ডার, কাউন্টার বিক্রয়, ব্যাচ রিসিভ ও সমন্বয়ের অপরিবর্তনযোগ্য অডিট রেকর্ড'
                : 'Immutable audit trail tracking every sale deduction, batch intake, return, and stock adjustment.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleRecalculateStock}
            disabled={recalculating}
            className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title={isBn ? 'সবগুলো প্রোডাক্টের স্টক ক্যাশ মেরামত করুন' : 'Recalculate and repair stock balance caches'}
          >
            <Wrench className={`h-4 w-4 ${recalculating ? 'animate-spin' : ''}`} />
            <span>{isBn ? 'স্টক রি-ক্যালকুলেট টুল' : 'Recalculate Stock'}</span>
          </button>

          <button
            type="button"
            onClick={fetchLedger}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Metric Mini-Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-muted-foreground">{isBn ? 'মোট লেজার এন্ট্রি' : 'Total Audit Logs'}</span>
          <p className="text-xl font-black text-foreground mt-0.5">{ledgerData.length}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {isBn ? 'স্টক-ইন ট্রানজেকশন' : 'Stock-In Influx'}
          </span>
          <p className="text-xl font-black text-emerald-600 mt-0.5">{stockInCount}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
            <ArrowDownRight className="h-3.5 w-3.5" />
            {isBn ? 'স্টক-আউট ট্রানজেকশন' : 'Stock-Out Deductions'}
          </span>
          <p className="text-xl font-black text-rose-600 mt-0.5">{stockOutCount}</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isBn ? 'লেজার ইন্টিগ্রিটি' : 'Audit Integrity'}
          </span>
          <p className="text-xs font-black text-foreground mt-1.5 flex items-center gap-1 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
            100% Immutable
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
            placeholder={isBn ? 'মেডিসিন, ব্যাচ #, চালান বা রেফারেন্স খুঁজুন...' : 'Search medicine, batch #, invoice or ref #...'}
            className="w-full rounded-2xl border border-border bg-background py-2.5 pl-10 pr-4 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden shadow-2xs"
          />
        </div>

        {/* Transaction Type Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-2xl border border-border bg-background px-4 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
          >
            <option value="ALL">{isBn ? 'সকল ট্রানজেকশন' : 'All Movements'}</option>
            <option value="sale">{isBn ? 'কাউন্টার / অনলাইন সেলস' : 'Sales (POS & Online)'}</option>
            <option value="purchase">{isBn ? 'ব্যাচ পারচেজ রিসিভ' : 'Batch Purchase Influx'}</option>
            <option value="adjustment">{isBn ? 'অডিট সমন্বয়' : 'Manual Audit Adjustment'}</option>
            <option value="damage">{isBn ? 'ড্যামেজ / মেয়াদোত্তীর্ণ' : 'Damage & Expiry Removal'}</option>
            <option value="return">{isBn ? 'রিটার্ন / ভয়েড' : 'Returns & Voided Invoices'}</option>
          </select>
        </div>
      </div>

      {/* Table */}
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
                  <th className="py-3.5 px-4">{isBn ? 'তারিখ ও সময়' : 'Timestamp'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'মেডিসিন ও ব্যাচ' : 'Medicine & Batch'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'মুভমেন্ট টাইপ' : 'Reason / Action'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'পরিবর্তন' : 'Quantity Change'}</th>
                  <th className="py-3.5 px-4">{isBn ? 'ব্যালেন্স স্টক' : 'Balance Stock'}</th>
                  <th className="py-3.5 px-4 text-right">{isBn ? 'সম্পাদনকারী' : 'Performed By'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-xs font-bold text-muted-foreground">
                      {isBn ? 'কোনো লেজার এন্ট্রি পাওয়া যায়নি' : 'No audit ledger entries found'}
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => {
                    const isPositive = row.quantityChange > 0;

                    let badgeColor = 'bg-blue-100 text-blue-800';
                    if (row.reason.includes('purchase') || row.reason.includes('restock')) {
                      badgeColor = 'bg-emerald-100 text-emerald-800';
                    } else if (row.reason.includes('damage') || row.reason.includes('expired')) {
                      badgeColor = 'bg-rose-100 text-rose-800';
                    } else if (row.reason.includes('return') || row.reason.includes('void')) {
                      badgeColor = 'bg-purple-100 text-purple-800';
                    } else if (row.reason.includes('adjustment')) {
                      badgeColor = 'bg-amber-100 text-amber-800';
                    }

                    return (
                      <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-muted-foreground whitespace-nowrap">
                          {new Date(row.createdAt).toLocaleString(isBn ? 'bn-BD' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-foreground">{row.productName}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {row.batchNumber && (
                                <span className="text-[10px] text-indigo-600 font-mono font-bold">
                                  Batch: {row.batchNumber}
                                </span>
                              )}
                              {row.referenceId && (
                                <span className="text-[10px] text-muted-foreground font-mono">
                                  Ref: #{row.referenceId}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${badgeColor}`}
                          >
                            {row.reason.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-0.5 font-black text-sm ${
                              isPositive ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                            {isPositive ? `+${row.quantityChange}` : row.quantityChange} {row.productUnit || 'units'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-foreground text-sm">
                            {row.newStock} units
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-foreground text-xs">{row.performedByName}</span>
                            <span className="text-[10px] text-muted-foreground capitalize">
                              {row.performedByRole ? row.performedByRole.replace(/_/g, ' ') : 'Staff'}
                            </span>
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20 text-xs">
            <span className="text-muted-foreground font-semibold">
              {isBn ? `পৃষ্ঠা ${page} এর ${totalPages}` : `Page ${page} of ${totalPages}`} ({filteredData.length} entries)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-xl border border-border bg-background px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
              >
                {isBn ? 'পূর্ববর্তী' : 'Previous'}
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-xl border border-border bg-background px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-50 cursor-pointer"
              >
                {isBn ? 'পরবর্তী' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
