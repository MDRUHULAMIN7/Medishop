'use client';

import React from 'react';
import { ShoppingCart, Zap, Heart, Share2 } from 'lucide-react';
import { Product } from '@/types/home';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart, openCartDrawer } from '@/store/slices/cartSlice';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AddToCartSectionProps {
  product: Product;
  quantity: number;
  selectedUnit?: string;
  price?: number;
  mrp?: number;
}

export function AddToCartSection({ product, quantity, selectedUnit, price, mrp }: AddToCartSectionProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
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

  const handleBuyNow = () => {
    handleAddToCart();
    dispatch(openCartDrawer());
  };

  return (
    <div className="flex flex-col gap-3 w-full my-2">
      {/* Primary Actions (Add to Cart & Buy Now) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-primary/10 py-3 px-5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white shadow-xs active:scale-98"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 px-5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark active:scale-98"
        >
          <Zap className="h-4.5 w-4.5 text-accent" />
          <span>{isBn ? 'এখনই কিনুন' : 'Buy Now'}</span>
        </button>
      </div>

      {/* Secondary Actions (Wishlist & Share) */}
      <div className="flex items-center gap-4 pt-1">
        <button
          type="button"
          onClick={() => toast.info(isBn ? 'উইশলিস্ট সেভ হয়েছে' : 'Saved to wishlist')}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-rose-500 transition-colors"
        >
          <Heart className="h-4 w-4" />
          <span>{isBn ? 'উইশলিস্টে রাখুন' : 'Add to Wishlist'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: product.nameEn, url: window.location.href });
            } else {
              toast.success(isBn ? 'লিংক কপি হয়েছে!' : 'Link copied to clipboard!');
            }
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>{isBn ? 'শেয়ার করুন' : 'Share'}</span>
        </button>
      </div>
    </div>
  );
}
