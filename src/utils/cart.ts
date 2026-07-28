import { AppliedCoupon, CartItem, ProductAvailabilityStatus } from '@/types/cart';

export const CART_STORAGE_KEY = 'medishop_cart_v1';

export interface StoredCartState {
  version: string;
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  updatedAt: number;
}

/**
 * Format price in Bangladeshi Taka (৳) with proper locale formatting.
 */
export function formatPrice(amount: number, locale: 'bn' | 'en' = 'bn'): string {
  const rounded = Math.round(amount);
  if (locale === 'bn') {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const formattedNum = rounded
      .toLocaleString('en-US')
      .replace(/\d/g, (digit) => bnDigits[parseInt(digit, 10)]);
    return `৳${formattedNum}`;
  }
  return `৳${rounded.toLocaleString('en-US')}`;
}

/**
 * Format any number into English or Bangla digits.
 */
export function formatNumber(num: number, locale: 'bn' | 'en' = 'bn'): string {
  if (locale === 'bn') {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (digit) => bnDigits[parseInt(digit, 10)]);
  }
  return num.toString();
}

/**
 * Helper to determine product availability status based on stock count.
 */
export function getAvailabilityStatus(stock: number): ProductAvailabilityStatus {
  if (stock <= 0) return ProductAvailabilityStatus.OUT_OF_STOCK;
  if (stock <= 5) return ProductAvailabilityStatus.LOW_STOCK;
  return ProductAvailabilityStatus.IN_STOCK;
}

/**
 * Save cart snapshot state to LocalStorage with versioning.
 */
export function saveCartToLocalStorage(
  items: CartItem[],
  appliedCoupon: AppliedCoupon | null = null
): void {
  if (typeof window === 'undefined') return;
  try {
    const dataToSave: StoredCartState = {
      version: 'v1',
      items,
      appliedCoupon,
      updatedAt: Date.now(),
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

/**
 * Load cart snapshot state from LocalStorage with version migration support.
 */
export function loadCartFromLocalStorage(): {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
} {
  if (typeof window === 'undefined') {
    return { items: [], appliedCoupon: null };
  }
  try {
    const storedRaw = localStorage.getItem(CART_STORAGE_KEY);
    if (!storedRaw) return { items: [], appliedCoupon: null };

    const parsed: StoredCartState = JSON.parse(storedRaw);

    // Schema version check and fallback migration if needed
    if (parsed.version === 'v1' && Array.isArray(parsed.items)) {
      return {
        items: parsed.items,
        appliedCoupon: parsed.appliedCoupon || null,
      };
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return { items: [], appliedCoupon: null };
}

/**
 * Clear persisted cart from LocalStorage.
 */
export function clearCartFromLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
}
