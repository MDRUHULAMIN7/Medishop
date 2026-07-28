'use client';

import React from 'react';
import { Home, Briefcase, MapPin, Check, Edit2, Trash2, Phone } from 'lucide-react';
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
  onDelete,
  isBn = true,
}: AddressCardProps) {
  const getLabelIcon = () => {
    switch (address.label) {
      case 'Home':
        return <Home className="h-3.5 w-3.5" />;
      case 'Office':
        return <Briefcase className="h-3.5 w-3.5" />;
      default:
        return <MapPin className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div
      onClick={() => onSelect(address.id)}
      className={cn(
        'relative flex cursor-pointer flex-col justify-between rounded-2xl border p-4.5 transition-all duration-200',
        isSelected
          ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
          : 'border-border bg-background hover:border-primary/40 hover:shadow-xs'
      )}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {/* Label Badge */}
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-1 text-xs font-bold text-foreground">
            {getLabelIcon()}
            {address.label}
          </span>

          {/* Default Badge */}
          {address.isDefault && (
            <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
              {isBn ? 'ডিফল্ট' : 'Default'}
            </span>
          )}
        </div>

        {/* Selected Check Indicator */}
        <div
          className={cn(
            'flex h-5 w-5 items-center justify-center rounded-full border transition-all',
            isSelected
              ? 'border-primary bg-primary text-white'
              : 'border-muted-foreground/30 bg-background'
          )}
        >
          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </div>

      {/* Recipient Details */}
      <div className="space-y-1 my-2">
        <h4 className="text-sm font-bold text-foreground">{address.fullName}</h4>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Phone className="h-3 w-3" />
          {address.phone}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
          {address.streetAddress}, {address.area}, {address.district}, {address.division}
          {address.postalCode ? ` - ${address.postalCode}` : ''}
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-3 flex items-center justify-end gap-3 pt-2.5 border-t border-border/60">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(address);
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>{isBn ? 'সম্পাদনা' : 'Edit'}</span>
        </button>

        {onDelete && !address.isDefault && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{isBn ? 'মুছুন' : 'Delete'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
