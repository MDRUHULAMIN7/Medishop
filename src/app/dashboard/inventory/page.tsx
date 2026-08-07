'use client';

import React from 'react';
import { useAppSelector } from '@/store';
import { InventoryProductsModule } from '@/components/dashboard/modules/InventoryProductsModule';

export default function InventoryDashboardPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return <InventoryProductsModule isBn={isBn} />;
}
