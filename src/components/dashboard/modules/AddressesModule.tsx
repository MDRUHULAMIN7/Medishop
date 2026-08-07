'use client';

import React from 'react';
import { AddressSelector } from '@/components/checkout/AddressSelector';

interface AddressesModuleProps {
  isBn?: boolean;
}

export function AddressesModule({ isBn = true }: AddressesModuleProps) {
  return (
    <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-bold text-foreground font-serif-title">
            {isBn ? 'আপনার সংরক্ষিত ডেলিভারি ঠিকানাসমূহ' : 'Your Saved Shipping Addresses'}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'অর্ডারের ডেলিভারির জন্য প্রাইমারি ঠিকানা সেটিং ও একাধিক এড্রেস কন্ট্রোল'
              : 'Manage multiple delivery locations and set your primary default address'}
          </p>
        </div>
      </div>
      <AddressSelector isBn={isBn} />
    </div>
  );
}
