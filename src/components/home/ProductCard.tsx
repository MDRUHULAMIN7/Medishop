'use client';

import React, { memo, useRef, useState } from 'react';
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
} from 'lucide-react';
import { Product } from '@/types/home';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart, updateQuantity } from '@/store/slices/cartSlice';
import { formatBDT, cn } from '@/lib/utils';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const UNIT_OPTIONS = [
  { value: 'Piece', labelBn: 'পিস', labelEn: 'Piece' },
  { value: 'Strip', labelBn: 'পাতা', labelEn: 'Strip' },
  { value: 'Box', labelBn: 'বক্স', labelEn: 'Box' },
] as const;

type UnitValue = (typeof UNIT_OPTIONS)[number]['value'];

export const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const { flyToCart } = useFlyToCart();
  const cardRef = useRef<HTMLDivElement>(null);

  const [isAddFlowOpen, setIsAddFlowOpen] = useState(false);
  const [isUnitMenuOpen, setIsUnitMenuOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitValue>('Piece');
  const [pendingQuantity, setPendingQuantity] = useState(1);

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartItem = cartItems.find((i) => i.productId === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const currentUnit = (cartItem?.unit as UnitValue | undefined) || selectedUnit;

  const unitLabel = (unit: UnitValue) => {
    const option = UNIT_OPTIONS.find((item) => item.value === unit);
    return isBn ? option?.labelBn : option?.labelEn;
  };

  const triggerFlyToCart = (unit: UnitValue) => {
    if (!cardRef.current) return;

    flyToCart(cardRef.current, {
      image: product.image,
      name: isBn ? product.nameBn : product.nameEn,
      price: product.price,
      unit,
    });
  };

  const handleOpenAddFlow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddFlowOpen(true);
    setIsUnitMenuOpen(false);
    setPendingQuantity(1);
  };

  const handleSelectUnit = (unit: UnitValue) => {
    setSelectedUnit(unit);
    setIsUnitMenuOpen(false);
  };

  const handleAddToCart = () => {
    triggerFlyToCart(selectedUnit);

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
        unit: selectedUnit,
        quantity: pendingQuantity,
        prescriptionRequired: product.requiresRx,
        stock: product.stockCount,
      })
    );

    toast.success(isBn ? 'কার্টে যোগ হয়েছে' : `${product.nameEn} added to cart`);

    setIsAddFlowOpen(false);
    setIsUnitMenuOpen(false);
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
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-background p-3 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted/40">
          <Image
            src={product.image}
            alt={isBn ? product.nameBn : product.nameEn}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
          />

          {product.discountPercent > 0 && (
            <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[11px] font-bold text-slate-900 shadow-xs">
              {product.discountPercent}% {isBn ? 'ছাড়' : 'Off'}
            </span>
          )}

          {product.requiresRx && (
            <span
              title={isBn ? 'প্রেসক্রিপশন প্রয়োজন' : 'Prescription Required'}
              className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-rose-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-xs backdrop-blur-xs"
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
              toast.info(isBn ? 'উইশলিস্টে সেভ হয়েছে' : 'Saved to wishlist');
            }}
            className="absolute bottom-2 right-2 rounded-full bg-white/80 p-1.5 text-muted-foreground opacity-0 backdrop-blur-xs transition-all hover:bg-white hover:text-rose-500 group-hover:opacity-100"
          >
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-1">
          <span className="truncate text-[11px] font-medium text-muted-foreground">
            {product.brand}
          </span>

          <h3
            title={isBn ? product.nameBn : product.nameEn}
            className="min-h-[2.5rem] text-xs font-semibold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-sm line-clamp-2"
          >
            {isBn ? product.nameBn : product.nameEn}
          </h3>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-primary sm:text-base">
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

      <div className="relative mt-auto pt-3">
        <AnimatePresence mode="wait" initial={false}>
          {quantityInCart > 0 ? (
            <motion.div
              key="quantity-bar"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="flex items-stretch overflow-hidden rounded-lg border border-primary/35 bg-transparent text-xs">
                <div className="flex items-center border-r border-primary/35 bg-primary/5 px-2 py-1 text-[11px] font-bold text-primary">
                  <span>{unitLabel(currentUnit)}</span>
                </div>

                <div className="flex flex-1 items-center justify-center gap-1.5 px-2">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    className="rounded px-1 font-bold text-primary hover:bg-primary/10"
                  >
                    <Minus className="h-3 w-3 stroke-[3]" />
                  </button>
                  <span className="min-w-[14px] text-center text-xs font-extrabold text-foreground">
                    {quantityInCart}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrease}
                    className="rounded px-1 font-bold text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-3 w-3 stroke-[3]" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="flex items-center gap-1 bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  <span>{isBn ? 'যোগ হয়েছে' : 'Added'}</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <div key="add-flow" className="relative">
              <AnimatePresence>
                {isAddFlowOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-2 flex flex-col gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setIsUnitMenuOpen((open) => !open)}
                      className="flex w-full items-center justify-between rounded-lg border border-primary/25 bg-background px-3 py-2 text-left text-sm font-semibold text-primary"
                    >
                      <span>{unitLabel(selectedUnit)}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    <AnimatePresence>
                      {isUnitMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="mt-2 grid grid-cols-3 gap-2"
                        >
                          {UNIT_OPTIONS.map((option) => {
                            const isSelected = selectedUnit === option.value;

                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleSelectUnit(option.value)}
                                className={cn(
                                  'flex flex-col items-center justify-center rounded-lg border px-2 py-2 text-center transition-all',
                                  isSelected
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border bg-muted/20 text-foreground hover:border-primary/40 hover:bg-primary/5'
                                )}
                              >
                                <span className="text-sm font-bold">
                                  {isBn
                                    ? option.value === 'Piece'
                                      ? 'পিস'
                                      : option.value === 'Strip'
                                        ? 'পাতা'
                                        : 'বক্স'
                                    : option.labelEn}
                                </span>
                                {isSelected && <Check className="mt-1 h-3.5 w-3.5" />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-stretch overflow-hidden rounded-lg border border-primary/35 bg-background text-xs shadow-xs">
                      <div className="flex items-center border-r border-primary/35 bg-primary/5 px-2 py-1 text-[11px] font-bold text-primary">
                        <span>{unitLabel(selectedUnit)}</span>
                      </div>

                      <div className="flex flex-1 items-center justify-center gap-1.5 px-2">
                        <button
                          type="button"
                          onClick={() => setPendingQuantity((qty) => Math.max(1, qty - 1))}
                          className="rounded px-1 font-bold text-primary hover:bg-primary/10"
                        >
                          <Minus className="h-3 w-3 stroke-[3]" />
                        </button>
                        <span className="min-w-[14px] text-center text-xs font-extrabold text-foreground">
                          {pendingQuantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setPendingQuantity((qty) => qty + 1)}
                          className="rounded px-1 font-bold text-primary hover:bg-primary/10"
                        >
                          <Plus className="h-3 w-3 stroke-[3]" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="flex items-center gap-1 bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        <span>{isBn ? 'যোগ করুন' : 'Add'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!isAddFlowOpen && (
                <motion.button
                  key="add-button"
                  onClick={handleOpenAddFlow}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-white px-4 py-3 text-sm font-semibold text-primary shadow-xs transition-all duration-200 hover:bg-primary hover:text-white active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to Bag'}</span>
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
