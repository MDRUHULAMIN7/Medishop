'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';
import { ProductFilterState, SortOption } from '@/types/product';
import { useCallback } from 'react';

export function useProductFilters(categorySlug?: string) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Extract filter params from URL
  const page = searchParams.get('page') ? Math.max(1, Number(searchParams.get('page'))) : 1;
  const limit = searchParams.get('limit') ? Math.max(1, Number(searchParams.get('limit'))) : 12;

  const selectedCategories = searchParams.get('categories')
    ? searchParams.get('categories')!.split(',')
    : categorySlug
    ? [categorySlug]
    : [];

  const selectedBrands = searchParams.get('brands')
    ? searchParams.get('brands')!.split(',')
    : [];

  const minPrice = searchParams.get('minPrice')
    ? Number(searchParams.get('minPrice'))
    : 0;

  const maxPrice = searchParams.get('maxPrice')
    ? Number(searchParams.get('maxPrice'))
    : 3000;

  const discounts = searchParams.get('discounts')
    ? searchParams.get('discounts')!.split(',').map(Number)
    : [];

  const inStockOnly = searchParams.get('inStock') === 'true';

  const prescriptionReq = (searchParams.get('rx') || 'all') as
    | 'all'
    | 'required'
    | 'otc';

  const sort = (searchParams.get('sort') || 'popularity') as SortOption;
  const searchQuery = searchParams.get('q') || '';

  const filterState: ProductFilterState = {
    categorySlug: searchParams.get('categories') ? undefined : categorySlug,
    categories: selectedCategories,
    brands: selectedBrands,
    minPrice,
    maxPrice,
    discounts,
    inStockOnly,
    prescriptionReq,
    searchQuery,
  };

  // Query Products with Page and Limit
  const queryResult = useQuery({
    queryKey: ['products-listing', categorySlug, searchParams.toString(), page, limit],
    queryFn: () =>
      ProductService.getProducts(
        {
          ...filterState,
          page,
          limit,
        },
        sort,
        searchQuery
      ),
    staleTime: 5 * 1000,
  });

  // URL Sync Helper
  const updateURL = useCallback(
    (newParams: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === '' || value === 'all') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setPage = (p: number) => updateURL({ page: p > 1 ? p.toString() : null });

  const setCategories = (cats: string[]) =>
    updateURL({ categories: cats.length > 0 ? cats.join(',') : null, page: null });

  const setBrands = (b: string[]) =>
    updateURL({ brands: b.length > 0 ? b.join(',') : null, page: null });

  const setPriceRange = (min: number, max: number) =>
    updateURL({
      minPrice: min > 0 ? min.toString() : null,
      maxPrice: max < 3000 ? max.toString() : null,
      page: null,
    });

  const setDiscounts = (disc: number[]) =>
    updateURL({ discounts: disc.length > 0 ? disc.join(',') : null, page: null });

  const setInStockOnly = (val: boolean) =>
    updateURL({ inStock: val ? 'true' : null, page: null });

  const setPrescriptionReq = (val: 'all' | 'required' | 'otc') =>
    updateURL({ rx: val === 'all' ? null : val, page: null });

  const setSort = (s: SortOption) => updateURL({ sort: s, page: null });

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return {
    page,
    limit,
    filterState,
    sort,
    searchQuery,
    queryResult,
    setPage,
    setCategories,
    setBrands,
    setPriceRange,
    setDiscounts,
    setInStockOnly,
    setPrescriptionReq,
    setSort,
    clearAllFilters,
  };
}
