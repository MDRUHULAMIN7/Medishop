'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Product } from '@/types/home';
import { formatBDT } from '@/lib/utils';
import { useAppSelector } from '@/store';

interface SearchSuggestionItemProps {
  product: Product;
  onClick: () => void;
}

export function SearchSuggestionItem({
  product,
  onClick,
}: SearchSuggestionItemProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onClick}
      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/60 transition-colors border-b border-border/40 last:border-0"
    >
      {/* Thumbnail */}
      <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={isBn ? product.nameBn : product.nameEn}
          fill
          className="object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-muted-foreground truncate">
            {product.brand}
          </span>
          {product.requiresRx && (
            <span className="inline-flex items-center gap-0.5 rounded bg-rose-500 px-1 py-0.2 text-[9px] font-bold text-white">
              <FileText className="h-2.5 w-2.5" />
              <span>Rx</span>
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-foreground truncate">
          {isBn ? product.nameBn : product.nameEn}
        </p>
      </div>

      {/* Price */}
      <div className="text-right shrink-0">
        <span className="text-xs font-bold text-primary">
          {formatBDT(product.price)}
        </span>
        {product.mrp > product.price && (
          <p className="text-[10px] text-muted-foreground line-through">
            {formatBDT(product.mrp)}
          </p>
        )}
      </div>
    </Link>
  );
}
