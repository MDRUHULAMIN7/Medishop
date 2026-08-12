'use client';

import React from 'react';
import { Home, Briefcase, MapPin, Check, Edit2, Phone } from 'lucide-react';
import { ShippingAddress } from '@/types/address';
import { cn } from '@/lib/utils';

interface AddressCardProps {
  address: ShippingAddress;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (address: ShippingAddress) => void;
  onDelete?: (id: string) => void;
  isBn?: boolean;
}

export function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  isBn = true,
}: AddressCardProps) {
  const getLabelIcon = () => {
    switch (address.label) {
      case 'Home':
        return <Home className="h-4 w-4 text-blue-600" />;
      case 'Office':
        return <Briefcase className="h-4 w-4 text-blue-600" />;
      default:
        return <MapPin className="h-4 w-4 text-blue-600" />;
    }
  };

  const recipientName = address.recipientName || address.fullName;
  const fullAddrText = `${address.streetAddress || address.addressLine || ''}, ${address.thana || address.area || ''}, ${address.district || ''} ${address.postalCode ? `- ${address.postalCode}` : ''}`;

  return (
    <div
      onClick={() => onSelect(address.id)}
      className={cn(
        'relative cursor-pointer rounded-2xl p-4.5 transition-all duration-200 flex flex-col justify-between',
        isSelected
          ? 'border-2 border-blue-600 bg-white shadow-xs'
          : 'border border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      {/* Top Header Row matching Screenshot */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            {getLabelIcon()}
          </div>
          <span className="text-sm font-bold text-gray-900">{address.label || 'Home'}</span>

          {address.isDefault && (
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-200">
              {isBn ? 'ডিফল্ট' : 'Default'}
            </span>
          )}
        </div>

        {/* Selected Blue Checkmark Badge on Top Right */}
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full transition-all',
            isSelected ? 'bg-blue-600 text-white' : 'border-2 border-gray-300 bg-white'
          )}
        >
          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </div>

      {/* Recipient Details */}
      <div className="space-y-1 my-1">
        <h4 className="text-sm font-bold text-gray-900">{recipientName}</h4>
        <p className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
          <Phone className="h-3.5 w-3.5 text-blue-600" />
          <span>{address.phone}</span>
        </p>
        <p className="text-xs text-gray-500 leading-relaxed mt-1">
          {fullAddrText}
        </p>
      </div>

      {/* Action Footer: Edit Button on Bottom Right */}
      <div className="mt-3 flex items-center justify-end pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>{isBn ? 'সম্পাদনা' : 'Edit'}</span>
        </button>
      </div>
    </div>
  );
}
