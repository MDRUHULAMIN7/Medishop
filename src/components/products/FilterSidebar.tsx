'use client';

import React from 'react';
import { Filter, RotateCcw, ShieldAlert, BadgePercent, SlidersHorizontal } from 'lucide-react';
import { ProductFilterState, Brand } from '@/types/product';
import { CategoryFilter } from './CategoryFilter';
import { BrandFilter } from './BrandFilter';
import { PriceRangeSlider } from './PriceRangeSlider';
import { DiscountFilter } from './DiscountFilter';
import { PrescriptionFilter } from './PrescriptionFilter';
import { useAppSelector } from '@/store';

interface FilterSidebarProps {
  filters: ProductFilterState;
  availableBrands: Brand[];
  onSetCategories?: (categories: string[]) => void;
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
  onSetCategories,
  onSetBrands,
  onSetPriceRange,
  onSetDiscounts,
  onSetPrescriptionReq,
  onSetInStockOnly,
  onClearAll,
}: FilterSidebarProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  // Count active filter conditions
  const activeCount =
    (filters.categories?.length || 0) +
    (filters.brands?.length || 0) +
    (filters.discounts?.length || 0) +
    (filters.minPrice > 0 || filters.maxPrice < 3000 ? 1 : 0) +
    (filters.prescriptionReq !== 'all' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <aside
      aria-label="Product Filters"
      className="w-[280px] shrink-0 rounded-3xl border border-border bg-background p-5 shadow-xs sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3.5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4.5 w-4.5 text-primary" />
          <h3 className="text-sm font-extrabold text-foreground tracking-tight">
            {isBn ? 'ফিল্টার ফিল্টারিং' : 'Filter Products'}
          </h3>
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>{isBn ? 'রিসেট' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter Section */}
      {onSetCategories && (
        <>
          <CategoryFilter
            selectedCategories={filters.categories}
            onChange={onSetCategories}
          />
          <hr className="border-border/60" />
        </>
      )}

      {/* 2. In Stock Only Toggle */}
      <div className="flex items-center justify-between py-0.5">
        <span className="text-xs font-extrabold text-foreground">
          {isBn ? 'শুধু স্টকে থাকা ওষুধ' : 'In Stock Only'}
        </span>
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => onSetInStockOnly(e.target.checked)}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
        />
      </div>

      <hr className="border-border/60" />

      {/* 3. Brand Checklist Section */}
      <BrandFilter
        brands={availableBrands}
        selectedBrands={filters.brands}
        onChange={onSetBrands}
      />

      <hr className="border-border/60" />

      {/* 4. Prescription Status */}
      <PrescriptionFilter
        value={filters.prescriptionReq}
        onChange={onSetPrescriptionReq}
      />

      <hr className="border-border/60" />

      {/* 5. Price Range Slider */}
      <PriceRangeSlider
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onApply={onSetPriceRange}
      />

      <hr className="border-border/60" />

      {/* 6. Discount Percentage */}
      <DiscountFilter
        selectedDiscounts={filters.discounts}
        onChange={onSetDiscounts}
      />
    </aside>
  );
}
