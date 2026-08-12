'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductManager } from '@/components/dashboard/ProductManager';
import { CategoryManager } from '@/components/dashboard/CategoryManager';
import { BrandManager } from '@/components/dashboard/BrandManager';
import { Loader2 } from 'lucide-react';

function AdminContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  if (tab === 'products') {
    return <ProductManager />;
  }

  if (tab === 'brands') {
    return <BrandManager />;
  }

  return <CategoryManager />;
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
