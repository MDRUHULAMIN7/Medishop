'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, FileText, Heart } from 'lucide-react';
import { Product } from '@/types/home';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        nameEn: product.nameEn,
        nameBn: product.nameBn,
        brand: product.brand,
        sellingPrice: product.price,
        mrp: product.mrp,
        image: product.image,
        unit: product.unit,
        quantity: 1,
        prescriptionRequired: product.requiresRx,
        stock: product.stockCount,
      })
    );

    toast.success(
      isBn
        ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে!`
        : `"${product.nameEn}" added to cart!`
    );
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background p-3 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md">
      {/* Product Image & Badges Container */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative w-full aspect-square rounded-xl bg-muted/40 overflow-hidden">
          <Image
            src={product.image}
            alt={isBn ? product.nameBn : product.nameEn}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          />

          {/* Discount Badge */}
          {product.discountPercent > 0 && (
            <span className="absolute top-2 left-2 rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-slate-900 shadow-xs">
              {product.discountPercent}% {isBn ? 'ছাড়' : 'Off'}
            </span>
          )}

          {/* Prescription Required Badge */}
          {product.requiresRx && (
            <span
              title={isBn ? 'প্রেসক্রিপশন প্রয়োজন' : 'Prescription Required'}
              className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-rose-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-xs"
            >
              <FileText className="h-3 w-3" />
              <span>Rx</span>
            </span>
          )}

          {/* Wishlist Button Placeholder */}
          <button
            type="button"
            aria-label={isBn ? 'পছন্দের তালিকায় যুক্ত করুন' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              toast.info(isBn ? 'উইশলিস্ট সেভ হয়েছে' : 'Saved to wishlist');
            }}
            className="absolute bottom-2 right-2 rounded-full bg-white/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur-xs transition-all hover:bg-white hover:text-rose-500 group-hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        {/* Product Meta Info */}
        <div className="mt-3 flex flex-col gap-1">
          {/* Brand */}
          <span className="text-[11px] font-medium text-muted-foreground truncate">
            {product.brand}
          </span>

          {/* Name */}
          <h3
            title={isBn ? product.nameBn : product.nameEn}
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors"
          >
            {isBn ? product.nameBn : product.nameEn}
          </h3>

          {/* Price & MRP Row */}
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-primary">
              {formatBDT(product.price)}
            </span>
            {product.mrp > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatBDT(product.mrp)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart CTA */}
      <button
        onClick={handleAddToCart}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2 px-3 text-xs font-bold text-white shadow-xs transition-colors hover:bg-primary-dark active:scale-98 focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
      </button>
    </div>
  );
});
