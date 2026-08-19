'use client';

import React, { useState } from 'react';
import { Plus, MapPin, User, CheckCircle2 } from 'lucide-react';
import { useAddress } from '@/hooks/useAddress';
import { AddressCard } from './AddressCard';
import { ShippingAddressForm } from './ShippingAddressForm';
import { ShippingAddress } from '@/types/address';
import { useAppSelector } from '@/store';
import { CascadingAddressSelector, AddressCascadeValue } from '@/components/common/CascadingAddressSelector';

interface AddressSelectorProps {
  isBn?: boolean;
}

export function AddressSelector({ isBn = true }: AddressSelectorProps) {
  const {
    addresses,
    selectedAddressId,
    customAddress,
    selectAddress,
    setCustomAddress,
    saveAddress,
    deleteAddress,
    isLoading,
  } = useAddress();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);

  // Mode: 'saved' or 'custom'
  const [addressMode, setAddressMode] = useState<'saved' | 'custom'>(customAddress ? 'custom' : 'saved');

  // Custom Address Form State
  const [customName, setCustomName] = useState(customAddress?.fullName || customAddress?.recipientName || '');
  const [customPhone, setCustomPhone] = useState(customAddress?.phone || '');
  const [customCascade, setCustomCascade] = useState<AddressCascadeValue>({
    division: (customAddress?.division as any) || 'Rajshahi',
    district: customAddress?.district || 'Rajshahi',
    thana: customAddress?.area || customAddress?.thana || 'Boalia',
    streetAddress: customAddress?.streetAddress || customAddress?.addressLine || '',
  });

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: ShippingAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleCustomCascadeChange = (updated: AddressCascadeValue) => {
    setCustomCascade(updated);

    if (customName.trim() && customPhone.trim() && updated.streetAddress.trim()) {
      const customAddrObj: ShippingAddress = {
        id: `custom_${Date.now()}`,
        fullName: customName,
        recipientName: customName,
        phone: customPhone,
        division: updated.division,
        district: updated.district,
        area: updated.thana,
        thana: updated.thana,
        streetAddress: updated.streetAddress,
        addressLine: updated.streetAddress,
        label: 'Custom Address',
      };
      setCustomAddress(customAddrObj);
    }
  };

  const handleUpdateCustomFields = (name: string, phone: string) => {
    setCustomName(name);
    setCustomPhone(phone);

    if (name.trim() && phone.trim() && customCascade.streetAddress.trim()) {
      const customAddrObj: ShippingAddress = {
        id: `custom_${Date.now()}`,
        fullName: name,
        recipientName: name,
        phone,
        division: customCascade.division,
        district: customCascade.district,
        area: customCascade.thana,
        thana: customCascade.thana,
        streetAddress: customCascade.streetAddress,
        addressLine: customCascade.streetAddress,
        label: 'Custom Address',
      };
      setCustomAddress(customAddrObj);
    }
  };

  const handleSwitchToSaved = (id?: string) => {
    setAddressMode('saved');
    setCustomAddress(null);
    if (id) {
      selectAddress(id);
    } else if (addresses.length > 0) {
      selectAddress(addresses[0].id);
    }
  };

  const handleSwitchToCustom = () => {
    setAddressMode('custom');
    if (customName.trim() && customPhone.trim() && customCascade.streetAddress.trim()) {
      const customAddrObj: ShippingAddress = {
        id: `custom_${Date.now()}`,
        fullName: customName,
        recipientName: customName,
        phone: customPhone,
        division: customCascade.division,
        district: customCascade.district,
        area: customCascade.thana,
        thana: customCascade.thana,
        streetAddress: customCascade.streetAddress,
        addressLine: customCascade.streetAddress,
        label: 'Custom Address',
      };
      setCustomAddress(customAddrObj);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section matching Screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
            </h3>
            <p className="text-xs text-gray-500">
              {isBn ? 'আপনার পণ্যটি কোথায় ডেলিভারি করা হবে?' : 'Where should we deliver your order?'}
            </p>
          </div>
        </div>

        {/* Add New Address Button matching Screenshot */}
        {isAuthenticated && <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন ঠিকানা যোগ করুন' : 'Add New Address'}</span>
        </button>}
      </div>

      {isAuthenticated && addressMode === 'saved' ? (
        /* Saved Addresses Grid */
        <div className="space-y-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center space-y-3">
              <p className="text-xs text-gray-500">
                {isBn ? 'আপনার কোনো সংরক্ষিত ঠিকানা পাওয়া যায়নি।' : 'No saved addresses found in your profile.'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isBn ? 'ঠিকানা যোগ করুন' : 'Add Address'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  isSelected={addr.id === selectedAddressId && !customAddress}
                  onSelect={(id) => handleSwitchToSaved(id)}
                  onEdit={handleOpenEdit}
                  onDelete={deleteAddress}
                  isBn={isBn}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Custom Address Form */
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <User className="h-4 w-4 text-blue-600" />
              <span>{isBn ? 'কাস্টম ডেলিভারি ঠিকানা' : 'Custom Delivery Address'}</span>
            </h4>

            {customAddress && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isBn ? 'সক্রিয়' : 'Active'}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isBn ? 'প্রাপকের নাম *' : 'Recipient Name *'}
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => handleUpdateCustomFields(e.target.value, customPhone)}
                placeholder="Ruhul Amin"
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-900 focus:border-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isBn ? 'মোবাইল নম্বর *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={customPhone}
                onChange={(e) => handleUpdateCustomFields(customName, e.target.value)}
                placeholder="01712345678"
                className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <CascadingAddressSelector
            value={customCascade}
            onChange={handleCustomCascadeChange}
            isBn={isBn}
          />
        </div>
      )}

      {/* Modal Form for Profile Address */}
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
