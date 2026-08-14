'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import { ProductFilterState, Brand } from '@/types/product';
import { CategoryFilter } from './CategoryFilter';
import { BrandFilter } from './BrandFilter';
import { PriceRangeSlider } from './PriceRangeSlider';
import { DiscountFilter } from './DiscountFilter';
import { PrescriptionFilter } from './PrescriptionFilter';
import { useAppSelector } from '@/store';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
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

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  availableBrands,
  onSetCategories,
  onSetBrands,
  onSetPriceRange,
  onSetDiscounts,
  onSetPrescriptionReq,
  onSetInStockOnly,
  onClearAll,
}: FilterDrawerProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end md:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Bottom Sheet Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          role="dialog"
          aria-modal="true"
          aria-label={isBn ? 'ফিল্টার অপশন' : 'Filter Options'}
          className="relative z-10 flex max-h-[85vh] flex-col rounded-t-3xl border-t border-border bg-background p-5 shadow-2xl"
        >
          {/* Drawer Handle & Header */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-serif-title text-base font-bold text-foreground">
                {isBn ? 'ফিল্টার করুন' : 'Filter Products'}
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label={isBn ? 'বন্ধ করুন' : 'Close Filter Drawer'}
              className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Filters Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-5">
            {/* Category Filter */}
            {onSetCategories && (
              <>
                <CategoryFilter
                  selectedCategories={filters.categories}
                  onChange={onSetCategories}
                />
                <hr className="border-border/60" />
              </>
            )}

            {/* In Stock */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">
                {isBn ? 'শুধু স্টকে থাকা পণ্য' : 'In Stock Only'}
              </span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onSetInStockOnly(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary"
              />
            </div>

            <hr className="border-border/60" />

            <PrescriptionFilter
              value={filters.prescriptionReq}
              onChange={onSetPrescriptionReq}
            />

            <hr className="border-border/60" />

            <PriceRangeSlider
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onApply={onSetPriceRange}
            />

            <hr className="border-border/60" />

            <BrandFilter
              brands={availableBrands}
              selectedBrands={filters.brands}
              onChange={onSetBrands}
            />

            <hr className="border-border/60" />

            <DiscountFilter
              selectedDiscounts={filters.discounts}
              onChange={onSetDiscounts}
            />
          </div>

          {/* Sticky Actions Footer */}
          <div className="flex items-center gap-3 border-t border-border pt-3">
            <button
              onClick={onClearAll}
              className="flex-1 rounded-xl border border-border py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted"
            >
              {isBn ? 'সব রিসেট' : 'Clear All'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark"
            >
              {isBn ? 'ফলাফল দেখুন' : 'Apply Filters'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
