'use client';

import React from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
} from 'lucide-react';

interface AdminAnalyticsModuleProps {
  isBn?: boolean;
}

export function AdminAnalyticsModule({ isBn = true }: AdminAnalyticsModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 border border-rose-200">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground font-serif-title">
              {isBn ? 'সিস্টেম সেলস এনালাইটিক্স ও ড্যাশবোর্ড' : 'Executive Analytics & KPI Dashboard'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? 'অনলাইন মেটাসেলস, পিওএস কাউন্টার সেলস, ইউজার গ্রোথ ও রেভিনিউ ব্রেকডাউন'
                : 'Real-time sales metrics, counter POS breakdown and executive operational KPIs'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-border bg-background p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">{isBn ? 'মোট রেভিনিউ' : 'Total Revenue'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground font-serif-title">৳১,৪৮,৫০০</p>
          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> +১২.৫% গত মাসের তুলনায়
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">{isBn ? 'অনলাইন ও পিওএস অর্ডারস' : 'Total Orders'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground font-serif-title">৪২৮ টি</p>
          <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> +৮.২% বৃদ্ধি
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">{isBn ? 'রেজিস্টার্ড ইউজারস' : 'Total Registered Users'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-foreground font-serif-title">১,২৪০ জন</p>
          <p className="text-[11px] font-bold text-sky-600 flex items-center gap-1">
            <ArrowUpRight className="h-3.5 w-3.5" /> +১৫ নতুন ইউজার আজ
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-background p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold">{isBn ? 'স্টক এলার্ট মেডিসিন' : 'Low Stock Items'}</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 font-serif-title">৮ টি</p>
          <p className="text-[11px] font-bold text-rose-600">রিস্টক আদেশ প্রয়োজন</p>
        </div>
      </div>
    </div>
  );
}
