import { CartItem } from '@/types/cart';
import { MOCK_PRODUCTS } from '@/mocks/products';

export interface StockValidationResult {
  isValid: boolean;
  availableStock: number;
  messageEn?: string;
  messageBn?: string;
}

export class CartService {
  /**
   * Validate requested quantity against product stock inventory.
   */
  public async validateStock(
    productId: string,
    requestedQuantity: number
  ): Promise<StockValidationResult> {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    const availableStock = product?.stockCount ?? 99;

    if (requestedQuantity > availableStock) {
      return {
        isValid: false,
        availableStock,
        messageEn: `Only ${availableStock} units available in stock`,
        messageBn: `স্টকে কেবল ${availableStock} টি প্রোডাক্ট অবশিষ্ট আছে`,
      };
    }

    return {
      isValid: true,
      availableStock,
    };
  }

  /**
   * Reserve stock stub for checkout integration (Phase 6 ready).
   */
  public async reserveStock(items: CartItem[]): Promise<boolean> {
    // Stub returns true for Phase 5
    return true;
  }

  /**
   * Synchronize cart with backend API stub (Future backend ready).
   */
  public async syncInventory(items: CartItem[]): Promise<CartItem[]> {
    // Return current items snapshot
    return items;
  }
}

export const cartService = new CartService();
