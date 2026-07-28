import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Order, OrderFilterState, OrderStatus } from '@/types/order';

interface OrderSliceState {
  orders: Order[];
  currentOrder: Order | null;
  lastPlacedOrder: Order | null;
  filters: OrderFilterState;
  isLoading: boolean;
}

const initialState: OrderSliceState = {
  orders: [],
  currentOrder: null,
  lastPlacedOrder: null,
  filters: {
    searchQuery: '',
    statusFilter: 'all',
    sortBy: 'newest',
  },
  isLoading: false,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload);
      state.lastPlacedOrder = action.payload;
    },
    setCurrentOrder: (state, action: PayloadAction<Order | null>) => {
      state.currentOrder = action.payload;
    },
    setLastPlacedOrder: (state, action: PayloadAction<Order | null>) => {
      state.lastPlacedOrder = action.payload;
    },
    setOrderFilters: (state, action: PayloadAction<Partial<OrderFilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setOrdersLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateOrderStatusInState: (
      state,
      action: PayloadAction<{ orderId: string; status: OrderStatus }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.orderStatus = action.payload.status;
      }
      if (state.currentOrder?.id === action.payload.orderId) {
        state.currentOrder.orderStatus = action.payload.status;
      }
    },
  },
});

export const {
  setOrders,
  addOrder,
  setCurrentOrder,
  setLastPlacedOrder,
  setOrderFilters,
  setOrdersLoading,
  updateOrderStatusInState,
} = orderSlice.actions;

export const selectAllOrders = (state: { order: OrderSliceState }) => state.order.orders;
export const selectCurrentOrder = (state: { order: OrderSliceState }) => state.order.currentOrder;
export const selectLastPlacedOrder = (state: { order: OrderSliceState }) =>
  state.order.lastPlacedOrder;
export const selectOrderFilters = (state: { order: OrderSliceState }) => state.order.filters;
export const selectIsOrdersLoading = (state: { order: OrderSliceState }) => state.order.isLoading;

/**
 * Filtered and Sorted Orders memoized selector.
 */
export const selectFilteredOrders = createSelector(
  [selectAllOrders, selectOrderFilters],
  (orders, filters) => {
    return orders
      .filter((o) => {
        // Status filter
        if (filters.statusFilter !== 'all' && o.orderStatus !== filters.statusFilter) {
          return false;
        }
        // Search query filter
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchNum = o.orderNumber.toLowerCase().includes(q);
          const matchItem = o.items.some(
            (i) =>
              i.nameEn.toLowerCase().includes(q) || i.nameBn.toLowerCase().includes(q)
          );
          return matchNum || matchItem;
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (filters.sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (filters.sortBy === 'amount_high') {
          return b.summary.grandTotal - a.summary.grandTotal;
        }
        if (filters.sortBy === 'amount_low') {
          return a.summary.grandTotal - b.summary.grandTotal;
        }
        return 0;
      });
  }
);

export default orderSlice.reducer;
