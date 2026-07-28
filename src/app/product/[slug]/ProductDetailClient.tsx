'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { Product } from '@/types/home';
import { formatBDT } from '@/lib/utils';
import { useAppSelector } from '@/store';
import { ProductGallery } from '@/components/pdp/ProductGallery';
import { PrescriptionNotice } from '@/components/pdp/PrescriptionNotice';
import { QuantitySelector } from '@/components/pdp/QuantitySelector';
import { AddToCartSection } from '@/components/pdp/AddToCartSection';
import { StickyMobileBuyBar } from '@/components/pdp/StickyMobileBuyBar';
import { ProductTabs } from '@/components/pdp/ProductTabs';
import { CrossSellProducts } from '@/components/pdp/CrossSellProducts';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">
          {isBn ? 'হোম' : 'Home'}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-primary transition-colors">
          {isBn ? 'ওষুধসমূহ' : 'Medicines'}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
          {isBn ? product.nameBn : product.nameEn}
        </span>
      </nav>

      {/* Main PDP 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: Product Image Gallery */}
        <ProductGallery images={[product.image]} title={product.nameEn} />

        {/* Right Column: Product Core Info */}
        <div className="flex flex-col gap-4">
          {/* Brand Link */}
          <Link
            href={`/products?brands=${encodeURIComponent(product.brand)}`}
            className="inline-flex text-xs font-bold uppercase tracking-wider text-primary hover:underline"
          >
            {product.brand}
          </Link>

          {/* Titles */}
          <div>
            <h1 className="font-serif-title text-xl sm:text-2xl font-extrabold text-foreground leading-snug">
              {product.nameEn}
            </h1>
            <h2 className="text-sm font-semibold text-muted-foreground mt-0.5">
              {product.nameBn}
            </h2>
          </div>

          {/* Ratings & Stock */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-muted-foreground font-normal">
                ({product.reviewCount} {isBn ? 'রিভিউ' : 'reviews'})
              </span>
            </div>

            <span className="text-muted-foreground">•</span>

            <div className="flex items-center gap-1 font-semibold text-emerald-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>{isBn ? 'স্টকে আছে' : 'In Stock'}</span>
            </div>
          </div>

          {/* Price Block */}
          <div className="flex items-baseline gap-3 rounded-2xl bg-muted/30 p-3.5 border border-border">
            <span className="font-serif-title text-2xl sm:text-3xl font-extrabold text-primary">
              {formatBDT(product.price * quantity)}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatBDT(product.mrp * quantity)}
                </span>
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-extrabold text-slate-900">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              ({product.unit})
            </span>
          </div>

          {/* Prescription Required Notice */}
          {product.requiresRx && <PrescriptionNotice />}

          {/* Quantity Selector */}
          <QuantitySelector
            quantity={quantity}
            onIncrease={() => setQuantity((q) => q + 1)}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
          />

          {/* Add to Cart / Buy Now */}
          <AddToCartSection product={product} quantity={quantity} />

          {/* Trust Guarantees Bar */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>{isBn ? '১০০% অরিজিনাল ওষুধ' : '100% Authentic Medicine'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <span>{isBn ? 'সেম-ডে এক্সপ্রেস ডেলিভারি' : 'Same-Day Delivery'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <ProductTabs product={product} />

      {/* Cross-Sell Recommendations */}
      <CrossSellProducts productId={product.id} categoryId={product.categoryId} />

      {/* Mobile Sticky Buy Bar */}
      <StickyMobileBuyBar product={product} quantity={quantity} />
    </div>
  );
}
