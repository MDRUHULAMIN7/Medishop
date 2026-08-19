'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { adminService, DashboardSummaryResponse } from '@/services/admin.service';
import { orderService } from '@/services/order.service';
import { useBranding } from '@/context/BrandingContext';
import { toast } from 'sonner';

export function OverviewTab() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const { settings } = useBranding();
  const siteName = settings.general?.siteName || 'mediShop';

  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [sumData, ordersRes] = await Promise.all([
        adminService.getDashboardSummary(),
        orderService.getAllOrders('limit=6'),
      ]);

      setSummary(sumData);
      const ordersList = Array.isArray(ordersRes) ? ordersRes : ordersRes?.data || ordersRes?.orders || [];
      setRecentOrders(ordersList.slice(0, 5));
    } catch (err: any) {
      console.error('Failed to load admin summary:', err);
      toast.error(err?.message || 'Failed to fetch live admin dashboard KPIs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const salesRev = summary?.salesSummary?.combinedRevenue || 0;
  const totalOrdersCount = summary?.salesSummary?.totalOrders || 0;
  const posSalesCount = summary?.salesSummary?.totalPosSales || 0;
  const customersCount = summary?.userMetrics?.totalCustomers || 0;
  const pendingRxCount = summary?.userMetrics?.pendingPrescriptions || 0;
  const lowStockCount = summary?.lowStockItemsCount || 0;

  const kpiCards = [
    {
      id: 'sales',
      titleBn: 'মোট আয় (অনলাইন + POS)',
      titleEn: 'Total Revenue (Online + POS)',
      value: formatBDT(salesRev),
      trend: `Today: ${formatBDT(summary?.salesSummary?.todayRevenue || 0)}`,
      trendUp: true,
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600 text-white',
    },
    {
      id: 'orders',
      titleBn: 'মোট অর্ডার সংখ্যা',
      titleEn: 'Total Online Orders',
      value: totalOrdersCount.toLocaleString(),
      trend: `Today: ${summary?.salesSummary?.todayOrdersCount || 0} new`,
      trendUp: true,
      icon: ShoppingBag,
      color: 'from-emerald-600 to-teal-600 text-white',
    },
    {
      id: 'pos',
      titleBn: 'POS কাউন্টার সেলস',
      titleEn: 'POS Counter Sales',
      value: posSalesCount.toLocaleString(),
      trend: `৳${(summary?.salesSummary?.totalPosRevenue || 0).toLocaleString()} POS`,
      trendUp: true,
      icon: Package,
      color: 'from-amber-500 to-orange-600 text-white',
    },
    {
      id: 'customers',
      titleBn: 'নিবন্ধিত গ্রাহক',
      titleEn: 'Registered Customers',
      value: customersCount.toLocaleString(),
      trend: 'Live Database',
      trendUp: true,
      icon: Users,
      color: 'from-purple-600 to-pink-600 text-white',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary via-primary-dark to-sky-700 p-6 sm:p-8 text-white shadow-md flex items-center justify-between">
        <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{isBn ? 'দৈনিক ডিজিটাল হেলথ সামারি' : 'Daily Healthcare Analytics'}</span>
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isBn ? `স্বাগতম, ${siteName} এডমিন ড্যাশবোর্ডে!` : `Welcome to ${siteName} Admin Control!`}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            {isBn
              ? `আজকে সিস্টেমে ${summary?.salesSummary?.todayOrdersCount || 0}টি নতুন অর্ডার এবং ${pendingRxCount}টি পেন্ডিং প্রেসক্রিপশন জমা আছে।`
              : `System has ${summary?.salesSummary?.todayOrdersCount || 0} new orders today and ${pendingRxCount} pending prescriptions awaiting review.`}
          </p>
        </div>

      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">
                  {isBn ? card.titleBn : card.titleEn}
                </span>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} shadow-xs transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-black text-foreground tracking-tight">
                  {loading ? '...' : card.value}
                </span>
                <span className="flex items-center text-[11px] font-bold text-emerald-600">
                  <span>{card.trend}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Grid: Recent Orders & Quick System Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders Table (2 Cols Wide) */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-background p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                {isBn ? 'সাম্প্রতিক অর্ডারসমূহ' : 'Recent Order Stream'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isBn ? 'লাইভ ডাটাবেজ থেকে সর্বশেষ কাস্টমার অর্ডারসমূহ' : 'Latest customer orders placed'}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Live Feed
            </span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Order #</th>
                  <th className="pb-3 px-2">{isBn ? 'গ্রাহক' : 'Customer'}</th>
                  <th className="pb-3 px-2">{isBn ? 'মূল্য' : 'Amount'}</th>
                  <th className="pb-3 px-2">{isBn ? 'পেমেন্ট' : 'Payment'}</th>
                  <th className="pb-3 px-2 text-right">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>{isBn ? 'অর্ডার লোড হচ্ছে...' : 'Fetching orders...'}</span>
                      </div>
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground font-bold">
                      {isBn ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No recent orders found'}
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                      <td className="py-3 px-2 font-extrabold text-primary">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3 px-2 font-bold text-foreground">
                        {order.shippingAddress?.recipientName || 'Customer'}
                      </td>
                      <td className="py-3 px-2 font-black text-foreground">
                        {formatBDT(order.grandTotal)}
                      </td>
                      <td className="py-3 px-2 text-muted-foreground font-medium uppercase">
                        {order.paymentMethod} ({order.paymentStatus})
                      </td>
                      <td className="py-3 px-2 text-right">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                            order.orderStatus === 'processing'
                              ? 'bg-amber-100 text-amber-800'
                              : order.orderStatus === 'shipped'
                              ? 'bg-sky-100 text-sky-800'
                              : order.orderStatus === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick System Action & Prescription Queue */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">
            {isBn ? 'প্রেসক্রিপশন কিউ ও হেলথ স্ট্যাটাস' : 'Prescription & System Health'}
          </h3>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/50 p-3">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-amber-600" />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">
                    {isBn ? 'পেন্ডিং প্রেসক্রিপশন' : 'Pending Prescriptions'}
                  </span>
                  <span className="text-[11px] text-amber-700">
                    {pendingRxCount} {isBn ? 'টি রিভিউ বাকি' : 'awaiting review'}
                  </span>
                </div>
              </div>
              <span className="rounded-lg bg-amber-600 px-2.5 py-1 text-xs font-bold text-white">
                {pendingRxCount}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50/50 p-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <div>
                  <span className="text-xs font-bold text-rose-900 block">
                    {isBn ? 'কম স্টকের ওষুধ' : 'Low Stock Alert'}
                  </span>
                  <span className="text-[11px] text-rose-700">
                    {lowStockCount} {isBn ? 'টি আইটেম রিস্টক দরকার' : 'medicines low in stock'}
                  </span>
                </div>
              </div>
              <span className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-bold text-white">
                {lowStockCount}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    {isBn ? 'ডিজিডিএ গেটওয়ে লাইভ' : 'DGDA API Gateway'}
                  </span>
                  <span className="text-[11px] text-emerald-700">১০০% ভ্যালিডেটেড</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-600 h-2.5 w-2.5 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
