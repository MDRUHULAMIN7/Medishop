'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store';
import { ProductManager } from '@/components/dashboard/ProductManager';
import { CategoryManager } from '@/components/dashboard/CategoryManager';
import { BrandManager } from '@/components/dashboard/BrandManager';
import { CouponManager } from '@/components/dashboard/CouponManager';
import { InventoryProductsModule } from '@/components/dashboard/modules/InventoryProductsModule';
import { PosSalesModule } from '@/components/dashboard/modules/PosSalesModule';
import { OverviewTab } from '@/components/dashboard/OverviewTab';
import { OrderManager } from '@/components/dashboard/OrderManager';
import { PaymentManager } from '@/components/dashboard/PaymentManager';
import { ReviewManager } from '@/components/dashboard/ReviewManager';
import { SupportManager } from '@/components/dashboard/SupportManager';
import { UserManager } from '@/components/dashboard/UserManager';
import { SettingsManager } from '@/components/dashboard/SettingsManager';
import { BannerManager } from '@/components/dashboard/BannerManager';
import { PrescriptionQueue } from '@/components/dashboard/PrescriptionQueue';
import { StockLedgerManager } from '@/components/dashboard/StockLedgerManager';
import { ReportsManager } from '@/components/dashboard/ReportsManager';
import { StaffManager } from '@/components/dashboard/StaffManager';
import { AdminChatManager } from '@/components/dashboard/AdminChatManager';
import { Loader2 } from 'lucide-react';

function AdminContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (tab === 'chat' || tab === 'livechat') {
    return <AdminChatManager />;
  }

  if (tab === 'products') {
    return <ProductManager />;
  }

  if (tab === 'inventory') {
    return <InventoryProductsModule isBn={isBn} />;
  }

  if (tab === 'ledger') {
    return <StockLedgerManager />;
  }

  if (tab === 'pos_sales') {
    return <PosSalesModule isBn={isBn} />;
  }

  if (tab === 'categories') {
    return <CategoryManager />;
  }

  if (tab === 'brands') {
    return <BrandManager />;
  }

  if (tab === 'coupons') {
    return <CouponManager />;
  }

  if (tab === 'banners') {
    return <BannerManager />;
  }

  if (tab === 'orders') {
    return <OrderManager />;
  }

  if (tab === 'prescriptions') {
    return <PrescriptionQueue />;
  }

  if (tab === 'payments') {
    return <PaymentManager />;
  }

  if (tab === 'reviews') {
    return <ReviewManager />;
  }

  if (tab === 'reports') {
    return <ReportsManager />;
  }

  if (tab === 'staff') {
    return <StaffManager />;
  }

  if (tab === 'support') {
    return <SupportManager />;
  }

  if (tab === 'users') {
    return <UserManager />;
  }

  if (tab === 'settings') {
    return <SettingsManager />;
  }

  return <OverviewTab />;
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
