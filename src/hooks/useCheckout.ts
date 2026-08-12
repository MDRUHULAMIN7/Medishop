import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setDeliveryMethodId,
  setPaymentMethodId,
  setCheckoutNotes,
  setSubmitting,
  resetCheckout,
  selectSelectedDeliveryMethodId,
  selectSelectedPaymentMethodId,
  selectCheckoutNotes,
  selectIsCheckoutSubmitting,
} from '@/store/slices/checkoutSlice';
import { clearCart, selectCartItems } from '@/store/slices/cartSlice';
import { addOrder } from '@/store/slices/orderSlice';
import { useAddress } from './useAddress';
import { checkoutService } from '@/services/checkout.service';
import { orderService } from '@/services/order.service';
import { PricingEngine } from '@/utils/pricing';
import { DeliveryMethodId, PaymentMethodId } from '@/types/checkout';

export function useCheckout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const items = useAppSelector(selectCartItems);
  const appliedCoupon = useAppSelector((state) => state.cart.appliedCoupon);
  const deliveryMethodId = useAppSelector(selectSelectedDeliveryMethodId);
  const paymentMethodId = useAppSelector(selectSelectedPaymentMethodId);
  const notes = useAppSelector(selectCheckoutNotes);
  const isSubmitting = useAppSelector(selectIsCheckoutSubmitting);

  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const { selectedAddress, selectedAddressId } = useAddress();

  const deliveryMethod = checkoutService.getDeliveryMethodById(deliveryMethodId);
  const paymentMethod = checkoutService.getPaymentMethodById(paymentMethodId);

  // Compute total financial summary incorporating selected delivery method
  const shippingOption = {
    id: deliveryMethod.id,
    nameEn: deliveryMethod.nameEn,
    nameBn: deliveryMethod.nameBn,
    baseCharge: deliveryMethod.charge,
    freeThreshold: 999,
    estimatedDeliveryEn: deliveryMethod.estimatedDeliveryEn,
    estimatedDeliveryBn: deliveryMethod.estimatedDeliveryBn,
  };

  const summary = PricingEngine.calculateCartSummary(
    items,
    appliedCoupon,
    shippingOption
  );

  const handleSetDeliveryMethod = useCallback(
    (id: DeliveryMethodId) => {
      dispatch(setDeliveryMethodId(id));
      checkoutService.saveSelectionsToStorage({
        selectedAddressId,
        selectedDeliveryMethodId: id,
        selectedPaymentMethodId: paymentMethodId,
      });
    },
    [dispatch, selectedAddressId, paymentMethodId]
  );

  const handleSetPaymentMethod = useCallback(
    (id: PaymentMethodId) => {
      dispatch(setPaymentMethodId(id));
      checkoutService.saveSelectionsToStorage({
        selectedAddressId,
        selectedDeliveryMethodId: deliveryMethodId,
        selectedPaymentMethodId: id,
      });
    },
    [dispatch, selectedAddressId, deliveryMethodId]
  );

  const handleSetNotes = useCallback(
    (text: string) => {
      dispatch(setCheckoutNotes(text));
    },
    [dispatch]
  );

  const handlePlaceOrder = useCallback(async () => {
    if (items.length === 0) {
      toast.error(isBn ? 'আপনার কার্ট খালি!' : 'Your cart is empty!');
      router.push('/cart');
      return null;
    }

    if (!selectedAddress) {
      toast.error(
        isBn
          ? 'অনুগ্রহ করে ডেলিভারি ঠিকানা নির্বাচন করুন'
          : 'Please select a shipping address'
      );
      return null;
    }

    dispatch(setSubmitting(true));

    try {
      const response = await orderService.checkout({
        shippingAddressId: (selectedAddress as any)._id || selectedAddress.id,
        shippingAddress: {
          recipientName: selectedAddress.recipientName || '',
          phone: selectedAddress.phone || '',
          district: selectedAddress.district || '',
          thana: selectedAddress.thana || '',
          addressLine: selectedAddress.addressLine || '',
          division: selectedAddress.division,
          postalCode: selectedAddress.postalCode,
        },
        paymentMethod: paymentMethod.id as any,
        couponCode: appliedCoupon?.code,
        note: notes,
      });

      const createdOrder = response.order || response.data || response;
      const orderNum = createdOrder?.orderNumber || 'MS-ORDER';

      dispatch(clearCart());
      dispatch(resetCheckout());

      toast.success(
        isBn
          ? `ধন্যবাদ! আপনার অর্ডার (${orderNum}) সফলভাবে সম্পন্ন হয়েছে`
          : `Success! Order (${orderNum}) placed successfully!`
      );

      router.push(`/order/success?orderId=${createdOrder?._id || createdOrder?.id || ''}`);
      return createdOrder;
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(
        error?.message || (isBn ? 'অর্ডার তৈরি করতে ব্যর্থ হয়েছে' : 'Failed to place order')
      );
      return null;
    } finally {
      dispatch(setSubmitting(false));
    }
  }, [
    dispatch,
    items,
    selectedAddress,
    deliveryMethod,
    paymentMethod,
    summary,
    notes,
    isBn,
    router,
  ]);

  return {
    items,
    selectedAddress,
    deliveryMethod,
    paymentMethod,
    availableDeliveryMethods: checkoutService.getDeliveryMethods(),
    availablePaymentMethods: checkoutService.getPaymentMethods(),
    summary,
    notes,
    isSubmitting,
    setDeliveryMethod: handleSetDeliveryMethod,
    setPaymentMethod: handleSetPaymentMethod,
    setNotes: handleSetNotes,
    placeOrder: handlePlaceOrder,
    isBn,
  };
}
