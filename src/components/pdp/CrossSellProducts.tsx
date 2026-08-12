'use client';

import React from 'react';
import { useRelatedProducts } from '@/hooks/useRelatedProducts';
import { ProductCard } from '@/components/home/ProductCard';
import { ProductGridSkeleton } from '@/components/products/ProductGridSkeleton';
import { useAppSelector } from '@/store';
import { Sparkles } from 'lucide-react';

interface CrossSellProductsProps {
  productId: string;
  categoryId: string;
}

export function CrossSellProducts({
  productId,
  categoryId,
}: CrossSellProductsProps) {
  const { data: related, isLoading } = useRelatedProducts(productId, categoryId);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (isLoading) return <ProductGridSkeleton />;
  if (!related || related.length === 0) return null;

  return (
    <section aria-label="Related Products" className="w-full py-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-accent" />
        <h3 className="font-serif-title text-lg sm:text-xl font-bold text-foreground">
          {isBn ? 'আপনার আরও প্রয়োজন হতে পারে' : 'You May Also Need'}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {related.map((prod: any) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </section>
  );
}
