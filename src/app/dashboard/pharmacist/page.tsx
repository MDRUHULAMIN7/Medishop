'use client';

import React from 'react';
import { useAppSelector } from '@/store';
import { PrescriptionAuditModule } from '@/components/dashboard/modules/PrescriptionAuditModule';

export default function PharmacistDashboardPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return <PrescriptionAuditModule isBn={isBn} />;
}
