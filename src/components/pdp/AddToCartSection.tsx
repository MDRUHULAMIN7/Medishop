'use client';

import React from 'react';
import { ShoppingCart, Zap, Heart, Share2, Clock } from 'lucide-react';
import { Product } from '@/types/home';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart, openCartDrawer, openPreOrderModal } from '@/store/slices/cartSlice';
import { toast } from 'sonner';

interface AddToCartSectionProps {
  product: Product;
  quantity: number;
  selectedUnit?: string;
  price?: number;
  mrp?: number;
  stock?: number;
}

export function AddToCartSection({ product, quantity, selectedUnit, price, mrp, stock }: AddToCartSectionProps) {
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

  const handleBuyNow = () => {
    if (isOutOfStock || availableStock < quantity) {
      handlePreOrder();
      return;
    }
    handleAddToCart();
    dispatch(openCartDrawer());
  };

  return (
    <div className="flex flex-col gap-3 w-full mt-1">
      {/* Action Buttons Aligned with PDP Column Grid */}
      {isOutOfStock ? (
        <div className="w-full">
          <button
            type="button"
            onClick={handlePreOrder}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary-dark active:scale-[0.98] text-white px-5 text-sm font-extrabold shadow-md transition-all"
          >
            <Clock className="h-5 w-5 shrink-0" />
            <span>{isBn ? 'প্রি-অর্ডার করুন' : 'Pre-Order Now'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-primary/10 px-5 text-sm font-extrabold text-primary transition-all hover:bg-primary hover:text-white shadow-2xs active:scale-[0.98]"
          >
            <ShoppingCart className="h-4.5 w-4.5 shrink-0" />
            <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-extrabold text-white shadow-md transition-all hover:bg-primary-dark active:scale-[0.98]"
          >
            <Zap className="h-4.5 w-4.5 text-accent shrink-0" />
            <span>{isBn ? 'এখনই কিনুন' : 'Buy Now'}</span>
          </button>
        </div>
      )}

      {/* Secondary Actions (Wishlist & Share) */}
      <div className="flex items-center gap-5 pt-2">
        <button
          type="button"
          onClick={() => toast.info(isBn ? 'উইশলিস্টে সেভ হয়েছে' : 'Saved to wishlist')}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
        >
          <Heart className="h-4 w-4 text-rose-500/80" />
          <span>{isBn ? 'উইশলিস্টে রাখুন' : 'Add to Wishlist'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.share) {
              navigator.share({ title: product.nameEn, url: window.location.href });
            } else {
              toast.success(isBn ? 'লিংক কপি হয়েছে!' : 'Link copied to clipboard!');
            }
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <Share2 className="h-4 w-4 text-primary/80" />
          <span>{isBn ? 'শেয়ার করুন' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
}
