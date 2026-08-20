'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CalendarDays, CircleDollarSign, Loader2, Package, RefreshCw, TrendingDown, TrendingUp, Users } from 'lucide-react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { exportRowsToExcel } from '@/lib/excelExport';
import { adminService, AdminAnalyticsFilters, AdminAnalyticsResponse } from '@/services/admin.service';
import { ProductService, Product } from '@/services/product.service';
import { useCategories } from '@/hooks/useCategories';
import { ExportExcelButton } from '@/components/dashboard/ExportExcelButton';
import { toast } from 'sonner';

type DatePreset = 'today' | '7d' | '30d' | 'month' | 'custom';
const money = (value: number) => formatBDT(Number(value || 0));
const dateString = (date: Date) => date.toISOString().slice(0, 10);

function getPresetRange(preset: DatePreset) {
  const to = new Date();
  const from = new Date(to);
  if (preset === 'today') from.setHours(0, 0, 0, 0);
  if (preset === '7d') from.setDate(from.getDate() - 6);
  if (preset === '30d') from.setDate(from.getDate() - 29);
  if (preset === 'month') from.setDate(1);
  return { from: dateString(from), to: dateString(to) };
}

function StatCard({ label, value, icon: Icon, tone = 'blue', detail }: { label: string; value: string; icon: typeof TrendingUp; tone?: 'blue' | 'green' | 'amber' | 'rose' | 'purple'; detail?: string }) {
  const tones = { blue: 'bg-blue-500/10 text-blue-600', green: 'bg-emerald-500/10 text-emerald-600', amber: 'bg-amber-500/10 text-amber-600', rose: 'bg-rose-500/10 text-rose-600', purple: 'bg-purple-500/10 text-purple-600' };
  return <div className="rounded-2xl border border-border bg-background p-4 shadow-2xs"><div className="flex items-start justify-between gap-3"><span className="text-xs font-bold text-muted-foreground">{label}</span><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}><Icon className="h-4 w-4" /></span></div><p className="mt-3 text-xl font-black tracking-tight text-foreground">{value}</p>{detail && <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{detail}</p>}</div>;
}

function TrendChart({ trend }: { trend: AdminAnalyticsResponse['trend'] }) {
  const values = trend.map((item) => item.revenue);
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${100 - (value / max) * 82}`).join(' ');
  return <div className="rounded-2xl border border-border bg-background p-5 shadow-2xs"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black text-foreground">Sales trend</h3><p className="text-[11px] text-muted-foreground">Revenue by selected date</p></div><TrendingUp className="h-4 w-4 text-primary" /></div><div className="mt-5 h-48 rounded-xl bg-muted/20 p-3">{trend.length ? <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible"><polyline fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" className="text-primary" points={points} /></svg> : <div className="flex h-full items-center justify-center text-xs font-semibold text-muted-foreground">No sales in this range</div>}</div><div className="mt-2 flex justify-between text-[10px] font-semibold text-muted-foreground"><span>{trend[0]?.date || '—'}</span><span>{trend[trend.length - 1]?.date || '—'}</span></div></div>;
}

function BarList({ title, items, metric }: { title: string; items: Array<{ name: string; quantity: number; revenue: number }>; metric: 'quantity' | 'revenue' }) {
  const max = Math.max(...items.map((item) => item[metric]), 1);
  return <div className="rounded-2xl border border-border bg-background p-5 shadow-2xs"><h3 className="text-sm font-black text-foreground">{title}</h3><div className="mt-4 space-y-3">{items.length ? items.slice(0, 6).map((item) => <div key={item.name}><div className="mb-1 flex justify-between gap-3 text-[11px] font-bold"><span className="truncate text-foreground">{item.name}</span><span className="shrink-0 text-muted-foreground">{metric === 'revenue' ? money(item.revenue) : `${item.quantity} units`}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, (item[metric] / max) * 100)}%` }} /></div></div>) : <p className="text-xs text-muted-foreground">No product sales in this range.</p>}</div></div>;
}

