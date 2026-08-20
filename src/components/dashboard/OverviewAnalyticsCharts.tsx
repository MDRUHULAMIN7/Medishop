'use client';

import { useEffect, useState } from 'react';
import { BarChart3, CircleDollarSign, Loader2, Package, TrendingUp } from 'lucide-react';
import { adminService, AdminAnalyticsResponse } from '@/services/admin.service';
import { formatBDT } from '@/lib/utils';

interface OverviewAnalyticsChartsProps {
  channel?: 'all' | 'pos';
}

export function OverviewAnalyticsCharts({ channel = 'all' }: OverviewAnalyticsChartsProps) {
  const [data, setData] = useState<AdminAnalyticsResponse | null>(null);
  useEffect(() => {
    let active = true;
    void adminService.getAnalytics({ channel, dateFrom: new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10), dateTo: new Date().toISOString().slice(0, 10) }).then((result) => { if (active) setData(result); }).catch(() => undefined);
    return () => { active = false; };
  }, [channel]);
  if (!data) return <div className="flex h-44 items-center justify-center rounded-2xl border border-border bg-background"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>;
  const max = Math.max(...data.trend.map((item) => item.revenue), 1);
  return <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_1fr]">
    <div className="rounded-2xl border border-border bg-background p-5 shadow-2xs"><div className="flex items-center justify-between"><div><h3 className="text-sm font-black">30-day performance</h3><p className="text-[11px] text-muted-foreground">Revenue and profit trend</p></div><TrendingUp className="h-4 w-4 text-primary" /></div><div className="mt-5 grid h-36 grid-cols-12 items-end gap-1.5">{data.trend.slice(-12).map((item) => <div key={item.date} className="group flex h-full flex-col justify-end gap-1"><div className="relative flex-1"><div className="absolute bottom-0 left-0 right-0 rounded-t-md bg-primary/20" style={{ height: `${Math.max(5, (item.revenue / max) * 100)}%` }} /><div className="absolute bottom-0 left-1/4 right-1/4 rounded-t-md bg-primary" style={{ height: `${Math.max(4, (item.profit / max) * 100)}%` }} /></div><span className="text-center text-[8px] text-muted-foreground">{item.date.slice(5)}</span></div>)}</div><div className="mt-3 flex gap-4 text-[10px] font-bold text-muted-foreground"><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-primary/20" />Revenue</span><span><i className="mr-1 inline-block h-2 w-2 rounded-sm bg-primary" />Profit</span></div></div>
    <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border border-border bg-background p-4 shadow-2xs"><CircleDollarSign className="h-4 w-4 text-primary" /><p className="mt-2 text-[11px] font-bold text-muted-foreground">Revenue</p><p className="mt-1 text-lg font-black">{formatBDT(data.summary.revenue)}</p></div><div className="rounded-2xl border border-border bg-background p-4 shadow-2xs"><BarChart3 className="h-4 w-4 text-emerald-600" /><p className="mt-2 text-[11px] font-bold text-muted-foreground">Gross profit</p><p className="mt-1 text-lg font-black text-emerald-600">{formatBDT(data.summary.grossProfit)}</p></div><div className="rounded-2xl border border-border bg-background p-4 shadow-2xs"><Package className="h-4 w-4 text-amber-600" /><p className="mt-2 text-[11px] font-bold text-muted-foreground">Stock value</p><p className="mt-1 text-lg font-black">{formatBDT(data.summary.stockValue)}</p></div><div className="rounded-2xl border border-border bg-background p-4 shadow-2xs"><TrendingUp className="h-4 w-4 text-purple-600" /><p className="mt-2 text-[11px] font-bold text-muted-foreground">Profit margin</p><p className="mt-1 text-lg font-black">{data.summary.profitMargin}%</p></div></div>
  </div>;
}
