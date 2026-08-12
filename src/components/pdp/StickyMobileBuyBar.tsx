'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/home';
import { formatBDT } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import { toast } from 'sonner';

interface StickyMobileBuyBarProps {
  product: Product;
  quantity: number;
  selectedUnit?: string;
  price?: number;
  mrp?: number;
}

export function StickyMobileBuyBar({
  product,
  quantity,
  selectedUnit,
  price,
  mrp,
}: StickyMobileBuyBarProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const sellingPrice = price !== undefined ? price : product.price;
  const itemMrp = mrp !== undefined ? mrp : product.mrp;
  const unit = selectedUnit || product.unit;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        nameEn: product.nameEn,
        nameBn: product.nameBn,
        brand: product.brand,
        sellingPrice,
        mrp: itemMrp,
        image: product.image,
        unit,
        quantity,
        prescriptionRequired: product.requiresRx,
        stock: product.stockCount,
      })
    );

    toast.success(
      isBn
        ? `"${product.nameBn}" (${unit}) কার্টে যোগ করা হয়েছে!`
        : `"${product.nameEn}" (${unit}) added to cart!`
    );
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-30 flex items-center justify-between border-t border-border bg-background/98 p-3 backdrop-blur-md shadow-2xl md:hidden">
      <div>
        <span className="text-[11px] text-muted-foreground line-through">
          {formatBDT(product.mrp)}
        </span>
        <p className="text-base font-extrabold text-primary">
          {formatBDT(product.price * quantity)}
        </p>
      </div>

      <button
        onClick={handleAddToCart}
        className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md active:scale-95"
      >
        <ShoppingCart className="h-4 w-4" />
        <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
      </button>
    </div>
  );
}
