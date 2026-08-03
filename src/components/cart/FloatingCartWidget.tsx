'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  openCartDrawer,
  selectGrandTotal,
  selectTotalQuantity,
} from '@/store/slices/cartSlice';
import { useFlyToCart } from '@/context/FlyToCartContext';
import { cn, formatBDT } from '@/lib/utils';

export function FloatingCartWidget() {
  const dispatch = useAppDispatch();
  const totalItems = useAppSelector(selectTotalQuantity);
  const grandTotal = useAppSelector(selectGrandTotal);
  const language = useAppSelector((state) => state.ui.language);
  const isQuickContactOpen = useAppSelector((state) => state.ui.isQuickContactOpen);
  const isBn = language === 'bn';
  const { isBouncing } = useFlyToCart();

  const handleOpenCart = () => {
    dispatch(openCartDrawer());
  };

  return (
    <motion.div
      id="floating-cart-btn"
      animate={{
        y: isQuickContactOpen ? 'calc(-50% + var(--cart-shift, -66px))' : '-50%',
      }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 24,
        delay: isQuickContactOpen ? 0.12 : 0,
      }}
      className="fixed right-2 sm:right-4 top-1/2 z-40 flex select-none flex-col items-center [--cart-shift:-66px] md:[--cart-shift:-20px]"
    >
      <button
        type="button"
        onClick={handleOpenCart}
        aria-label={isBn ? 'শপিং কার্ট খুলুন' : 'Open Shopping Cart'}
        className={cn(
          'group relative flex w-16 flex-col items-center rounded-xl border border-white/20 bg-primary px-1 py-1.5 text-white shadow-lg backdrop-blur-xs transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95',
          isBouncing && 'animate-cart-bounce ring-3 ring-primary/40'
        )}
      >
        <div className="relative my-0.5 flex h-9 w-9 items-center justify-center rounded-lg transition-colors ">
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-extrabold leading-none text-slate-950 shadow-xs">
              {totalItems}
            </span>
          )}

          <ShoppingBag className="h-8 w-8 text-white transition-transform group-hover:scale-110" />
        </div>

        <div className="mt-0.5 w-full truncate rounded-md border border-white/10 bg-black/25 px-1 py-0.5 text-center text-[12px] font-semibold tracking-tight text-amber-200 sm:text-[12px]">
          {formatBDT(grandTotal)}
        </div>

        {totalItems > 0 && (
          <span className="pointer-events-none absolute -inset-0.5 -z-10 animate-ping rounded-xl bg-primary/30 opacity-25" />
        )}
      </button>
    </motion.div>
  );
}
