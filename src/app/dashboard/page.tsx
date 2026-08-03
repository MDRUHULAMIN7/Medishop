'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminSidebar, DashboardTab } from '@/components/dashboard/AdminSidebar';
import { AdminTopbar } from '@/components/dashboard/AdminTopbar';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { ProductManager } from '@/components/dashboard/ProductManager';
import { CategoryManager } from '@/components/dashboard/CategoryManager';
import { BrandManager } from '@/components/dashboard/BrandManager';
import { BannerManager } from '@/components/dashboard/BannerManager';
import { OrderManager } from '@/components/dashboard/OrderManager';
import { PaymentManager } from '@/components/dashboard/PaymentManager';
import { ReviewManager } from '@/components/dashboard/ReviewManager';
import { SupportManager } from '@/components/dashboard/SupportManager';
import { UserManager } from '@/components/dashboard/UserManager';
import { SettingsManager } from '@/components/dashboard/SettingsManager';

const VALID_TABS: DashboardTab[] = [
  'overview',
  'products',
  'categories',
  'brands',
  'banners',
  'orders',
  'payments',
  'reviews',
  'support',
  'users',
  'settings',
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = searchParams.get('tab') as DashboardTab;
  const currentTab: DashboardTab = VALID_TABS.includes(tabParam)
    ? tabParam
    : 'overview';

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleTabChange = (tab: DashboardTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.push(`/dashboard?${params.toString()}`, { scroll: false });
  };

  const renderActiveModule = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewTab />;
      case 'products':
        return <ProductManager />;
      case 'categories':
        return <CategoryManager />;
      case 'brands':
        return <BrandManager />;
      case 'banners':
        return <BannerManager />;
      case 'orders':
        return <OrderManager />;
      case 'payments':
        return <PaymentManager />;
      case 'reviews':
        return <ReviewManager />;
      case 'support':
        return <SupportManager />;
      case 'users':
        return <UserManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/20 text-foreground">
      {/* 1. Collapsible Sidebar */}
      <AdminSidebar
        activeTab={currentTab}
        setActiveTab={handleTabChange}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar Header */}
        <AdminTopbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onOpenQuickAdd={() => handleTabChange('products')}
        />

        {/* Dynamic Active Module Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/20 text-xs font-bold text-muted-foreground">
          Loading Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
