'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store';
import { CategoryManager } from '@/components/dashboard/CategoryManager';
import { BrandManager } from '@/components/dashboard/BrandManager';
import { Tags, Building2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');

  return (
    <div className="space-y-6">
      {/* Active Integrated Backend Modules Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            activeTab === 'categories'
              ? 'bg-primary text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Tags className="h-4 w-4" />
          <span>{isBn ? 'ফার্মেসি ক্যাটাগরি কনফিগারেটর' : 'Category Management'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('brands')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            activeTab === 'brands'
              ? 'bg-primary text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>{isBn ? 'ফার্মাসিউটিক্যালস ব্র্যান্ডস (DGDA)' : 'Pharma Brand Directory'}</span>
        </button>
      </div>

      {/* Render Integrated Backend Component */}
      {activeTab === 'categories' && <CategoryManager />}
      {activeTab === 'brands' && <BrandManager />}
    </div>
  );
}
