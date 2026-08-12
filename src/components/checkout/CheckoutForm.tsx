'use client';

import React from 'react';
import { ShieldCheck, Truck, Lock, Headset } from 'lucide-react';
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

      {/* Trust Badges Row matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        {/* Badge 1 */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900">{isBn ? '১০০% আসল ওষুধ' : '100% Authentic'}</h5>
            <p className="text-[11px] text-gray-400">{isBn ? 'গ্যারান্টিযুক্ত মেডিসিন' : 'Genuine medicines guaranteed'}</p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900">{isBn ? 'দ্রুত ডেলিভারি' : 'Fast & Reliable Delivery'}</h5>
            <p className="text-[11px] text-gray-400">{isBn ? 'সঠিক সময়ে ডেলিভারি' : 'On-time delivery at your door'}</p>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900">{isBn ? 'নিরাপদ পেমেন্ট' : 'Secure Payment'}</h5>
            <p className="text-[11px] text-gray-400">{isBn ? 'পেমেন্ট এনক্রিপ্টেড' : 'Your payment info is safe'}</p>
          </div>
        </div>

        {/* Badge 4 */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-2xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Headset className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-gray-900">{isBn ? '২৪/৭ কাস্টমার সাপোর্ট' : '24/7 Customer Support'}</h5>
            <p className="text-[11px] text-gray-400">{isBn ? 'সবসময় পাশে আছি' : "We're here to help anytime"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
