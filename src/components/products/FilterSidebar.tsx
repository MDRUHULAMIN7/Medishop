'use client';

import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { ProductFilterState, Brand } from '@/types/product';
import { BrandFilter } from './BrandFilter';
import { PriceRangeSlider } from './PriceRangeSlider';
import { DiscountFilter } from './DiscountFilter';
import { PrescriptionFilter } from './PrescriptionFilter';
import { useAppSelector } from '@/store';

interface FilterSidebarProps {
  filters: ProductFilterState;
  availableBrands: Brand[];
  onSetBrands: (brands: string[]) => void;
  onSetPriceRange: (min: number, max: number) => void;
  onSetDiscounts: (discounts: number[]) => void;
  onSetPrescriptionReq: (val: 'all' | 'required' | 'otc') => void;
  onSetInStockOnly: (val: boolean) => void;
  onClearAll: () => void;
}

export function FilterSidebar({
  filters,
  availableBrands,
  onSetBrands,
  onSetPriceRange,
  onSetDiscounts,
  onSetPrescriptionReq,
  onSetInStockOnly,
  onClearAll,
}: FilterSidebarProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <aside
      aria-label="Product Filters"
      className="w-[260px] shrink-0 rounded-2xl border border-border bg-background p-4 shadow-xs sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            {isBn ? 'ফিল্টারসমূহ' : 'Filters'}
          </h3>
        </div>
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-xs font-bold text-danger hover:underline"
        >
          <RotateCcw className="h-3 w-3" />
          <span>{isBn ? 'রিসেট' : 'Reset'}</span>
        </button>
      </div>

      {/* 1. In Stock Only Toggle */}
      <div className="flex items-center justify-between py-1">
        <span className="text-xs font-bold text-foreground">
          {isBn ? 'শুধু স্টকে থাকা পণ্য' : 'In Stock Only'}
        </span>
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onSetInStockOnly(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
      </div>

      <hr className="border-border/60" />

      {/* 2. Prescription Status */}
      <PrescriptionFilter
        value={filters.prescriptionReq}
        onChange={onSetPrescriptionReq}
      />

      <hr className="border-border/60" />

      {/* 3. Price Range Slider */}
      <PriceRangeSlider
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onApply={onSetPriceRange}
      />

      <hr className="border-border/60" />

      {/* 4. Brand Checklist */}
      <BrandFilter
        brands={availableBrands}
        selectedBrands={filters.brands}
        onChange={onSetBrands}
      />

      <hr className="border-border/60" />

      {/* 5. Discount Percentage */}
      <DiscountFilter
        selectedDiscounts={filters.discounts}
        onChange={onSetDiscounts}
      />
    </aside>
  );
}
