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
import { CartService, BackendCartResponse } from '@/services/cart.service';
import {
  loadCartFromLocalStorage,
  saveCartToLocalStorage,
  clearCartFromLocalStorage,
} from '@/utils/cart';
import { cartEventBus } from '@/utils/cartEvents';
import { useCartAnalytics } from './useCartAnalytics';

const mapBackendCartToCartItems = (backendCart: BackendCartResponse): CartItem[] => {
  return (backendCart.items || []).map((item) => ({
    productId: item.product.id,
    slug: item.product.slug,
    nameEn: item.product.name,
    nameBn: item.product.name,
    brand: '',
    image: item.product.images?.[0] || '',
    unit: item.product.unitType || 'pcs',
    sellingPrice: item.product.effectivePrice,
    mrp: item.product.price,
    prescriptionRequired: item.product.requiresPrescription,
    stock: item.product.stock,
    quantity: item.quantity,
  }));
};

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const isDrawerOpen = useAppSelector(selectIsCartDrawerOpen);
  const isHydrated = useAppSelector(selectIsCartHydrated);
  const appliedCoupon = useAppSelector(selectAppliedCoupon);
  const summary = useAppSelector(selectCartSummary);
  const language = useAppSelector((state) => state.ui.language);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isBn = language === 'bn';

  const { trackAddToCart, trackRemoveFromCart, trackBeginCheckout } = useCartAnalytics();

  // Fetch Cart from Backend if Authenticated, else load from LocalStorage
  useEffect(() => {
    let isMounted = true;
    if (isAuthenticated) {
      CartService.getCart()
        .then((res) => {
          if (isMounted && res && res.items) {
            const mappedItems = mapBackendCartToCartItems(res);
            dispatch(hydrateCart({ items: mappedItems, appliedCoupon }));
          }
        })
        .catch(() => {
          // If network error, fallback to local storage
          if (isMounted && !isHydrated) {
            const stored = loadCartFromLocalStorage();
            dispatch(hydrateCart(stored.items ? stored : { items: [], appliedCoupon: null }));
          }
        });
    } else if (!isHydrated) {
      const stored = loadCartFromLocalStorage();
      dispatch(hydrateCart(stored.items ? stored : { items: [], appliedCoupon: null }));
    }
    return () => {
      isMounted = false;
    };
  }, [dispatch, isAuthenticated, isHydrated]);

  // Sync with LocalStorage whenever items or applied coupon change
  useEffect(() => {
    if (isHydrated) {
      saveCartToLocalStorage(items, appliedCoupon);
    }
  }, [items, appliedCoupon, isHydrated]);

  /**
   * Add Item to Cart with Backend Sync & Stock Boundary Check.
   */
  const handleAddToCart = useCallback(
    async (item: CartItem, showDrawer: boolean = true) => {
      const addQty = item.quantity || 1;
      const existing = items.find((i) => i.productId === item.productId);
      const targetQuantity = (existing?.quantity || 0) + addQty;
      const availableStock = item.stock !== undefined ? item.stock : 999;

      if (availableStock < targetQuantity) {
        toast.error(
          isBn
            ? `পর্যাপ্ত স্টক নেই (সর্বোচ্চ উপলব্ধ: ${availableStock})`
            : `Insufficient stock (max available: ${availableStock})`
        );
        return false;
      }

      if (isAuthenticated) {
        try {
          const res = await CartService.addItem(item.productId, addQty);
          const mappedItems = mapBackendCartToCartItems(res);
          dispatch(hydrateCart({ items: mappedItems, appliedCoupon }));
        } catch (err: any) {
          toast.error(err?.message || (isBn ? 'কার্টে যোগ করা যায়নি' : 'Failed to add item to cart'));
          return false;
        }
      } else {
        dispatch(addToCartAction(item));
      }

      trackAddToCart(item, addQty);

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
    [dispatch, items, appliedCoupon, summary, isAuthenticated, isBn, trackAddToCart]
  );

  /**
   * Update Quantity with Backend Sync.
   */
  const handleUpdateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const currentItem = items.find((i) => i.productId === productId);
      if (!currentItem) return;

      if (quantity <= 0) {
        handleRemoveFromCart(productId);
        return;
      }

      const availableStock = currentItem.stock !== undefined ? currentItem.stock : 999;
      if (availableStock < quantity) {
        toast.error(
          isBn
            ? `পর্যাপ্ত স্টক নেই (সর্বোচ্চ উপলব্ধ: ${availableStock})`
            : `Insufficient stock (max available: ${availableStock})`
        );
        return;
      }

      if (isAuthenticated) {
        try {
          const res = await CartService.updateQuantity(productId, quantity);
          const mappedItems = mapBackendCartToCartItems(res);
          dispatch(hydrateCart({ items: mappedItems, appliedCoupon }));
        } catch (err: any) {
          toast.error(err?.message || (isBn ? 'কার্ট আপডেট করা যায়নি' : 'Failed to update cart quantity'));
          return;
        }
      } else {
        dispatch(updateQuantityAction({ productId, quantity }));
      }

      cartEventBus.emit({
        type: 'QuantityChanged',
        items,
        item: currentItem,
        coupon: appliedCoupon,
        summary,
        timestamp: Date.now(),
      });
    },
    [dispatch, items, appliedCoupon, summary, isAuthenticated, isBn]
  );

  /**
   * Remove Item from Cart with Backend Sync.
   */
  const handleRemoveFromCart = useCallback(
    async (productId: string) => {
      const itemToRemove = items.find((i) => i.productId === productId);
      if (itemToRemove) {
        if (isAuthenticated) {
          try {
            const res = await CartService.removeItem(productId);
            const mappedItems = mapBackendCartToCartItems(res);
            dispatch(hydrateCart({ items: mappedItems, appliedCoupon }));
          } catch (err: any) {
            toast.error(err?.message || (isBn ? 'কার্ট থেকে সরানো যায়নি' : 'Failed to remove item from cart'));
            return;
          }
        } else {
          dispatch(removeFromCartAction(productId));
        }

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
    [dispatch, items, appliedCoupon, summary, isAuthenticated, isBn, trackRemoveFromCart]
  );

  /**
   * Clear All Items in Cart with Backend Sync.
   */
  const handleClearCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        await CartService.clearCart();
      } catch {
        // ignore error on clear
      }
    }
    dispatch(clearCartAction());
    clearCartFromLocalStorage();

    cartEventBus.emit({
      type: 'CartCleared',
      items: [],
      coupon: null,
      timestamp: Date.now(),
    });

    toast.info(isBn ? 'কার্ট খালি করা হয়েছে' : 'Cart emptied');
  }, [dispatch, isAuthenticated, isBn]);

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