export function ReportsManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const [preset, setPreset] = useState<DatePreset>('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [channel, setChannel] = useState<'all' | 'online' | 'pos'>('all');
  const [categoryId, setCategoryId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productId, setProductId] = useState('');
  const [productOptions, setProductOptions] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const { categories } = useCategories(true);
  const range = useMemo(() => preset === 'custom' ? { from: customFrom, to: customTo } : getPresetRange(preset), [customFrom, customTo, preset]);
  const filters = useMemo<AdminAnalyticsFilters>(() => ({ dateFrom: range.from || undefined, dateTo: range.to || undefined, channel, productId: productId || undefined, categoryId: categoryId || undefined, staffId: staffId || undefined }), [categoryId, channel, productId, range.from, range.to, staffId]);
  const fetchReports = useCallback(async () => { setLoading(true); try { setAnalytics(await adminService.getAnalytics(filters)); } catch (error) { toast.error(error instanceof Error ? error.message : 'Failed to fetch analytics reports'); } finally { setLoading(false); } }, [filters]);
  useEffect(() => { void fetchReports(); }, [fetchReports]);
  useEffect(() => {
    const query = productSearch.trim();
    if (!query) { setProductOptions([]); return; }
    const timer = window.setTimeout(() => { void ProductService.getProducts({ search: query, limit: 8 }).then((result) => setProductOptions(result.products)).catch(() => setProductOptions([])); }, 300);
    return () => window.clearTimeout(timer);
  }, [productSearch]);
  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await adminService.getAnalytics(filters, true);
      const summary = result.summary;
      exportRowsToExcel({ filename: `medishop-report-${range.from || 'all'}-${range.to || 'all'}`, sheets: [
        { name: 'Summary', rows: [{ Metric: 'Revenue', Value: summary.revenue }, { Metric: 'Gross Profit', Value: summary.grossProfit }, { Metric: 'Purchase Cost', Value: summary.purchaseCost }, { Metric: 'Profit Margin %', Value: summary.profitMargin }, { Metric: 'Total Sales', Value: summary.totalSales }, { Metric: 'Online Revenue', Value: summary.onlineSales }, { Metric: 'POS Revenue', Value: summary.posSales }, { Metric: 'Refund Amount', Value: summary.refundAmount }] },
        { name: 'Sales', rows: (result.rows || []).map((row) => ({ Date: row.date, Channel: row.channel, Reference: row.reference, Product: row.product, Quantity: row.quantity, UnitPrice: row.unitPrice, Revenue: row.revenue, BuyingCost: row.buyingCost, Profit: row.profit })) },
        { name: 'Products', rows: result.topProducts.map((row) => ({ Product: row.name, QuantitySold: row.quantity, Revenue: row.revenue, Profit: row.profit })) },
        { name: 'Stock', rows: result.stockStatus.map((row) => ({ Status: row.name, Products: row.value })) },
        { name: 'Profit & Loss', rows: result.trend.map((row) => ({ Date: row.date, Revenue: row.revenue, BuyingCost: row.buyingCost, Profit: row.profit })) },
      ] });
      toast.success('Report exported to Excel');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Export failed'); } finally { setExporting(false); }
  };
  const summary = analytics?.summary;
  const productItems = analytics?.topProducts || [];
  return <div className="flex flex-col gap-5">
    <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-primary">{isBn ? 'রিপোর্ট' : 'Reports & analytics'}</p><h2 className="mt-1 text-xl font-black text-foreground">Business performance overview</h2><p className="mt-1 text-xs text-muted-foreground">Backend-aggregated sales, profit and inventory intelligence.</p></div><div className="flex flex-wrap items-center gap-2"><select value={preset} onChange={(event) => setPreset(event.target.value as DatePreset)} className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold"><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option value="month">This month</option><option value="custom">Custom range</option></select><select value={channel} onChange={(event) => setChannel(event.target.value as 'all' | 'online' | 'pos')} className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-bold"><option value="all">All channels</option><option value="online">Online</option><option value="pos">POS</option></select><ExportExcelButton onClick={handleExport} loading={exporting} /><button type="button" onClick={() => void fetchReports()} className="inline-flex h-9 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold hover:bg-muted"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh</button></div></div>
    {preset === 'custom' && <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-muted/20 p-3"><CalendarDays className="h-4 w-4 text-primary" /><input type="date" value={customFrom} onChange={(event) => setCustomFrom(event.target.value)} className="h-8 rounded-lg border border-border bg-background px-2 text-xs" /><span className="text-xs text-muted-foreground">to</span><input type="date" value={customTo} onChange={(event) => setCustomTo(event.target.value)} className="h-8 rounded-lg border border-border bg-background px-2 text-xs" /></div>}
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-background p-3"><input value={productSearch} onChange={(event) => { setProductSearch(event.target.value); setProductId(''); }} placeholder="Product filter" className="h-8 w-44 rounded-lg border border-border bg-background px-2 text-xs" /><select value={productId} onChange={(event) => setProductId(event.target.value)} className="h-8 max-w-48 rounded-lg border border-border bg-background px-2 text-xs"><option value="">All products</option>{productOptions.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="h-8 max-w-48 rounded-lg border border-border bg-background px-2 text-xs"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select><input value={staffId} onChange={(event) => setStaffId(event.target.value)} placeholder="Staff ID (optional)" className="h-8 w-36 rounded-lg border border-border bg-background px-2 text-xs" /></div>
    {loading && !analytics ? <div className="flex min-h-72 items-center justify-center rounded-2xl border border-border bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : <><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Revenue" value={money(summary?.revenue || 0)} icon={CircleDollarSign} tone="blue" detail={`${summary?.totalSales || 0} sales`} /><StatCard label="Gross profit" value={money(summary?.grossProfit || 0)} icon={TrendingUp} tone="green" detail={`${summary?.profitMargin || 0}% margin`} /><StatCard label="Purchase cost" value={money(summary?.purchaseCost || 0)} icon={Package} tone="amber" detail={`Selling value ${money(summary?.sellingValue || 0)}`} /><StatCard label="Stock value" value={money(summary?.stockValue || 0)} icon={BarChart3} tone="purple" detail={`${summary?.lowStock || 0} low · ${summary?.outOfStock || 0} out`} /><StatCard label="Refunds / loss" value={money((summary?.refundAmount || 0) + (summary?.loss || 0))} icon={TrendingDown} tone="rose" detail={`${summary?.refundCount || 0} refunds`} /></div><div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.5fr_1fr]"><TrendChart trend={analytics?.trend || []} /><div className="rounded-2xl border border-border bg-background p-5 shadow-2xs"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black">Channel mix</h3><p className="text-[11px] text-muted-foreground">Revenue contribution</p></div><Users className="h-4 w-4 text-primary" /></div><div className="mt-5 flex items-center gap-5"><div className="h-32 w-32 shrink-0 rounded-full" style={{ background: `conic-gradient(#2563eb ${((summary?.onlineSales || 0) / Math.max((summary?.onlineSales || 0) + (summary?.posSales || 0), 1)) * 100}%, #f59e0b 0)` }} /><div className="space-y-3 text-xs font-bold"><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />Online {money(summary?.onlineSales || 0)}</p><p><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />POS {money(summary?.posSales || 0)}</p></div></div></div></div><div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><BarList title="Top selling products" items={productItems} metric="quantity" /><BarList title="Product revenue" items={productItems} metric="revenue" /></div><div className="grid grid-cols-1 gap-5 lg:grid-cols-3"><div className="rounded-2xl border border-border bg-background p-5 shadow-2xs"><h3 className="text-sm font-black">Stock status</h3><div className="mt-4 space-y-3">{(analytics?.stockStatus || []).map((item) => <div key={item.name} className="flex items-center justify-between rounded-xl bg-muted/20 p-3 text-xs font-bold"><span>{item.name}</span><span className="text-primary">{item.value}</span></div>)}</div></div><div className="rounded-2xl border border-border bg-background p-5 shadow-2xs"><h3 className="text-sm font-black">Operations</h3><div className="mt-4 space-y-3 text-xs font-bold"><div className="flex justify-between"><span className="text-muted-foreground">Product units sold</span><span>{summary?.productSales || 0}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Audit movements</span><span>{summary?.auditActivity || 0}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Gross loss</span><span className="text-rose-600">{money(summary?.loss || 0)}</span></div></div></div><div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5"><div className="flex items-center gap-2 text-amber-800"><AlertTriangle className="h-4 w-4" /><h3 className="text-sm font-black">Low selling products</h3></div><div className="mt-4 space-y-2 text-xs font-semibold text-amber-900">{(analytics?.lowSellingProducts || []).slice(0, 5).map((item) => <div key={item.name} className="flex justify-between gap-3"><span className="truncate">{item.name}</span><span>{item.quantity}</span></div>)}</div></div></div></>}
  </div>;
}
