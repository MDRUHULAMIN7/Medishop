'use client';

import React from 'react';
import { Product } from '@/types/home';
import { ProductCard } from '@/components/home/ProductCard';
import { NoResults } from '@/components/search/NoResults';
import { ProductGridSkeleton } from './ProductGridSkeleton';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  searchQuery?: string;
}

export function ProductGrid({
  products,
  isLoading,
  searchQuery,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (!products || products.length === 0) {
    return <NoResults query={searchQuery} />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
