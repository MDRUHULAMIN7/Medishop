'use client';

import React, { useState, use, Suspense } from 'react';
import { useProductFilters } from '@/hooks/useProductFilters';
import { FilterSidebar } from '@/components/products/FilterSidebar';
import { FilterDrawer } from '@/components/products/FilterDrawer';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ActiveFilters } from '@/components/products/ActiveFilters';
import { SortDropdown } from '@/components/products/SortDropdown';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { Filter } from 'lucide-react';
import { useAppSelector } from '@/store';
import { useCategories } from '@/hooks/useCategories';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function CategoryContent({ slug }: { slug: string }) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const { categories } = useCategories();
  const categoryObj = (categories || []).find((c) => c.slug === slug);
  const categoryTitle = categoryObj
    ? isBn
      ? categoryObj.nameBn || categoryObj.name
      : categoryObj.nameEn || categoryObj.name
    : slug;

  const {
    filterState,
    sort,
    queryResult,
    setCategories,
    setBrands,
    setPriceRange,
    setDiscounts,
    setInStockOnly,
    setPrescriptionReq,
    setSort,
    clearAllFilters,
  } = useProductFilters(slug);

  const { data, isLoading } = queryResult;

  return (
    <div className="mx-auto max-w-[1700px] px-3 sm:px-6 lg:px-8 py-6">
      {/* Page Title & Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-extrabold text-foreground">
            {categoryTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isBn
              ? `মোট ${data?.totalCount || 0} টি পণ্য পাওয়া গেছে`
              : `Showing ${data?.totalCount || 0} items`}
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

          <ProductGrid products={data?.products || []} isLoading={isLoading} />
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

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);

  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <CategoryContent slug={slug} />
    </Suspense>
  );
}
