'use client';

import { useState } from 'react';
import { AlertTriangle, BarChart3, Boxes, Calendar, CircleDollarSign, Loader2, Package, X } from 'lucide-react';
import { Product, ProductService } from '@/services/product.service';
import { adminService, ProductInsightsResponse } from '@/services/admin.service';
import { RecognitionCandidate } from '@/services/posScanner.service';
import { ProductRecognitionScanner } from '@/components/dashboard/pos/ProductRecognitionScanner';
import { formatBDT } from '@/lib/utils';

interface ProductInsightsScannerPanelProps {
  isBn?: boolean;
  onManualSearch: () => void;
}

export function ProductInsightsScannerPanel({ isBn = false, onManualSearch }: ProductInsightsScannerPanelProps) {
  const [insights, setInsights] = useState<ProductInsightsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const getUnitOptions = (product: Product) => (product.unitPrices || [{ unit: product.unitType, multiplier: 1, price: product.price }]).map((unit) => ({ unit: unit.unit, multiplier: unit.multiplier || 1, price: unit.price }));
  const handleCandidateSelected = async (candidate: RecognitionCandidate) => {
    const product = ProductService.formatProduct(candidate.product);
    if (!product.id) return;
    setLoading(true);
    try {
      setInsights(await adminService.getProductInsights(product.id));
    } finally {
      setLoading(false);
    }
  };

  return <>
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-sm font-black text-foreground">Scan product intelligence</h3><p className="mt-1 text-[11px] text-muted-foreground">Use the camera to inspect stock, sales and margin without leaving the dashboard.</p></div><ProductRecognitionScanner isBn={isBn} getUnitOptions={getUnitOptions} onAddToCart={() => true} onManualSearch={onManualSearch} onCandidateSelected={(candidate) => { void handleCandidateSelected(candidate); }} /></div></div>
    {(loading || insights) && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-lg rounded-3xl border border-border bg-background p-5 shadow-2xl"><div className="flex items-center justify-between border-b border-border pb-3"><div><p className="text-[10px] font-bold uppercase tracking-wider text-primary">Product intelligence</p><h3 className="mt-1 text-base font-black text-foreground">{insights?.product.name || 'Loading product details'}</h3></div><button type="button" onClick={() => setInsights(null)} className="rounded-xl p-2 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button></div>{loading ? <div className="flex h-44 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : insights && <div className="mt-4 space-y-4"><div className="grid grid-cols-2 gap-3 sm:grid-cols-4"><div className="rounded-2xl bg-muted/30 p-3"><Boxes className="h-4 w-4 text-primary" /><p className="mt-2 text-[10px] font-bold text-muted-foreground">Stock</p><p className="text-lg font-black">{insights.product.stock}</p></div><div className="rounded-2xl bg-muted/30 p-3"><CircleDollarSign className="h-4 w-4 text-emerald-600" /><p className="mt-2 text-[10px] font-bold text-muted-foreground">Selling price</p><p className="text-sm font-black">{formatBDT(insights.product.price)}</p></div><div className="rounded-2xl bg-muted/30 p-3"><Package className="h-4 w-4 text-amber-600" /><p className="mt-2 text-[10px] font-bold text-muted-foreground">Units sold</p><p className="text-lg font-black">{insights.sales.totalQuantity}</p></div><div className="rounded-2xl bg-muted/30 p-3"><BarChart3 className="h-4 w-4 text-purple-600" /><p className="mt-2 text-[10px] font-bold text-muted-foreground">Revenue</p><p className="text-sm font-black">{formatBDT(insights.sales.totalRevenue)}</p></div></div><div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-2xl border border-border p-3"><p className="font-bold text-muted-foreground">Online sales</p><p className="mt-1 font-black">{insights.sales.onlineQuantity} units · {formatBDT(insights.sales.onlineRevenue)}</p></div><div className="rounded-2xl border border-border p-3"><p className="font-bold text-muted-foreground">POS sales</p><p className="mt-1 font-black">{insights.sales.posQuantity} units · {formatBDT(insights.sales.posRevenue)}</p></div></div><div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground"><span>{insights.product.category || 'Uncategorised'} · {insights.product.brand || 'No brand'}</span>{insights.sales.lastSaleAt && <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Last sale {new Date(insights.sales.lastSaleAt).toLocaleDateString()}</span>}{insights.product.stock <= insights.product.lowStockThreshold && <span className="inline-flex items-center gap-1 text-amber-600"><AlertTriangle className="h-3.5 w-3.5" /> Low stock</span>}</div></div>}</div></div>}
  </>;
}
