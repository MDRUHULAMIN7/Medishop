'use client';

import React, { useState, Suspense } from 'react';
import { useProductFilters } from '@/hooks/useProductFilters';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { FilterDrawer } from '@/components/products/FilterDrawer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ActiveFilters } from '@/components/products/ActiveFilters';
import { SortDropdown } from '@/components/products/SortDropdown';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { Filter, Search } from 'lucide-react';
import { useAppSelector } from '@/store';

function SearchContent() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const {
    filterState,
    sort,
    searchQuery,
    queryResult,
    setCategories,
    setBrands,
    setPriceRange,
    setDiscounts,
    setInStockOnly,
    setPrescriptionReq,
    setSort,
    clearAllFilters,
  } = useProductFilters();

  const { data, isLoading } = queryResult;

  return (
    <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-6">
      {/* Search Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Search className="h-6 w-6 text-primary" />
            <h1 className="font-serif-title text-xl sm:text-2xl font-extrabold text-foreground">
              {searchQuery
                ? isBn
                  ? `"${searchQuery}" এর অনুসন্ধানের ফলাফল`
                  : `Search Results for "${searchQuery}"`
                : isBn
                ? 'পণ্য অনুসন্ধান'
                : 'Search Products'}
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {isBn
              ? `মোট ${data?.totalCount || 0} টি পণ্য পাওয়া গেছে`
              : `Found ${data?.totalCount || 0} matching items`}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground shadow-2xs md:hidden"
          >
            <Filter className="h-4 w-4 text-primary" />
            <span>{isBn ? 'ফিল্টার' : 'Filters'}</span>
          </button>

          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      {/* Main Listing Layout */}
      <div className="flex items-start gap-6">
        <div className="hidden md:block">
          <FilterSidebar
            filters={filterState}
            availableBrands={data?.availableBrands || []}
            onSetBrands={setBrands}
            onSetPriceRange={setPriceRange}
            onSetDiscounts={setDiscounts}
            onSetPrescriptionReq={setPrescriptionReq}
            onSetInStockOnly={setInStockOnly}
            onClearAll={clearAllFilters}
          />
        </div>

        <div className="flex-1 min-w-0">
          <ActiveFilters
            filters={filterState}
            onRemoveCategory={(cat) => setCategories(filterState.categories.filter((c) => c !== cat))}
            onRemoveBrand={(b) => setBrands(filterState.brands.filter((brand) => brand !== b))}
            onRemoveDiscount={(d) => setDiscounts(filterState.discounts.filter((disc) => disc !== d))}
            onResetPrice={() => setPriceRange(0, 3000)}
            onResetPrescription={() => setPrescriptionReq('all')}
            onClearAll={clearAllFilters}
          />

          <ProductGrid
            products={data?.products || []}
            isLoading={isLoading}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filters={filterState}
        availableBrands={data?.availableBrands || []}
        onSetBrands={setBrands}
        onSetPriceRange={setPriceRange}
        onSetDiscounts={setDiscounts}
        onSetPrescriptionReq={setPrescriptionReq}
        onSetInStockOnly={setInStockOnly}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
