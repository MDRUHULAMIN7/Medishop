'use client';

import React from 'react';
import { AddressSelector } from './AddressSelector';
import { DeliveryMethodSelector } from './DeliveryMethodSelector';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { OrderReview } from './OrderReview';
import { useCheckout } from '@/hooks/useCheckout';

interface CheckoutFormProps {
  isBn?: boolean;
}

export function CheckoutForm({ isBn = true }: CheckoutFormProps) {
  const {
    items,
    availableDeliveryMethods,
    deliveryMethod,
    setDeliveryMethod,
    availablePaymentMethods,
    paymentMethod,
    setPaymentMethod,
    notes,
    setNotes,
  } = useCheckout();

  return (
    <div className="space-y-6">
      {/* 1. Address Section */}
      <section className="rounded-2xl border border-border bg-background p-5 shadow-xs">
        <AddressSelector isBn={isBn} />
      </section>

      {/* 2. Delivery Options */}
      <section className="rounded-2xl border border-border bg-background p-5 shadow-xs">
        <DeliveryMethodSelector
          methods={availableDeliveryMethods}
          selectedId={deliveryMethod.id}
          onSelect={setDeliveryMethod}
          isBn={isBn}
        />
      </section>

      {/* 3. Payment Methods */}
      <section className="rounded-2xl border border-border bg-background p-5 shadow-xs">
        <PaymentMethodSelector
          methods={availablePaymentMethods}
          selectedId={paymentMethod.id}
          onSelect={setPaymentMethod}
          isBn={isBn}
        />
      </section>

      {/* 4. Order Review & Notes */}
      <section className="rounded-2xl border border-border bg-background p-5 shadow-xs space-y-4">
        <OrderReview items={items} isBn={isBn} />

        {/* Delivery Note Input */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            {isBn ? 'ডেলিভারির বিশেষ নির্দেশনা (ঐচ্ছিক)' : 'Delivery Note / Special Instructions (Optional)'}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder={isBn ? 'যেমন: কলিং বেল বাজাবেন না, অথবা সিকিউরিটি গার্ডের কাছে রাখুন' : 'e.g. Leave with security guard or call upon arrival'}
            className="w-full rounded-xl border border-border bg-muted/30 p-3 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </section>
    </div>
  );
}
