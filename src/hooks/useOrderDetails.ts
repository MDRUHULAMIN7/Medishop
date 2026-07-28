import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setCurrentOrder,
  selectCurrentOrder,
  selectLastPlacedOrder,
} from '@/store/slices/orderSlice';
import { Order } from '@/types/order';
import { orderService } from '@/services/order.service';

export function useOrderDetails(orderId?: string) {
  const dispatch = useAppDispatch();
  const currentOrder = useAppSelector(selectCurrentOrder);
  const lastPlacedOrder = useAppSelector(selectLastPlacedOrder);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [isLoading, setIsLoading] = useState(true);

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const order = await orderService.getOrderById(orderId);
      dispatch(setCurrentOrder(order));
    } catch (e) {
      console.error('Failed to fetch order detail:', e);
    } finally {
      setIsLoading(false);
    }
  }, [orderId, dispatch]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleCancelOrder = useCallback(async () => {
    const targetId = orderId || currentOrder?.id;
    if (!targetId) return;

    try {
      const updated = await orderService.cancelOrder(targetId);
      if (updated) {
        dispatch(setCurrentOrder(updated));
        toast.success(
          isBn ? 'অর্ডারটি বাতিল করা হয়েছে' : 'Order cancelled successfully'
        );
      }
    } catch (e) {
      toast.error(isBn ? 'অর্ডার বাতিল করতে সমস্যা হয়েছে' : 'Failed to cancel order');
    }
  }, [orderId, currentOrder, dispatch, isBn]);

  const activeOrder = currentOrder || (orderId ? null : lastPlacedOrder);

  return {
    order: activeOrder,
    isLoading,
    cancelOrder: handleCancelOrder,
    refreshOrder: fetchOrderDetails,
    isBn,
  };
}
