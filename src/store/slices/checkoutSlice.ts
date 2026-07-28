import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeliveryMethodId, PaymentMethodId } from '@/types/checkout';

interface CheckoutSliceState {
  selectedAddressId: string | null;
  selectedDeliveryMethodId: DeliveryMethodId;
  selectedPaymentMethodId: PaymentMethodId;
  notes: string;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: CheckoutSliceState = {
  selectedAddressId: null,
  selectedDeliveryMethodId: 'standard',
  selectedPaymentMethodId: 'cod',
  notes: '',
  isSubmitting: false,
  error: null,
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setSelectedAddressId: (state, action: PayloadAction<string | null>) => {
      state.selectedAddressId = action.payload;
    },
    setDeliveryMethodId: (state, action: PayloadAction<DeliveryMethodId>) => {
      state.selectedDeliveryMethodId = action.payload;
    },
    setPaymentMethodId: (state, action: PayloadAction<PaymentMethodId>) => {
      state.selectedPaymentMethodId = action.payload;
    },
    setCheckoutNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setCheckoutError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetCheckout: (state) => {
      state.selectedAddressId = null;
      state.selectedDeliveryMethodId = 'standard';
      state.selectedPaymentMethodId = 'cod';
      state.notes = '';
      state.isSubmitting = false;
      state.error = null;
    },
  },
});

export const {
  setSelectedAddressId,
  setDeliveryMethodId,
  setPaymentMethodId,
  setCheckoutNotes,
  setSubmitting,
  setCheckoutError,
  resetCheckout,
} = checkoutSlice.actions;

export const selectSelectedAddressId = (state: { checkout: CheckoutSliceState }) =>
  state.checkout.selectedAddressId;
export const selectSelectedDeliveryMethodId = (state: { checkout: CheckoutSliceState }) =>
  state.checkout.selectedDeliveryMethodId;
export const selectSelectedPaymentMethodId = (state: { checkout: CheckoutSliceState }) =>
  state.checkout.selectedPaymentMethodId;
export const selectCheckoutNotes = (state: { checkout: CheckoutSliceState }) =>
  state.checkout.notes;
export const selectIsCheckoutSubmitting = (state: { checkout: CheckoutSliceState }) =>
  state.checkout.isSubmitting;
export const selectCheckoutError = (state: { checkout: CheckoutSliceState }) =>
  state.checkout.error;

export default checkoutSlice.reducer;
