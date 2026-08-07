'use client';

import React from 'react';
import { useAppSelector } from '@/store';
import { PosSalesModule } from '@/components/dashboard/modules/PosSalesModule';

export default function SalesDashboardPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return <PosSalesModule isBn={isBn} />;
}
