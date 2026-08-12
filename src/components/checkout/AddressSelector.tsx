'use client';

import React, { useState } from 'react';
import { Plus, MapPin, User, Phone, Edit2, CheckCircle2 } from 'lucide-react';
import { useAddress } from '@/hooks/useAddress';
import { AddressCard } from './AddressCard';
import { ShippingAddressForm } from './ShippingAddressForm';
import { ShippingAddress } from '@/types/address';
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(null);

  // Mode: 'saved' or 'custom'
  const [addressMode, setAddressMode] = useState<'saved' | 'custom'>(customAddress ? 'custom' : 'saved');

  // Custom Address Form State
  const [customName, setCustomName] = useState(customAddress?.fullName || customAddress?.recipientName || '');
  const [customPhone, setCustomPhone] = useState(customAddress?.phone || '');
  const [customCascade, setCustomCascade] = useState<AddressCascadeValue>({
    division: (customAddress?.division as any) || 'Dhaka',
    district: customAddress?.district || 'Dhaka',
    thana: customAddress?.area || customAddress?.thana || 'Dhanmondi',
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
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            {isBn ? 'ডেলিভারি ঠিকানা নির্বাচন করুন' : 'Select Shipping Address'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSwitchToSaved()}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              addressMode === 'saved'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-muted/40 border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {isBn ? 'সংরক্ষিত ঠিকানা' : 'Saved Addresses'} ({addresses.length})
          </button>

          <button
            type="button"
            onClick={handleSwitchToCustom}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              addressMode === 'custom'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-muted/40 border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {isBn ? '+ অন্য ঠিকানায় পাঠান' : '+ Ship to Other Address'}
          </button>
        </div>
      </div>

      {addressMode === 'saved' ? (
        /* SAVED ADDRESSES GRID MODE */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {isBn ? 'আপনার প্রোফাইলে সংরক্ষিত যেকোনো একটি ঠিকানা বেছে নিন:' : 'Select one of your saved delivery addresses:'}
            </span>

            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{isBn ? 'নতুন সেভড ঠিকানা যোগ করুন' : 'Add New Address to Profile'}</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-32 rounded-2xl bg-muted/60 animate-pulse" />
              <div className="h-32 rounded-2xl bg-muted/60 animate-pulse" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center space-y-3">
              <p className="text-xs text-muted-foreground">
                {isBn ? 'আপনার প্রোফাইলে কোনো সংরক্ষিত ঠিকানা পাওয়া যায়নি।' : 'No saved addresses found in your profile.'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAdd}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-dark cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isBn ? 'প্রোফাইলে ঠিকানা সেভ করুন' : 'Save Address to Profile'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSwitchToCustom}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted cursor-pointer"
                >
                  <span>{isBn ? 'অথবা কাস্টম ঠিকানা লিখুন' : 'Or Enter Custom Address'}</span>
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
        /* CUSTOM ONE-TIME ADDRESS FORM MODE */
        <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h4 className="text-xs font-extrabold text-foreground flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              <span>{isBn ? 'এই অর্ডারের জন্য কাস্টম ডেলিভারি ঠিকানা (অন্য ঠিকানায় ডেলিভারি)' : 'Custom Shipping Address for this Order'}</span>
            </h4>

            {customAddress && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>{isBn ? 'কাস্টম ঠিকানা সক্রিয়' : 'Custom Address Active'}</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'প্রাপকের নাম *' : 'Recipient Name *'}
              </label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => handleUpdateCustomFields(e.target.value, customPhone)}
                placeholder={isBn ? 'যেমন: সাবরিনা ইয়াছমিন' : 'e.g. Sabrina Yasmin'}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">
                {isBn ? 'প্রাপকের মোবাইল নম্বর *' : 'Recipient Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={customPhone}
                onChange={(e) => handleUpdateCustomFields(customName, e.target.value)}
                placeholder="01712345678"
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Cascading Address Selector */}
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
