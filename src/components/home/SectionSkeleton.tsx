import React from 'react';
import { ProductCardSkeleton } from './ProductCardSkeleton';

export function SectionSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-6 w-48 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="h-4 w-20 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
}
