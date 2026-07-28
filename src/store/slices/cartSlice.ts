import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

const initialState: CartState = {
  items: [
    // Initial mock item for demo / development verification
    {
      productId: 'p-1',
      nameEn: 'Napa Extra 500mg/65mg Tablet',
      nameBn: 'নাপা এক্সট্রা ৫০০ মি.গ্রা./৬৫ মি.গ্রা. ট্যাবলেট',
      price: 25,
      mrp: 30,
      image: 'https://placehold.co/200x200/1D4ED8/FFFFFF?text=Napa+Extra',
      quantity: 2,
    },
  ],
  isDrawerOpen: false,
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
        state.items[existingIndex].quantity += action.payload.quantity || 1;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.productId !== action.payload.productId
          );
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
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
  clearCart,
  toggleCartDrawer,
  openCartDrawer,
  closeCartDrawer,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectIsCartDrawerOpen = (state: { cart: CartState }) =>
  state.cart.isDrawerOpen;

export const selectTotalQuantity = createSelector([selectCartItems], (items) =>
  items.reduce((acc, item) => acc + item.quantity, 0)
);

export const selectSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);

export const FREE_DELIVERY_THRESHOLD = 1000;

export const selectRemainingForFreeDelivery = createSelector(
  [selectSubtotal],
  (subtotal) => Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
);

export default cartSlice.reducer;
