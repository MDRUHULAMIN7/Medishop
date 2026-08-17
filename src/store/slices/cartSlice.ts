import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { AppliedCoupon, CartItem, CartSummary } from '@/types/cart';
import { PricingEngine } from '@/utils/pricing';

export interface PreOrderModalState {
  isOpen: boolean;
  item: CartItem | null;
  requestedQuantity: number;
  availableStock: number;
}

export interface CartState {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  isDrawerOpen: boolean;
  isHydrated: boolean;
  preOrderModal: PreOrderModalState;
}

const initialState: CartState = {
  items: [],
  appliedCoupon: null,
  isDrawerOpen: false,
  isHydrated: false,
  preOrderModal: {
    isOpen: false,
    item: null,
    requestedQuantity: 0,
    availableStock: 0,
  },
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem & { allowPreOrder?: boolean }>) => {
      state.isHydrated = true;
      const existingIndex = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          (!action.payload.unit || item.unit === action.payload.unit)
      );

      const maxStock =
        action.payload.stock !== undefined
          ? action.payload.stock
          : existingIndex > -1 && state.items[existingIndex].stock !== undefined
          ? state.items[existingIndex].stock
          : 0;

      // Reject adding regular cart items if there is no stock and pre-order is not specified
      if (maxStock <= 0 && !action.payload.allowPreOrder) {
        return;
      }

      if (existingIndex > -1) {
        const currentQty = state.items[existingIndex].quantity;
        const addQty = action.payload.quantity || 1;
        if (action.payload.stock !== undefined) {
          state.items[existingIndex].stock = action.payload.stock;
        }

        if (action.payload.allowPreOrder) {
          const newQty = currentQty + addQty;
          state.items[existingIndex].quantity = newQty;
          state.items[existingIndex].preOrderQuantity = Math.max(0, newQty - maxStock);
        } else {
          const newQty = Math.min(currentQty + addQty, maxStock);
          if (newQty > 0) {
            state.items[existingIndex].quantity = newQty;
          }
        }
      } else {
        const requested = action.payload.quantity || 1;
        if (action.payload.allowPreOrder) {
          state.items.push({
            ...action.payload,
            stock: maxStock,
            quantity: requested,
            preOrderQuantity: Math.max(0, requested - maxStock),
          });
        } else {
          const finalQty = Math.min(requested, maxStock);
          if (finalQty > 0) {
            state.items.push({
              ...action.payload,
              stock: maxStock,
              quantity: finalQty,
              preOrderQuantity: 0,
            });
          }
        }
      }
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      // Re-evaluate coupon applicability if cart becomes empty
      if (state.items.length === 0) {
        state.appliedCoupon = null;
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number; allowPreOrder?: boolean }>
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        } else {
          const maxStock = item.stock !== undefined ? item.stock : 0;
          if (action.payload.allowPreOrder) {
            item.quantity = action.payload.quantity;
            item.preOrderQuantity = Math.max(0, action.payload.quantity - maxStock);
          } else {
            if (maxStock <= 0) {
              state.items = state.items.filter((i) => i.productId !== action.payload.productId);
            } else {
              item.quantity = Math.min(action.payload.quantity, maxStock);
            }
          }
        }
      }
      if (state.items.length === 0) {
        state.appliedCoupon = null;
      }
    },

    openPreOrderModal: (
      state,
      action: PayloadAction<{
        item: CartItem;
        requestedQuantity: number;
        availableStock: number;
      }>
    ) => {
      state.preOrderModal = {
        isOpen: true,
        item: action.payload.item,
        requestedQuantity: action.payload.requestedQuantity,
        availableStock: action.payload.availableStock,
      };
    },

    closePreOrderModal: (state) => {
      state.preOrderModal = {
        isOpen: false,
        item: null,
        requestedQuantity: 0,
        availableStock: 0,
      };
    },

    applyCoupon: (state, action: PayloadAction<AppliedCoupon>) => {
      state.appliedCoupon = action.payload;
    },

    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },

    clearCart: (state) => {
      state.items = [];
      state.appliedCoupon = null;
    },

    hydrateCart: (
      state,
      action: PayloadAction<{ items: CartItem[]; appliedCoupon: AppliedCoupon | null }>
    ) => {
      state.items = action.payload.items;
      state.appliedCoupon = action.payload.appliedCoupon;
      state.isHydrated = true;
    },

    toggleCartDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },

    openCartDrawer: (state) => {
      state.isDrawerOpen = true;
    },

    closeCartDrawer: (state) => {
      state.isDrawerOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  openPreOrderModal,
  closePreOrderModal,
  applyCoupon,
  removeCoupon,
  clearCart,
  hydrateCart,
  toggleCartDrawer,
  openCartDrawer,
  closeCartDrawer,
} = cartSlice.actions;

// Selectors
export const selectCartState = (state: { cart: CartState }) => state.cart;
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectAppliedCoupon = (state: { cart: CartState }) => state.cart.appliedCoupon;
export const selectIsCartDrawerOpen = (state: { cart: CartState }) => state.cart.isDrawerOpen;
export const selectIsCartHydrated = (state: { cart: CartState }) => state.cart.isHydrated;
export const selectPreOrderModal = (state: { cart: CartState }) => state.cart.preOrderModal;

/**
 * Centralized memoized selector for full financial breakdown via PricingEngine.
 */
export const selectCartSummary = createSelector(
  [selectCartItems, selectAppliedCoupon],
  (items, coupon): CartSummary => {
    return PricingEngine.calculateCartSummary(items, coupon);
  }
);

export const selectTotalQuantity = createSelector(
  [selectCartSummary],
  (summary) => summary.totalQuantity
);

export const selectSubtotal = createSelector(
  [selectCartSummary],
  (summary) => summary.subtotal
);

export const selectMrpDiscount = createSelector(
  [selectCartSummary],
  (summary) => summary.mrpDiscount
);

export const selectCouponDiscount = createSelector(
  [selectCartSummary],
  (summary) => summary.couponDiscount
);

export const selectDeliveryCharge = createSelector(
  [selectCartSummary],
  (summary) => summary.deliveryCharge
);

export const selectGrandTotal = createSelector(
  [selectCartSummary],
  (summary) => summary.grandTotal
);

export const selectTotalSavings = createSelector(
  [selectCartSummary],
  (summary) => summary.totalSavings
);

export const selectFreeDeliveryProgress = createSelector(
  [selectCartSummary],
  (summary) => ({
    isFree: summary.isFreeDelivery,
    remaining: summary.remainingForFreeDelivery,
    threshold: summary.freeDeliveryThreshold,
    percentage: Math.min(100, Math.round((summary.subtotal / summary.freeDeliveryThreshold) * 100)),
  })
);

export default cartSlice.reducer;
