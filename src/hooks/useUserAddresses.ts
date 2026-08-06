'use client';

import { useState, useCallback, useEffect } from 'react';
import { addressService } from '@/services/address.service';
import { ShippingAddress } from '@/types/address';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

export function useUserAddresses() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const list = await addressService.getAddresses();
      setAddresses(list || []);
    } catch {
      toast.error(
        isBn
          ? 'শিপিং ঠিকানা সমুহ লোড করা যায়নি।'
          : 'Failed to load shipping addresses.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const saveAddress = useCallback(
    async (
      data: Partial<ShippingAddress> & {
        id?: string;
        recipientName?: string;
        thana?: string;
        addressLine?: string;
      }
    ) => {
      try {
        setIsSaving(true);
        const saved = await addressService.saveAddress(data);
        await fetchAddresses();
        toast.success(
          isBn
            ? 'শিপিং ঠিকানা সফলভাবে সেভ করা হয়েছে!'
            : 'Shipping address saved successfully!'
        );
        return saved;
      } catch (err: any) {
        toast.error(
          err?.message ||
            (isBn
              ? 'ঠিকানা সেভ করতে ব্যর্থ হয়েছে।'
              : 'Failed to save shipping address.')
        );
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchAddresses, isBn]
  );

  const setDefaultAddress = useCallback(
    async (id: string) => {
      try {
        setIsSaving(true);
        const updated = await addressService.setDefaultAddress(id);
        setAddresses(updated);
        toast.success(
          isBn
            ? 'প্রাইমারি শিপিং ঠিকানা আপডেট করা হয়েছে!'
            : 'Default shipping address updated!'
        );
      } catch (err: any) {
        toast.error(
          err?.message ||
            (isBn
              ? 'ডিফল্ট ঠিকানা সেট করা সম্ভব হয়নি।'
              : 'Failed to set default address.')
        );
      } finally {
        setIsSaving(false);
      }
    },
    [isBn]
  );

  const deleteAddress = useCallback(
    async (id: string) => {
      try {
        setIsSaving(true);
        await addressService.deleteAddress(id);
        await fetchAddresses();
        toast.success(
          isBn ? 'ঠিকানা ডিলিট করা হয়েছে।' : 'Shipping address removed.'
        );
      } catch (err: any) {
        toast.error(
          err?.message ||
            (isBn
              ? 'ঠিকানা ডিলিট করতে ব্যর্থ হয়েছে।'
              : 'Failed to remove address.')
        );
      } finally {
        setIsSaving(false);
      }
    },
    [fetchAddresses, isBn]
  );

  return {
    addresses,
    isLoading,
    isSaving,
    fetchAddresses,
    saveAddress,
    setDefaultAddress,
    deleteAddress,
  };
}
