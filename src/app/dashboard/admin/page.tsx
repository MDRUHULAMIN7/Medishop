'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store';
import { AdminAnalyticsModule } from '@/components/dashboard/modules/AdminAnalyticsModule';
import { AdminUserManagerModule } from '@/components/dashboard/modules/AdminUserManagerModule';
import { InventoryProductsModule } from '@/components/dashboard/modules/InventoryProductsModule';
import { CategoryManager } from '@/components/dashboard/CategoryManager';
import { BrandManager } from '@/components/dashboard/BrandManager';
import { PaymentManager } from '@/components/dashboard/PaymentManager';
import { TrendingUp, UserCheck, Boxes, Tags, Ticket } from 'lucide-react';

export default function AdminDashboardPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [adminTab, setAdminTab] = useState<'analytics' | 'users' | 'products' | 'categories' | 'coupons'>('analytics');

  useEffect(() => {
    if (tabParam === 'users') {
      setAdminTab('users');
    } else if (tabParam === 'products') {
      setAdminTab('products');
    } else if (tabParam === 'categories') {
      setAdminTab('categories');
    } else if (tabParam === 'coupons') {
      setAdminTab('coupons');
    } else if (tabParam === 'analytics') {
      setAdminTab('analytics');
    }
  }, [tabParam]);

  return (
    <div className="space-y-6">
      {/* Admin Tab Switcher Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border custom-scrollbar">
        <button
          type="button"
          onClick={() => setAdminTab('analytics')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            adminTab === 'analytics'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{isBn ? 'সেলস এনালাইটিক্স' : 'Analytics KPIs'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('users')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            adminTab === 'users'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>{isBn ? 'ইউজার ব্লক সেটিং' : 'User Control & Block'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('products')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            adminTab === 'products'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>{isBn ? 'মেডিসিন ক্যাটালগ' : 'Medicine Catalog'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('categories')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            adminTab === 'categories'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Tags className="h-4 w-4" />
          <span>{isBn ? 'ক্যাটাগরি ও ব্র্যান্ডস' : 'Categories & Brands'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('coupons')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            adminTab === 'coupons'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Ticket className="h-4 w-4" />
          <span>{isBn ? 'প্রোমো কুপনস' : 'Coupons & Vouchers'}</span>
        </button>
      </div>

      {/* Render Selected Module */}
      {adminTab === 'analytics' && <AdminAnalyticsModule isBn={isBn} />}
      {adminTab === 'users' && <AdminUserManagerModule isBn={isBn} />}
      {adminTab === 'products' && <InventoryProductsModule isBn={isBn} />}
      {adminTab === 'categories' && (
        <div className="space-y-6">
          <CategoryManager />
          <BrandManager />
        </div>
      )}
      {adminTab === 'coupons' && <PaymentManager />}
    </div>
  );
}
