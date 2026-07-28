import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setOrders,
  setOrderFilters,
  setOrdersLoading,
  selectFilteredOrders,
  selectOrderFilters,
  selectIsOrdersLoading,
  selectAllOrders,
} from '@/store/slices/orderSlice';
import { orderService } from '@/services/order.service';
import { OrderFilterState } from '@/types/order';

export function useOrders() {
  const dispatch = useAppDispatch();
  const allOrders = useAppSelector(selectAllOrders);
  const filteredOrders = useAppSelector(selectFilteredOrders);
  const filters = useAppSelector(selectOrderFilters);
  const isLoading = useAppSelector(selectIsOrdersLoading);
  const language = useAppSelector((state) => state.ui.language);

  const fetchOrders = useCallback(async () => {
    dispatch(setOrdersLoading(true));
    try {
      const data = await orderService.getOrders();
      dispatch(setOrders(data));
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      dispatch(setOrdersLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (allOrders.length === 0) {
      fetchOrders();
    }
  }, [fetchOrders, allOrders.length]);

  const updateFilters = useCallback(
    (newFilters: Partial<OrderFilterState>) => {
      dispatch(setOrderFilters(newFilters));
    },
    [dispatch]
  );

  return {
    orders: filteredOrders,
    allOrders,
    filters,
    isLoading,
    updateFilters,
    refreshOrders: fetchOrders,
    isBn: language === 'bn',
  };
}
