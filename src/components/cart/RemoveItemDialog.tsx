'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Heart, X } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { toast } from 'sonner';

interface RemoveItemDialogProps {
  isOpen: boolean;
  item: CartItem | null;
  onClose: () => void;
  onConfirmRemove: (productId: string) => void;
  isBn?: boolean;
}

export function RemoveItemDialog({
  isOpen,
  item,
  onClose,
  onConfirmRemove,
  isBn = true,
}: RemoveItemDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!item) return null;

  const handleWishlist = () => {
    toast.success(
      isBn
        ? `"${item.nameBn}" উইশলিস্টে যুক্ত করা হয়েছে!`
        : `"${item.nameEn}" added to Wishlist!`
    );
    onConfirmRemove(item.productId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-item-title"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-background p-6 shadow-2xl border border-border"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3
                  id="remove-item-title"
                  className="text-lg font-bold text-foreground font-serif-title"
                >
                  {isBn ? 'কার্ট থেকে আইটেমটি সরাতে চান?' : 'Remove item from cart?'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn ? 'এই পণ্যটি আপনার কার্ট থেকে মুছে যাবে' : 'This product will be removed from your cart'}
                </p>
              </div>
            </div>

            {/* Product Card Snapshot */}
            <div className="my-5 flex items-center gap-3.5 rounded-xl bg-muted/40 p-3 border border-border">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-background border border-border">
                <Image
                  src={item.image}
                  alt={isBn ? item.nameBn : item.nameEn}
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {item.brand}
                </p>
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {isBn ? item.nameBn : item.nameEn}
                </h4>
                <p className="mt-0.5 text-xs font-bold text-primary">
                  ৳{item.sellingPrice} <span className="font-normal text-muted-foreground">× {item.quantity}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleWishlist}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Heart className="h-4 w-4 text-rose-500" />
                {isBn ? 'উইশলিস্টে রাখুন' : 'Move to Wishlist'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onConfirmRemove(item.productId);
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 active:bg-red-800 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                {isBn ? 'হ্যাঁ, সরিয়ে ফেলুন' : 'Remove Item'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
