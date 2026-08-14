'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Package,
  Check,
} from 'lucide-react';
import { Product } from '@/types/home';
import { formatBDT, cn } from '@/lib/utils';
import { useAppSelector } from '@/store';
import { ProductGallery } from '@/components/pdp/ProductGallery';
import { PrescriptionNotice } from '@/components/pdp/PrescriptionNotice';
import { QuantitySelector } from '@/components/pdp/QuantitySelector';
import { AddToCartSection } from '@/components/pdp/AddToCartSection';
import { StickyMobileBuyBar } from '@/components/pdp/StickyMobileBuyBar';
import { ProductTabs } from '@/components/pdp/ProductTabs';
import { CrossSellProducts } from '@/components/pdp/CrossSellProducts';
import { getProductUnitOptions } from '@/lib/packagingUtils';

interface ProductDetailClientProps {
  product: Product;
}

/* Custom Packaging Dropdown with Rounded-2xl Popover Menu */
function PackagingDropdown({
  options,
  value,
  onChange,
  isBn,
}: {
  options: Array<{ value: string; labelBn: string; labelEn: string; price: number }>;
  value: string;
  onChange: (val: string) => void;
  isBn: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-primary/40 bg-background px-3.5 text-xs sm:text-sm font-bold text-foreground shadow-2xs hover:border-primary focus:outline-none transition-all cursor-pointer"
      >
        <span className="truncate">
          {isBn ? selectedOpt.labelBn : selectedOpt.labelEn} ({formatBDT(selectedOpt.price)})
        </span>
        <ChevronDown className={cn("h-4 w-4 text-primary shrink-0 transition-transform duration-200 ml-2", isOpen && "rotate-180")} />
      </button>

      {/* Floating Popup List (Rounded-2xl with smooth shadow & rounded options) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 overflow-hidden rounded-2xl border border-border bg-background p-1.5 shadow-xl ring-1 ring-black/5 max-h-60 overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer text-left',
                      isSelected
                        ? 'bg-primary/10 text-primary font-extrabold'
                        : 'text-foreground hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                      <span className="truncate">{isBn ? opt.labelBn : opt.labelEn}</span>
                    </div>
                    <span className="font-extrabold text-primary shrink-0 ml-2">{formatBDT(opt.price)}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const unitOptions = useMemo(() => {
    return getProductUnitOptions(product);
  }, [product]);

  const [selectedUnit, setSelectedUnit] = useState<string>(unitOptions[0]?.value || 'pcs');

  const activeOption = useMemo(() => {
    return unitOptions.find((u) => u.value === selectedUnit) || unitOptions[0] || {
      value: 'pcs',
      labelBn: 'পিস',
      labelEn: 'Piece',
      price: product.price,
      mrp: product.mrp,
      stock: product.stockCount,
      baseUnitQty: 1,
    };
  }, [unitOptions, selectedUnit, product]);

  const effectivePrice = activeOption.price;
  const effectiveMrp = activeOption.mrp;
  const discountPercent = effectiveMrp > effectivePrice ? Math.round(((effectiveMrp - effectivePrice) / effectiveMrp) * 100) : 0;

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
        <ProductGallery
          images={product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : [])}
          title={product.nameEn}
        />

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

          {/* Price Block (Fully Responsive Layout) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 rounded-2xl bg-muted/30 p-3.5 border border-border">
            <span className="font-serif-title text-xl sm:text-2xl font-extrabold text-primary shrink-0">
              {formatBDT(effectivePrice * quantity)}
            </span>
            {effectiveMrp > effectivePrice && (
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  {formatBDT(effectiveMrp * quantity)}
                </span>
                <span className="inline-flex items-center whitespace-nowrap rounded-lg bg-accent px-2 py-0.5 text-[10px] sm:text-xs font-extrabold text-slate-900">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground ml-auto whitespace-nowrap">
              /{isBn ? activeOption.labelBn : activeOption.labelEn}
            </span>
          </div>

          {/* Packaging Unit Dropdown & Quantity Control Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            {/* Left: Custom Packaging Unit Selector Dropdown */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <PackagingDropdown
                options={unitOptions}
                value={selectedUnit}
                onChange={setSelectedUnit}
                isBn={isBn}
              />
            </div>

            {/* Right: Quantity Selector */}
            <div className="flex flex-col gap-1.5 shrink-0">
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => q + 1)}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              />
            </div>
          </div>

          {/* Prescription Required Notice */}
          {product.requiresRx && <PrescriptionNotice />}

          {/* Add to Cart / Buy Now */}
          <AddToCartSection
            product={product}
            quantity={quantity}
            selectedUnit={selectedUnit}
            price={effectivePrice}
            mrp={effectiveMrp}
          />

          {/* Trust Guarantees Bar (Clean Border & Spacing) */}
          <div className="grid grid-cols-2 gap-3 pt-3 mt-1 border-t border-border/70">
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
      <StickyMobileBuyBar
        product={product}
        quantity={quantity}
        selectedUnit={selectedUnit}
        price={effectivePrice}
        mrp={effectiveMrp}
      />
    </div>
  );
}
