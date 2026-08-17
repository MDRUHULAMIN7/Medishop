'use client';

import React from 'react';
import { AddressSelector } from './AddressSelector';
import { DeliveryMethodSelector } from './DeliveryMethodSelector';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { useCheckout } from '@/hooks/useCheckout';

interface CheckoutFormProps {
  isBn?: boolean;
}

export function CheckoutForm({ isBn = true }: CheckoutFormProps) {
  const {
    availableDeliveryMethods,
    deliveryMethod,
    setDeliveryMethod,
    availablePaymentMethods,
    paymentMethod,
    setPaymentMethod,
    canSplitDelivery,
    isSplitDelivery,
    setIsSplitDelivery,
    shipment1DeliveryMethodId,
    setShipment1DeliveryMethodId,
    shipment2DeliveryMethodId,
    setShipment2DeliveryMethodId,
  } = useCheckout();

  return (
    <div className="space-y-6">
      {/* Section 1: Delivery Address */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <AddressSelector isBn={isBn} />
      </section>

      {/* Section 2: Delivery Options */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <DeliveryMethodSelector
          methods={availableDeliveryMethods}
          selectedId={deliveryMethod.id}
          onSelect={setDeliveryMethod}
          canSplitDelivery={canSplitDelivery}
          isSplitDelivery={isSplitDelivery}
          onToggleSplitDelivery={setIsSplitDelivery}
          shipment1SelectedId={shipment1DeliveryMethodId}
          onSelectShipment1={setShipment1DeliveryMethodId}
          shipment2SelectedId={shipment2DeliveryMethodId}
          onSelectShipment2={setShipment2DeliveryMethodId}
          isBn={isBn}
        />
      </section>

      {/* Section 3: Payment Method */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs">
        <PaymentMethodSelector
          methods={availablePaymentMethods}
          selectedId={paymentMethod.id}
          onSelect={setPaymentMethod}
          isBn={isBn}
        />
      </section>
    </div>
  );
}
