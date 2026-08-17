'use client';

import React from 'react';
import { useAppSelector } from '@/store';
import { PosSalesModule } from '@/components/dashboard/modules/PosSalesModule';
import { Loader2 } from 'lucide-react';

export default function SalesDashboardPage() {
  const language = useAppSelector((state) => state.ui.language);
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const isBn = language === 'bn';
  const userRole = reduxUser?.role || 'customer';

  // Strict page-level guard
  if (!isInitialized || !isAuthenticated || !['sales_staff', 'admin', 'super_admin'].includes(userRole)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <PosSalesModule isBn={isBn} />;
}
