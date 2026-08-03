'use client';

import React from 'react';
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
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';

export function OverviewTab() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const kpiCards = [
    {
      id: 'sales',
      titleBn: 'মোট বিক্রি (চলতি মাস)',
      titleEn: 'Total Sales (This Month)',
      value: formatBDT(485600),
      trend: '+18.4%',
      trendUp: true,
      icon: DollarSign,
      color: 'from-blue-600 to-indigo-600 text-white',
    },
    {
      id: 'orders',
      titleBn: 'মোট অর্ডার সংখ্যা',
      titleEn: 'Total Orders',
      value: '1,248',
      trend: '+12.1%',
      trendUp: true,
      icon: ShoppingBag,
      color: 'from-emerald-600 to-teal-600 text-white',
    },
    {
      id: 'medicines',
      titleBn: 'লাইভ প্রডাক্ট স্টক',
      titleEn: 'Active Medicines',
      value: '3,840',
      trend: '98% In Stock',
      trendUp: true,
      icon: Package,
      color: 'from-amber-500 to-orange-600 text-white',
    },
    {
      id: 'customers',
      titleBn: 'নিবন্ধিত গ্রাহক',
      titleEn: 'Registered Customers',
      value: '8,920',
      trend: '+240 this week',
      trendUp: true,
      icon: Users,
      color: 'from-purple-600 to-pink-600 text-white',
    },
  ];

  const recentOrders = [
    {
      id: 'MS-8901',
      customer: 'তানভীর আহমেদ',
      items: 'Napa Extra x3, Sergel 20mg x2',
      amount: 450,
      payment: 'bKash (Paid)',
      status: 'Processing',
      time: '10 mins ago',
    },
    {
      id: 'MS-8900',
      customer: 'রাফিয়া সুলতানা',
      items: 'OneTouch Select Plus Strips x1',
      amount: 1450,
      payment: 'Nagad (Paid)',
      status: 'Shipped',
      time: '35 mins ago',
    },
    {
      id: 'MS-8899',
      customer: 'মাহমুদুল হাসান',
      items: 'Seclo 20mg x5, Ace 500mg x2',
      amount: 320,
      payment: 'Cash on Delivery',
      status: 'Pending',
      time: '1 hour ago',
    },
    {
      id: 'MS-8898',
      customer: 'সাবরিনা ইয়াছমিন',
      items: 'Pampers Baby Wipes x2, Nan 1 x1',
      amount: 1890,
      payment: 'Visa Card (Paid)',
      status: 'Delivered',
      time: '2 hours ago',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary via-primary-dark to-sky-700 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col gap-2 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{isBn ? 'দৈনিক ডিজিটাল হেলথ সামারি' : 'Daily Healthcare Summary'}</span>
          </span>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isBn ? 'স্বাগতম, মেডিশপ এডমিন ড্যাশবোর্ডে!' : 'Welcome to mediShop Admin Control!'}
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            {isBn
              ? 'আজকে আপনার ফার্মেসিতে মোট ১২টি নতুন অর্ডার এবং ৩টি পেন্ডিং প্রেসক্রিপশন আপলোড এসেছে।'
              : 'You have 12 new orders and 3 pending prescription uploads requiring review today.'}
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
                  {card.value}
                </span>
                <span className="flex items-center text-xs font-bold text-success">
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
                {isBn ? 'সর্বশেষ সম্পন্ন হওয়া অর্ডার তালিকা' : 'Latest customer orders placed'}
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
                  <th className="pb-3 px-2">ID</th>
                  <th className="pb-3 px-2">{isBn ? 'গ্রাহক' : 'Customer'}</th>
                  <th className="pb-3 px-2">{isBn ? 'আইটেম' : 'Items'}</th>
                  <th className="pb-3 px-2">{isBn ? 'মূল্য' : 'Amount'}</th>
                  <th className="pb-3 px-2">{isBn ? 'পেমেন্ট' : 'Payment'}</th>
                  <th className="pb-3 px-2 text-right">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3 px-2 font-bold text-primary">{order.id}</td>
                    <td className="py-3 px-2 font-bold text-foreground">{order.customer}</td>
                    <td className="py-3 px-2 text-muted-foreground truncate max-w-[160px]">
                      {order.items}
                    </td>
                    <td className="py-3 px-2 font-black text-foreground">
                      {formatBDT(order.amount)}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground font-medium">
                      {order.payment}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          order.status === 'Processing'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'Shipped'
                            ? 'bg-sky-100 text-sky-800'
                            : order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
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
                  <span className="text-[11px] text-amber-700">৩টি রিভিউ বাকি</span>
                </div>
              </div>
              <span className="rounded-lg bg-amber-600 px-2.5 py-1 text-xs font-bold text-white">
                3
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">
                    {isBn ? 'ডিজিডিএ গেটওয়ে লাইভ' : 'DGDA API Connected'}
                  </span>
                  <span className="text-[11px] text-emerald-700">১০০% ভ্যালিডেটেড</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-600 h-2.5 w-2.5 animate-pulse" />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-sky-200 bg-sky-50/50 p-3">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-sky-600" />
                <div>
                  <span className="text-xs font-bold text-sky-900 block">
                    {isBn ? 'গড় ডেলিভারি সময়' : 'Avg Dhaka Delivery'}
                  </span>
                  <span className="text-[11px] text-sky-700">৪.২ ঘণ্টা</span>
                </div>
              </div>
              <span className="text-xs font-bold text-sky-900">4.2 hrs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
