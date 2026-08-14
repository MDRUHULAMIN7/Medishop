import { useCallback, useEffect, useState } from 'react';
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
import { useAddress } from './useAddress';
import { checkoutService } from '@/services/checkout.service';
import { orderService } from '@/services/order.service';
import { settingsService } from '@/services/settings.service';
import { PricingEngine } from '@/utils/pricing';
import { DeliveryMethod, PaymentMethod } from '@/types/checkout';

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

  const [availableDeliveryMethods, setAvailableDeliveryMethods] = useState<DeliveryMethod[]>(
    checkoutService.getDeliveryMethods()
  );
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethod[]>(
    checkoutService.getPaymentMethods()
  );

  // Fetch Public Site Settings & filter ONLY active methods configured by admin
  useEffect(() => {
    let isMounted = true;
    async function loadSettingsMethods() {
      try {
        const publicSettings = await settingsService.getPublicSettings();
        if (!isMounted) return;

        // Dynamic Payment Methods filter (ONLY Active)
        if (publicSettings?.payment?.methods && publicSettings.payment.methods.length > 0) {
          const activeMethods = publicSettings.payment.methods.filter((m) => m.isActive);
          if (activeMethods.length > 0) {
            const mappedPaymentMethods: PaymentMethod[] = activeMethods.map((m) => ({
              id: (m.code || m.id) as any,
              nameEn: m.nameEn || m.nameBn,
              nameBn: m.nameBn || m.nameEn,
              descriptionEn: m.descriptionEn || m.accountNumber || 'Pay securely',
              descriptionBn: m.descriptionBn || m.instructionsBn || 'পণ্য পেয়ে পরিশোধ করুন',
              iconName: m.code === 'card' ? 'CreditCard' : m.code === 'cod' ? 'Banknote' : 'Smartphone',
              isAvailable: true,
            }));
            setAvailablePaymentMethods(mappedPaymentMethods);

            // Auto select first active payment method if current is inactive
            if (!mappedPaymentMethods.some((pm) => pm.id === paymentMethodId)) {
              dispatch(setPaymentMethodId(mappedPaymentMethods[0].id as any));
            }
          }
        }

        // Dynamic Delivery Options filter (ONLY Active)
        if (publicSettings?.shipping?.options && publicSettings.shipping.options.length > 0) {
          const activeOptions = publicSettings.shipping.options.filter((o) => o.isActive);
          if (activeOptions.length > 0) {
            const mappedDeliveryMethods: DeliveryMethod[] = activeOptions.map((o) => ({
              id: (o.code || o.id) as any,
              nameEn: o.nameEn || o.nameBn,
              nameBn: o.nameBn || o.nameEn,
              descriptionEn: o.estimatedDaysEn || '2 - 3 working days',
              descriptionBn: o.estimatedDaysBn || '২ - ৩ কার্যদিবস',
              charge: Number(o.charge ?? 60),
              estimatedDeliveryEn: o.estimatedDaysEn || '2 - 3 working days',
              estimatedDeliveryBn: o.estimatedDaysBn || '২ - ৩ কার্যদিবস',
              isPopular: o.code === 'inside_dhaka',
            }));
            setAvailableDeliveryMethods(mappedDeliveryMethods);

            // Auto select first active delivery option if current is inactive
            if (!mappedDeliveryMethods.some((dm) => dm.id === deliveryMethodId)) {
              dispatch(setDeliveryMethodId(mappedDeliveryMethods[0].id as any));
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dynamic checkout settings:', err);
      }
    }
    loadSettingsMethods();
    return () => {
      isMounted = false;
    };
  }, [dispatch, deliveryMethodId, paymentMethodId]);

  // Selected delivery method fallback
  const deliveryMethod =
    availableDeliveryMethods.find((m) => m.id === deliveryMethodId) ||
    availableDeliveryMethods[0] || {
      id: 'standard',
      nameEn: 'Standard Delivery',
      nameBn: 'স্ট্যান্ডার্ড ডেলিভারি',
      charge: 60,
      estimatedDeliveryEn: '2 - 4 working days',
      estimatedDeliveryBn: '২ - ৪ কর্মদিবস',
    };

  // Selected payment method fallback
  const paymentMethod =
    availablePaymentMethods.find((m) => m.id === paymentMethodId) ||
    availablePaymentMethods[0] || {
      id: 'cod',
      nameEn: 'Cash on Delivery',
      nameBn: 'ক্যাশ অন ডেলিভারি',
    };

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
    (id: any) => {
      dispatch(setDeliveryMethodId(id));
      checkoutService.saveSelectionsToStorage({
        selectedAddressId,
        selectedDeliveryMethodId: id,
        selectedPaymentMethodId: paymentMethodId as any,
      });
    },
    [dispatch, selectedAddressId, paymentMethodId]
  );

  const handleSetPaymentMethod = useCallback(
    (id: any) => {
      dispatch(setPaymentMethodId(id));
      checkoutService.saveSelectionsToStorage({
        selectedAddressId,
        selectedDeliveryMethodId: deliveryMethodId as any,
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
      const rawAddrId = (selectedAddress as any)._id || selectedAddress.id || '';
      const isProfileAddr = rawAddrId && !rawAddrId.startsWith('custom_');

      const checkoutItems = items
        .map((i) => ({
          productId: i.productId || (i as any).product?.id || (i as any).product?._id || '',
          quantity: i.quantity,
        }))
        .filter((i) => i.productId && i.quantity > 0);

      const response = await orderService.checkout({
        items: checkoutItems,
        ...(isProfileAddr ? { shippingAddressId: rawAddrId } : {}),
        shippingAddress: {
          recipientName: selectedAddress.recipientName || selectedAddress.fullName || 'Customer',
          phone: selectedAddress.phone || '01700000000',
          division: selectedAddress.division || 'Dhaka',
          district: selectedAddress.district || 'Dhaka',
          thana: selectedAddress.thana || selectedAddress.area || 'Dhanmondi',
          addressLine: selectedAddress.addressLine || selectedAddress.streetAddress || 'House 1, Road 1',
          postalCode: selectedAddress.postalCode,
        },
        paymentMethod: paymentMethod.id as any,
        couponCode: appliedCoupon?.code,
        deliveryCharge: summary.deliveryCharge,
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
    appliedCoupon,
  ]);

  return {
    items,
    selectedAddress,
    deliveryMethod,
    paymentMethod,
    availableDeliveryMethods,
    availablePaymentMethods,
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
