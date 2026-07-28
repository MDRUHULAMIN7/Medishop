'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAddress } from '@/hooks/useAddress';
import { AddressCard } from './AddressCard';
import { ShippingAddressForm } from './ShippingAddressForm';
import { ShippingAddress } from '@/types/address';

interface AddressSelectorProps {
  isBn?: boolean;
}

export function AddressSelector({ isBn = true }: AddressSelectorProps) {
  const {
    addresses,
    selectedAddressId,
    selectAddress,
    saveAddress,
    deleteAddress,
    isLoading,
  } = useAddress();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: ShippingAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          {isBn ? 'ডেলিভারি ঠিকানা নির্বাচন করুন' : 'Select Shipping Address'}
        </h3>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন ঠিকানা যোগ করুন' : 'Add New Address'}</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-32 rounded-2xl bg-muted/60 animate-pulse" />
          <div className="h-32 rounded-2xl bg-muted/60 animate-pulse" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
          <p className="text-xs text-muted-foreground mb-3">
            {isBn ? 'আপনার কোনো সংরক্ষিত ঠিকানা নেই' : 'No saved addresses found'}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>{isBn ? 'ঠিকানা যোগ করুন' : 'Add Address'}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={addr.id === selectedAddressId}
              onSelect={selectAddress}
              onEdit={handleOpenEdit}
              onDelete={deleteAddress}
              isBn={isBn}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      <ShippingAddressForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={saveAddress}
        initialData={editingAddress}
        isBn={isBn}
      />
    </div>
  );
}
