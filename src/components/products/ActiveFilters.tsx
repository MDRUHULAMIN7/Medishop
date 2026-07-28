'use client';

import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { ProductFilterState } from '@/types/product';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';

interface ActiveFiltersProps {
  filters: ProductFilterState;
  onRemoveCategory: (cat: string) => void;
  onRemoveBrand: (brand: string) => void;
  onRemoveDiscount: (disc: number) => void;
  onResetPrice: () => void;
  onResetPrescription: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
  onRemoveCategory,
  onRemoveBrand,
  onRemoveDiscount,
  onResetPrice,
  onResetPrescription,
  onClearAll,
}: ActiveFiltersProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.discounts.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 3000 ||
    filters.prescriptionReq !== 'all';

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-2xl bg-muted/40 border border-border">
      <span className="text-xs font-bold text-muted-foreground mr-1">
        {isBn ? 'সক্রিয় ফিল্টার:' : 'Active Filters:'}
      </span>

      {/* Categories */}
      {filters.categories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary"
        >
          <span>{cat}</span>
          <button onClick={() => onRemoveCategory(cat)} className="hover:text-primary-dark">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Brands */}
      {filters.brands.map((brand) => (
        <span
          key={brand}
          className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary"
        >
          <span>{brand}</span>
          <button onClick={() => onRemoveBrand(brand)} className="hover:text-primary-dark">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {/* Price Range */}
      {(filters.minPrice > 0 || filters.maxPrice < 3000) && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <span>
            {formatBDT(filters.minPrice)} - {formatBDT(filters.maxPrice)}
          </span>
          <button onClick={onResetPrice} className="hover:text-primary-dark">
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Prescription Requirement */}
      {filters.prescriptionReq !== 'all' && (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <span>
            {filters.prescriptionReq === 'required'
              ? isBn
                ? 'প্রেসক্রিপশন আবশ্যক'
                : 'Rx Required'
              : isBn
              ? 'ওটিসি (সাধারণ)'
              : 'OTC'}
          </span>
          <button onClick={onResetPrescription} className="hover:text-primary-dark">
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-danger hover:underline"
      >
        <RotateCcw className="h-3 w-3" />
        <span>{isBn ? 'সব রিসেট' : 'Clear All'}</span>
      </button>
    </div>
  );
}
