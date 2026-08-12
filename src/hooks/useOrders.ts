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

export function normalizeOrder(o: any) {
  if (!o) return null;
  const grandTotal = o.grandTotal ?? o.summary?.grandTotal ?? 0;
  const subtotal = o.subtotal ?? o.summary?.subtotal ?? 0;
  const deliveryCharge = o.deliveryCharge ?? o.summary?.deliveryCharge ?? 60;
  const couponDiscount = o.couponDiscount ?? o.summary?.couponDiscount ?? 0;
  const mrpDiscount = o.discountTotal ?? o.summary?.mrpDiscount ?? 0;

  const orderStatus = (o.orderStatus || o.status || 'pending').toLowerCase();
  const paymentStatus = (o.paymentStatus || 'pending').toLowerCase();

  const getPaymentName = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'bkash':
        return { nameEn: 'bKash Mobile Banking', nameBn: 'বিকাশ মোবাইল ব্যাংকিং' };
      case 'nagad':
        return { nameEn: 'Nagad Mobile Banking', nameBn: 'নগদ মোবাইল ব্যাংকিং' };
      case 'card':
        return { nameEn: 'Debit / Credit Card', nameBn: 'ডেবিট / ক্রেডিট কার্ড' };
      default:
        return { nameEn: 'Cash on Delivery', nameBn: 'ক্যাশ অন ডেলিভারি' };
    }
  };

  const paymentMeta = getPaymentName(typeof o.paymentMethod === 'string' ? o.paymentMethod : o.paymentMethod?.id);

  return {
    ...o,
    id: o.id || o._id,
    orderNumber: o.orderNumber || `MS-${o.id?.slice(-6)}`,
    invoiceNumber: o.invoiceNumber || `INV-${o.orderNumber || o.id?.slice(-6)}`,
    trackingNumber: o.trackingNumber || `TRK-${o.orderNumber || o.id?.slice(-6)}`,
    items: (o.items || []).map((i: any) => ({
      ...i,
      productId: i.productId || i.product || i.id,
      nameEn: i.nameEn || i.name || 'Medicine',
      nameBn: i.nameBn || i.name || 'ওষুধ',
      quantity: i.quantity || 1,
      unitPrice: i.unitPrice || i.effectiveUnitPrice || 0,
      image: i.image || '',
    })),
    shippingAddress: {
      fullName: o.shippingAddress?.recipientName || o.shippingAddress?.fullName || 'Valued Customer',
      phone: o.shippingAddress?.phone || 'N/A',
      streetAddress: o.shippingAddress?.addressLine || o.shippingAddress?.streetAddress || 'N/A',
      area: o.shippingAddress?.thana || o.shippingAddress?.area || 'N/A',
      district: o.shippingAddress?.district || 'Dhaka',
      division: o.shippingAddress?.division || 'Dhaka',
    },
    paymentMethod: {
      id: typeof o.paymentMethod === 'string' ? o.paymentMethod : o.paymentMethod?.id || 'cod',
      ...paymentMeta,
    },
    paymentStatus,
    orderStatus,
    deliveryMethod: o.deliveryMethod || {
      id: 'standard',
      nameEn: 'Standard Home Delivery',
      nameBn: 'স্ট্যান্ডার্ড হোম ডেলিভারি',
    },
    summary: {
      subtotal,
      mrpDiscount,
      couponDiscount,
      deliveryCharge,
      grandTotal,
    },
    estimatedDeliveryDate: o.estimatedDeliveryDate || '2-3 Working Days',
    createdAt: o.createdAt || new Date().toISOString(),
    timeline: o.timeline || [
      {
        status: 'pending',
        titleEn: 'Order Placed',
        titleBn: 'অর্ডার জমা নেওয়া হয়েছে',
        descriptionEn: 'Order placed successfully and received in queue',
        descriptionBn: 'আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে',
        isCompleted: true,
        isCurrent: orderStatus === 'pending',
      },
      {
        status: 'processing',
        titleEn: 'Processing & Checking',
        titleBn: 'প্রসেসিং ও ভ্যালিডেশন',
        descriptionEn: 'Pharmacist is verifying stock & prescription',
        descriptionBn: 'ফার্মাসিস্ট স্টক ও প্রেসক্রিপশন নিরীক্ষা করছেন',
        isCompleted: ['processing', 'shipped', 'delivered'].includes(orderStatus),
        isCurrent: orderStatus === 'processing',
      },
      {
        status: 'shipped',
        titleEn: 'Handed to Courier',
        titleBn: 'কুরিয়ারে হস্তান্তরিত',
        descriptionEn: 'Parcel dispatched via express delivery partner',
        descriptionBn: 'পার্সেল কুরিয়ার পার্টনারের নিকট স্পিডে পাঠানো হয়েছে',
        isCompleted: ['shipped', 'delivered'].includes(orderStatus),
        isCurrent: orderStatus === 'shipped',
      },
      {
        status: 'delivered',
        titleEn: 'Delivered',
        titleBn: 'ডেলিভারি সম্পন্ন',
        descriptionEn: 'Order delivered to recipient address',
        descriptionBn: 'পার্সেল আপনার ঠিকানায় সফলভাবে পৌঁছে দেওয়া হয়েছে',
        isCompleted: orderStatus === 'delivered',
        isCurrent: orderStatus === 'delivered',
      },
    ],
  };
}

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
      const data: any = await orderService.getMyOrders();
      const rawList = Array.isArray(data) ? data : data?.data || [];
      const normalizedList = rawList.map(normalizeOrder).filter(Boolean);
      dispatch(setOrders(normalizedList));
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
