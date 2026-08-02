'use client';

import React from 'react';
import { UseQueryResult } from '@tanstack/react-query';
import { Product } from '@/types/home';
import { SectionHeader } from './SectionHeader';
import { ProductCard } from './ProductCard';
import { SectionSkeleton } from './SectionSkeleton';
import { useAppSelector } from '@/store';
import { PackageX } from 'lucide-react';

interface ProductSectionProps {
  titleBn: string;
  titleEn: string;
  subtitleBn?: string;
  subtitleEn?: string;
  viewAllLink: string;
  queryResult: UseQueryResult<Product[], Error>;
  icon?: React.ReactNode;
}

export function ProductSection({
  titleBn,
  titleEn,
  subtitleBn,
  subtitleEn,
  viewAllLink,
  queryResult,
  icon,
}: ProductSectionProps) {
  const { data: products, isLoading, isError } = queryResult;
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  if (isLoading) {
    return <SectionSkeleton />;
  }

  if (isError) {
    return (
      <div className="my-4 rounded-2xl border border-danger/20 bg-danger-light/20 p-4 text-center text-xs font-medium text-danger">
        {isBn ? 'ডেটা লোড করতে সমস্যা হয়েছে।' : 'Failed to load section products.'}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="my-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center">
        <PackageX className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-xs font-semibold text-muted-foreground">
          {isBn ? 'এই মুহূর্তে কোনো পণ্য পাওয়া যায়নি' : 'No products available currently'}
        </p>
      </div>
    );
  }

  return (
    <section className="w-full py-4">
      {/* Header */}
      <SectionHeader
        titleBn={titleBn}
        titleEn={titleEn}
        subtitleBn={subtitleBn}
        subtitleEn={subtitleEn}
        viewAllLink={viewAllLink}
        icon={icon}
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
