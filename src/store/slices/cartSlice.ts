import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { AppliedCoupon, CartItem, CartSummary } from '@/types/cart';
import { PricingEngine } from '@/utils/pricing';

export interface CartState {
  items: CartItem[];
  appliedCoupon: AppliedCoupon | null;
  isDrawerOpen: boolean;
  isHydrated: boolean;
}

const initialState: CartState = {
  items: [],
  appliedCoupon: null,
  isDrawerOpen: false,
  isHydrated: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (existingIndex > -1) {
        const currentQty = state.items[existingIndex].quantity;
        const addQty = action.payload.quantity || 1;
        const maxStock = action.payload.stock || state.items[existingIndex].stock || 999;
        state.items[existingIndex].quantity = Math.min(currentQty + addQty, maxStock);
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
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
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== action.payload.productId);
        } else {
          const maxStock = item.stock || 999;
          item.quantity = Math.min(action.payload.quantity, maxStock);
        }
      }
      if (state.items.length === 0) {
        state.appliedCoupon = null;
      }
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
