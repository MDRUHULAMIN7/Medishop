import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { MOCK_PRODUCTS } from '@/mocks/products';
import { Product } from '@/types/home';
import { useAppSelector } from '@/store';

export const WISHLIST_STORAGE_KEY = 'medishop_wishlist_v1';

export function useWishlist() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishlistItems(parsed);
          return;
        }
      }
      // Initial fallback with 2 sample items
      const initial = MOCK_PRODUCTS.slice(0, 2);
      setWishlistItems(initial);
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(initial));
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    }
  }, []);

  const addToWishlist = useCallback(
    (product: Product) => {
      setWishlistItems((prev) => {
        if (prev.some((p) => p.id === product.id)) {
          toast.info(
            isBn
              ? `"${product.nameBn}" ইতিমধ্যে উইশলিস্টে আছে`
              : `"${product.nameEn}" is already in wishlist`
          );
          return prev;
        }
        const updated = [...prev, product];
        if (typeof window !== 'undefined') {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
        }
        toast.success(
          isBn
            ? `"${product.nameBn}" উইশলিস্টে যুক্ত করা হয়েছে!`
            : `"${product.nameEn}" added to wishlist!`
        );
        return updated;
      });
    },
    [isBn]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlistItems((prev) => {
        const itemToRemove = prev.find((p) => p.id === productId);
        const updated = prev.filter((p) => p.id !== productId);
        if (typeof window !== 'undefined') {
          localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updated));
        }
        if (itemToRemove) {
          toast.info(
            isBn
              ? `"${itemToRemove.nameBn}" উইশলিস্ট থেকে সরানো হয়েছে`
              : `"${itemToRemove.nameEn}" removed from wishlist`
          );
        }
        return updated;
      });
    },
    [isBn]
  );

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isBn,
  };
}
