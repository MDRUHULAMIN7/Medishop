'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store';
import { InventoryProductsModule } from '@/components/dashboard/modules/InventoryProductsModule';
import { CategoryManager } from '@/components/dashboard/CategoryManager';
import { BrandManager } from '@/components/dashboard/BrandManager';
import { Boxes, FolderTree, Building2, Loader2 } from 'lucide-react';

function InventoryDashboardContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const userRole = reduxUser?.role || 'customer';

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'brands'>('products');

  // Strict page-level guard
  if (!isInitialized || !isAuthenticated || !['inventory_manager', 'admin', 'super_admin'].includes(userRole)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  useEffect(() => {
    if (tabParam === 'categories') {
      setActiveTab('categories');
    } else if (tabParam === 'brands') {
      setActiveTab('brands');
    } else if (tabParam === 'products') {
      setActiveTab('products');
    }
  }, [tabParam]);

  return (
    <div className="space-y-6">
      {/* Inventory Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-border custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            activeTab === 'products'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Boxes className="h-4 w-4" />
          <span>{isBn ? 'মেডিসিন স্টক ও ক্যাটালগ' : 'Medicine Catalog & Stock'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            activeTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <FolderTree className="h-4 w-4" />
          <span>{isBn ? 'ফার্মেসি ক্যাটাগরি কনফিগারেটর' : 'Category Configurator'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('brands')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            activeTab === 'brands'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>{isBn ? 'ডিজিডিএ ম্যানুফ্যাকচারার ব্র্যান্ডস' : 'Pharma Brand Directory'}</span>
        </button>
      </div>

      {/* Render Selected Module */}
      {activeTab === 'products' && <InventoryProductsModule isBn={isBn} />}
      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'brands' && <BrandManager />}
    </div>
  );
}

export default function InventoryDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <InventoryDashboardContent />
    </Suspense>
  );
}
