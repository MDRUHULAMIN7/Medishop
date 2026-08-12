'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2 } from 'lucide-react';
import { addressSchema, AddressFormValues } from '@/validators/address.schema';
import { ShippingAddress, Division } from '@/types/address';

import { CascadingAddressSelector, AddressCascadeValue } from '@/components/common/CascadingAddressSelector';

interface ShippingAddressFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<ShippingAddress, 'id'> & { id?: string }) => Promise<ShippingAddress | null>;
  initialData?: ShippingAddress | null;
  isBn?: boolean;
}

export function ShippingAddressForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  isBn = true,
}: ShippingAddressFormProps) {
  const [cascadeValue, setCascadeValue] = React.useState<AddressCascadeValue>({
    division: 'Dhaka',
    district: 'Dhaka',
    thana: 'Dhanmondi',
    streetAddress: '',
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      division: 'Dhaka',
      district: 'Dhaka',
      area: 'Dhanmondi',
      streetAddress: '',
      postalCode: '',
      label: 'Home',
      isDefault: false,
    },
  });

  useEffect(() => {
    if (initialData) {
      setCascadeValue({
        division: (initialData.division as Division) || 'Dhaka',
        district: initialData.district || 'Dhaka',
        thana: initialData.area || initialData.thana || 'Dhanmondi',
        streetAddress: initialData.streetAddress || initialData.addressLine || '',
      });
      reset({
        fullName: initialData.fullName || initialData.recipientName || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        division: (initialData.division as Division) || 'Dhaka',
        district: initialData.district || 'Dhaka',
        area: initialData.area || initialData.thana || 'Dhanmondi',
        streetAddress: initialData.streetAddress || initialData.addressLine || '',
        postalCode: initialData.postalCode || '',
        label: (initialData.label as 'Home' | 'Office' | 'Other') || 'Home',
        isDefault: Boolean(initialData.isDefault),
      });
    } else {
      setCascadeValue({
        division: 'Dhaka',
        district: 'Dhaka',
        thana: 'Dhanmondi',
        streetAddress: '',
      });
      reset({
        fullName: '',
        phone: '',
        email: '',
        division: 'Dhaka',
        district: 'Dhaka',
        area: 'Dhanmondi',
        streetAddress: '',
        postalCode: '',
        label: 'Home',
        isDefault: false,
      });
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (values: AddressFormValues) => {
    const res = await onSave({
      ...values,
      id: initialData?.id,
    });
    if (res) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="address-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl bg-background p-6 shadow-2xl border border-border my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    id="address-modal-title"
                    className="text-base font-bold text-foreground font-serif-title"
                  >
                    {initialData
                      ? isBn
                        ? 'ঠিকানা সম্পাদনা করুন'
                        : 'Edit Shipping Address'
                      : isBn
                      ? 'নতুন ঠিকানা যোগ করুন'
                      : 'Add New Shipping Address'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBn ? 'আপনার হোম বা অফিস ডেলিভারি ঠিকানা পূরণ করুন' : 'Fill in your recipient details for accurate delivery'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label={isBn ? 'বন্ধ করুন' : 'Close'}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {isBn ? 'প্রাপকের পূর্ণ নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    placeholder={isBn ? 'যেমন: মোঃ রুহুল আমিন' : 'e.g. Ruhul Amin'}
                    className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {isBn ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="01712345678"
                    className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-xs font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Cascading Address Dropdowns (Division -> District -> Thana -> Street Address) */}
              <CascadingAddressSelector
                value={cascadeValue}
                onChange={(updated) => {
                  setCascadeValue(updated);
                  setValue('division', updated.division as any);
                  setValue('district', updated.district);
                  setValue('area', updated.thana);
                  setValue('streetAddress', updated.streetAddress);
                }}
                isBn={isBn}
              />

              {/* Label & IsDefault Checkbox */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {isBn ? 'ঠিকানার লেবেল' : 'Address Label'}
                  </label>
                  <div className="flex gap-2">
                    {(['Home', 'Office', 'Other'] as const).map((lbl) => (
                      <label
                        key={lbl}
                        className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-border px-3 py-1.5 text-xs font-bold has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary transition-all"
                      >
                        <input
                          type="radio"
                          value={lbl}
                          {...register('label')}
                          className="sr-only"
                        />
                        <span>{lbl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    {...register('isDefault')}
                    className="h-4 w-4 rounded-md border-border text-primary focus:ring-primary/20"
                  />
                  <span className="text-xs font-semibold text-foreground">
                    {isBn ? 'ডিফল্ট ঠিকানা হিসেবে সেট করুন' : 'Set as default address'}
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>{isBn ? 'সংরক্ষণ করুন' : 'Save Address'}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
