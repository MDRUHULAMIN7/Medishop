'use client';

import React from 'react';
import { ShoppingCart, Clock } from 'lucide-react';
import { Product } from '@/types/home';
import { formatBDT } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart, openPreOrderModal } from '@/store/slices/cartSlice';
import { toast } from 'sonner';

interface StickyMobileBuyBarProps {
  product: Product;
  quantity: number;
  selectedUnit?: string;
  price?: number;
  mrp?: number;
  stock?: number;
}

export function StickyMobileBuyBar({
  product,
  quantity,
  selectedUnit,
  price,
  mrp,
  stock,
}: StickyMobileBuyBarProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const sellingPrice = price !== undefined ? price : product.price;
  const itemMrp = mrp !== undefined ? mrp : product.mrp;
  const unit = selectedUnit || product.unit;
  const availableStock = stock !== undefined ? stock : (product.stockCount !== undefined ? product.stockCount : 0);
  const isOutOfStock = availableStock <= 0;

  const handlePreOrder = () => {
    dispatch(
      openPreOrderModal({
        item: {
          productId: product.id,
          slug: product.slug,
          nameEn: product.nameEn,
          nameBn: product.nameBn,
          brand: typeof product.brand === 'object' ? (product.brand as any)?.name : product.brand,
          sellingPrice,
          mrp: itemMrp,
          image: product.image,
          unit,
          quantity,
          prescriptionRequired: Boolean(product.requiresRx),
          stock: 0,
        },
        requestedQuantity: quantity,
        availableStock: 0,
      })
    );
  };

  const handleAddToCart = () => {
    if (isOutOfStock || availableStock < quantity) {
      handlePreOrder();
      return;
    }

    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        nameEn: product.nameEn,
        nameBn: product.nameBn,
        brand: typeof product.brand === 'object' ? (product.brand as any)?.name : product.brand,
        sellingPrice,
        mrp: itemMrp,
        image: product.image,
        unit,
        quantity,
        prescriptionRequired: product.requiresRx,
        stock: availableStock,
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
        {itemMrp > sellingPrice && (
          <span className="text-[11px] text-muted-foreground line-through">
            {formatBDT(itemMrp * quantity)}
          </span>
        )}
        <p className="text-sm font-extrabold text-primary">
          {formatBDT(sellingPrice * quantity)}
        </p>
      </div>

      {isOutOfStock ? (
        <button
          onClick={handlePreOrder}
          className="flex items-center gap-1.5 rounded-2xl bg-primary hover:bg-primary-dark px-4 py-2.5 text-[11px] font-bold text-white shadow-md active:scale-95 cursor-pointer"
        >
          <Clock className="h-3.5 w-3.5" />
          <span>{isBn ? 'প্রি-অর্ডার করুন' : 'Pre-Order Now'}</span>
        </button>
      ) : (
        <button
          onClick={handleAddToCart}
          className="flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-[11px] font-bold text-white shadow-md active:scale-95 cursor-pointer"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
        </button>
      )}
    </div>
  );
}
