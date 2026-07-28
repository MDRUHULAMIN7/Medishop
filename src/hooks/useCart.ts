import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  clearCart as clearCartAction,
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  hydrateCart,
  selectCartItems,
  selectIsCartDrawerOpen,
  selectIsCartHydrated,
  selectAppliedCoupon,
  selectCartSummary,
} from '@/store/slices/cartSlice';
import { CartItem } from '@/types/cart';
import { cartService } from '@/services/cart.service';
import {
  loadCartFromLocalStorage,
  saveCartToLocalStorage,
  clearCartFromLocalStorage,
} from '@/utils/cart';
import { cartEventBus } from '@/utils/cartEvents';
import { useCartAnalytics } from './useCartAnalytics';

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const isDrawerOpen = useAppSelector(selectIsCartDrawerOpen);
  const isHydrated = useAppSelector(selectIsCartHydrated);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const summary = useAppSelector(selectCartSummary);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const { trackAddToCart, trackRemoveFromCart, trackBeginCheckout } = useCartAnalytics();

  // Automatic LocalStorage Hydration on initial render
  useEffect(() => {
    if (!isHydrated) {
      const stored = loadCartFromLocalStorage();
      if (stored.items && stored.items.length > 0) {
        dispatch(hydrateCart(stored));
      } else {
        dispatch(hydrateCart({ items, appliedCoupon: null }));
      }
    }
  }, [dispatch, isHydrated, items]);

  // Sync with LocalStorage whenever items or applied coupon change
  useEffect(() => {
    if (isHydrated) {
      saveCartToLocalStorage(items, appliedCoupon);
    }
  }, [items, appliedCoupon, isHydrated]);

  /**
   * Add Item to Cart with Stock Validation & Drawer Auto-open.
   */
  const handleAddToCart = useCallback(
    async (item: CartItem, showDrawer: boolean = true) => {
      const existing = items.find((i) => i.productId === item.productId);
      const targetQuantity = (existing?.quantity || 0) + (item.quantity || 1);

      // Inventory Stock Check
      const stockCheck = await cartService.validateStock(item.productId, targetQuantity);
      if (!stockCheck.isValid) {
        toast.error(
          isBn
            ? stockCheck.messageBn || 'পর্যাপ্ত স্টক নেই'
            : stockCheck.messageEn || 'Insufficient stock'
        );
        return false;
      }

      dispatch(addToCartAction(item));
      trackAddToCart(item, item.quantity || 1);

      cartEventBus.emit({
        type: 'ItemAdded',
        items: [...items, item],
        item,
        coupon: appliedCoupon,
        summary,
        timestamp: Date.now(),
      });

      toast.success(
        isBn
          ? `"${item.nameBn}" কার্টে যোগ করা হয়েছে`
          : `"${item.nameEn}" added to cart`
      );

      if (showDrawer) {
        dispatch(openCartDrawer());
      }
      return true;
    },
    [dispatch, items, appliedCoupon, summary, isBn, trackAddToCart]
  );

  /**
   * Update Quantity with Stock Boundary Check.
   */
  const handleUpdateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const currentItem = items.find((i) => i.productId === productId);
      if (!currentItem) return;

      if (quantity > 0) {
        const stockCheck = await cartService.validateStock(productId, quantity);
        if (!stockCheck.isValid) {
          toast.error(
            isBn
              ? stockCheck.messageBn || 'পর্যাপ্ত স্টক নেই'
              : stockCheck.messageEn || 'Insufficient stock'
          );
          return;
        }
      }

      dispatch(updateQuantityAction({ productId, quantity }));

      cartEventBus.emit({
        type: 'QuantityChanged',
        items,
        item: currentItem,
        coupon: appliedCoupon,
        summary,
        timestamp: Date.now(),
      });
    },
    [dispatch, items, appliedCoupon, summary, isBn]
  );

  /**
   * Remove Item from Cart.
   */
  const handleRemoveFromCart = useCallback(
    (productId: string) => {
      const itemToRemove = items.find((i) => i.productId === productId);
      if (itemToRemove) {
        dispatch(removeFromCartAction(productId));
        trackRemoveFromCart(itemToRemove);

        cartEventBus.emit({
          type: 'ItemRemoved',
          items: items.filter((i) => i.productId !== productId),
          item: itemToRemove,
          coupon: appliedCoupon,
          summary,
          timestamp: Date.now(),
        });

        toast.info(
          isBn
            ? `"${itemToRemove.nameBn}" কার্ট থেকে সরানো হয়েছে`
            : `"${itemToRemove.nameEn}" removed from cart`
        );
      }
    },
    [dispatch, items, appliedCoupon, summary, isBn, trackRemoveFromCart]
  );

  /**
   * Clear All Items in Cart.
   */
  const handleClearCart = useCallback(() => {
    dispatch(clearCartAction());
    clearCartFromLocalStorage();

    cartEventBus.emit({
      type: 'CartCleared',
      items: [],
      coupon: null,
      timestamp: Date.now(),
    });

    toast.info(isBn ? 'কার্ট খালি করা হয়েছে' : 'Cart emptied');
  }, [dispatch, isBn]);

  /**
   * Drawer Controls
   */
  const openDrawer = useCallback(() => dispatch(openCartDrawer()), [dispatch]);
  const closeDrawer = useCallback(() => dispatch(closeCartDrawer()), [dispatch]);
  const toggleDrawer = useCallback(() => dispatch(toggleCartDrawer()), [dispatch]);

  return {
    items,
    isDrawerOpen,
    isHydrated,
    appliedCoupon,
    summary,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    trackBeginCheckout,
  };
}
