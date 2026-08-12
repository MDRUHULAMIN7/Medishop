'use client';

import React, { memo, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  FileText,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  X,
} from 'lucide-react';
import { Product } from '@/services/product.service';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart, updateQuantity } from '@/store/slices/cartSlice';
import { formatBDT, cn } from '@/lib/utils';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { toast } from 'sonner';
import { getProductUnitOptions } from '@/lib/packagingUtils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const { flyToCart } = useFlyToCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const unitOptions = useMemo(() => {
    return getProductUnitOptions(product);
  }, [product]);

  const [isAddFlowOpen, setIsAddFlowOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<string>(unitOptions[0]?.value || 'pcs');
  const [pendingQuantity, setPendingQuantity] = useState(1);

  const activeOption = useMemo(() => {
    return unitOptions.find((u) => u.value === selectedUnit) || unitOptions[0] || {
      value: 'pcs', labelBn: 'পিস', labelEn: 'Piece', price: product.price, mrp: product.mrp, stock: product.stockCount
    };
  }, [unitOptions, selectedUnit, product]);

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItem = cartItems.find((i) => i.productId === product.id && i.unit === selectedUnit);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const currentUnit = (cartItem?.unit as string | undefined) || selectedUnit;

  const unitLabel = (unitStr: string) => {
    const option = unitOptions.find((item) => item.value === unitStr);
    return isBn ? option?.labelBn : option?.labelEn;
  };

  const triggerFlyToCart = (unitStr: string) => {
    if (!cardRef.current) return;

    flyToCart(cardRef.current, {
      image: product.image,
      name: isBn ? product.nameBn || product.name : product.nameEn || product.name,
      price: activeOption.price,
      unit: unitStr,
    });
  };

  const handleOpenAddFlow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddFlowOpen(true);
    setPendingQuantity(1);
  };

  const handleCloseAddFlow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddFlowOpen(false);
  };

  const handleSelectUnit = (unitStr: string) => {
    setSelectedUnit(unitStr);
  };

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    triggerFlyToCart(selectedUnit);

    dispatch(
      addToCart({
        productId: product.id,
        slug: product.slug,
        nameEn: product.nameEn || product.name,
        nameBn: product.nameBn || product.name,
        brand: typeof product.brand === 'object' ? product.brand?.name : product.brand,
        sellingPrice: activeOption.price,
        mrp: activeOption.mrp,
        image: product.image,
        unit: selectedUnit,
        quantity: pendingQuantity,
        prescriptionRequired: Boolean(product.requiresRx || product.requiresPrescription),
        stock: activeOption.stock,
      })
    );

    toast.success(isBn ? 'কার্টে যোগ হয়েছে' : `${product.nameEn || product.name} added to cart`);
    setIsAddFlowOpen(false);
    setPendingQuantity(1);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    triggerFlyToCart(currentUnit);

    dispatch(
      updateQuantity({
        productId: product.id,
        quantity: quantityInCart + 1,
      })
    );
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      updateQuantity({
        productId: product.id,
        quantity: quantityInCart - 1,
      })
    );
  };

  return (
    <div
      ref={cardRef}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background p-2.5 sm:p-3 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/40">
          <Image
            src={product.image && product.image.trim() !== '' ? product.image : 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop'}
            alt={isBn ? product.nameBn || (product as any).name || '' : product.nameEn || (product as any).name || ''}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          />

          {product.discountPercent > 0 && (
            <span className="absolute left-1.5 top-1.5 sm:left-2 sm:top-2 rounded-md bg-accent px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-slate-900 shadow-xs">
              {product.discountPercent}% {isBn ? 'ছাড়' : 'Off'}
            </span>
          )}

          {(product.requiresRx || product.requiresPrescription) && (
            <span
              title={isBn ? 'প্রেসক্রিপশন প্রয়োজন' : 'Prescription Required'}
              className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 flex items-center gap-1 rounded-md bg-rose-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-xs"
            >
              <FileText className="h-3 w-3" />
              <span>Rx</span>
            </span>
          )}

          <button
            type="button"
            aria-label={isBn ? 'পছন্দের তালিকায় যুক্ত করুন' : 'Add to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toast.info(isBn ? 'উইশলিস্টে সেভ হয়েছে' : 'Saved to wishlist');
            }}
            className="absolute bottom-2 right-2 cursor-pointer rounded-full bg-white/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur-xs transition-all hover:bg-white hover:text-rose-500 group-hover:opacity-100"
          >
            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>

        <div className="mt-2.5 flex flex-col gap-0.5 sm:gap-1">
          <span className="truncate text-[10px] sm:text-[11px] font-medium text-muted-foreground">
            {typeof product.brand === 'object' && product.brand !== null
              ? (product.brand as any).name || ''
              : product.brand || (product as any).brandName || ''}
          </span>

          <h3
            title={isBn ? product.nameBn || product.name : product.nameEn || product.name}
            className="min-h-[2.4rem] sm:min-h-[2.5rem] text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm line-clamp-2"
          >
            {isBn ? product.nameBn || product.name : product.nameEn || product.name}
          </h3>

          <div className="mt-1 flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base font-extrabold text-primary">
              {formatBDT(activeOption.price)}
            </span>
            {activeOption.mrp > activeOption.price && (
              <span className="text-[11px] sm:text-xs text-muted-foreground line-through">
                {formatBDT(activeOption.mrp)}
              </span>
            )}
            <span className="text-[10px] font-bold text-muted-foreground uppercase">
              /{isBn ? activeOption.labelBn : activeOption.labelEn}
            </span>
          </div>
        </div>
      </Link>

      <div className="relative mt-auto pt-2.5">
        <AnimatePresence mode="wait" initial={false}>
          {quantityInCart > 0 ? (
            /* Full-width Quantity Control when Item is in Cart */
            <motion.div
              key="quantity-bar"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="w-full"
            >
              <div className="flex h-10 w-full items-center justify-between overflow-hidden rounded-xl border border-primary bg-primary-soft/60 shadow-2xs">
                <button
                  type="button"
                  onClick={handleDecrease}
                  aria-label={isBn ? 'কমান' : 'Decrease'}
                  className="flex h-full w-9 sm:w-10 shrink-0 cursor-pointer items-center justify-center text-primary transition-colors active:bg-primary/20 hover:bg-primary/10"
                >
                  <Minus className="h-4 w-4 stroke-[2.5]" />
                </button>

                <div className="flex flex-1 min-w-0 flex-col items-center justify-center px-1">
                  <span className="text-xs sm:text-sm font-extrabold leading-none text-primary">
                    {quantityInCart}
                  </span>
                  <span className="mt-0.5 truncate text-[10px] font-semibold text-primary/80">
                    {unitLabel(currentUnit)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrease}
                  aria-label={isBn ? 'বাড়ান' : 'Increase'}
                  className="flex h-full w-9 sm:w-10 shrink-0 cursor-pointer items-center justify-center text-primary transition-colors active:bg-primary/20 hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4 stroke-[2.5]" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div key="add-flow" className="w-full">
              <AnimatePresence>
                {isAddFlowOpen ? (
                  /* Expanded Unit & Quantity Selection Flow */
                  <motion.div
                    key="expanded-flow"
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-background p-2 shadow-sm"
                  >
                    {/* Header bar with close button */}
                    <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
                      <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground">
                        {isBn ? 'ইউনিট নির্বাচন করুন' : 'Select Unit'}
                      </span>
                      <button
                        type="button"
                        onClick={handleCloseAddFlow}
                        className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Dynamic Unit Segment Switcher */}
                    <div
                      className={cn(
                        'grid gap-1 rounded-lg bg-muted/50 p-1',
                        unitOptions.length === 1
                          ? 'grid-cols-1'
                          : unitOptions.length === 2
                          ? 'grid-cols-2'
                          : unitOptions.length === 3
                          ? 'grid-cols-3'
                          : 'grid-cols-4'
                      )}
                    >
                      {unitOptions.map((option) => {
                        const isSelected = selectedUnit === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelectUnit(option.value);
                            }}
                            className={cn(
                              'py-1 text-center text-[10px] sm:text-[11px] font-bold rounded-md transition-all cursor-pointer',
                              isSelected
                                ? 'bg-primary text-white shadow-2xs font-extrabold'
                                : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
                            )}
                          >
                            {isBn ? option.labelBn : option.labelEn}
                          </button>
                        );
                      })}
                    </div>

                    {/* Quantity Stepper and Confirm Button */}
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-2">
                      {/* Quantity Stepper */}
                      <div className="flex h-8 sm:h-9 w-full sm:w-auto sm:flex-1 items-center justify-between rounded-lg border border-border bg-background px-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPendingQuantity((q) => Math.max(1, q - 1));
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded text-primary hover:bg-primary/10 active:scale-95 transition-colors"
                        >
                          <Minus className="h-3 w-3 stroke-[2.5]" />
                        </button>
                        <span className="text-xs font-bold text-foreground px-1">
                          {pendingQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPendingQuantity((q) => q + 1);
                          }}
                          className="flex h-6 w-6 items-center justify-center rounded text-primary hover:bg-primary/10 active:scale-95 transition-colors"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5]" />
                        </button>
                      </div>

                      {/* Confirm Add Button */}
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="flex h-8 sm:h-9 w-full sm:w-auto items-center justify-center gap-1 rounded-lg bg-primary px-2.5 text-[11px] sm:text-xs font-bold text-white shadow-2xs hover:bg-primary-dark active:scale-95 transition-all"
                      >
                        <ShoppingCart className="h-3 w-3 shrink-0" />
                        <span className="whitespace-nowrap">{isBn ? 'যোগ করুন' : 'Confirm'}</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Initial Default Add Button */
                  <motion.button
                    key="add-button"
                    onClick={handleOpenAddFlow}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary-soft/60 px-2 text-xs sm:text-sm font-bold text-primary shadow-2xs transition-all duration-200 hover:bg-primary hover:text-white active:scale-[0.98]"
                  >
                    <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                    <span className="truncate">{isBn ? 'কার্টে যোগ করুন' : 'Add to Bag'}</span>
                    <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
