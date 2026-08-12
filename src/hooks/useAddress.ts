import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSelectedAddressId,
  setCustomAddress,
  selectSelectedAddressId,
  selectCustomAddress,
} from '@/store/slices/checkoutSlice';
import { ShippingAddress } from '@/types/address';
import { addressService } from '@/services/address.service';

export function useAddress() {
  const dispatch = useAppDispatch();
  const selectedAddressId = useAppSelector(selectSelectedAddressId);
  const customAddress = useAppSelector(selectCustomAddress);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);

      // Auto select default address if none selected and no custom address active
      if (!selectedAddressId && !customAddress && data.length > 0) {
        const defaultAddr = data.find((a) => a.isDefault) || data[0];
        dispatch(setSelectedAddressId(defaultAddr.id));
      }
    } catch (e) {
      console.error('Failed to load addresses:', e);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, selectedAddressId, customAddress]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const selectedAddress: ShippingAddress | null =
    customAddress ||
    addresses.find((a) => a.id === selectedAddressId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0] ||
    null;

  const handleSaveAddress = useCallback(
    async (addressData: Omit<ShippingAddress, 'id'> & { id?: string }) => {
      try {
        const saved = await addressService.saveAddress(addressData);
        await fetchAddresses();
        dispatch(setSelectedAddressId(saved.id));
        toast.success(
          isBn
            ? 'ঠিকানা সফলভাবে সংরক্ষণ করা হয়েছে'
            : 'Address saved successfully'
        );
        return saved;
      } catch (e) {
        toast.error(
          isBn ? 'ঠিকানা সংরক্ষণ করতে ব্যর্থ হয়েছে' : 'Failed to save address'
        );
        return null;
      }
    },
    [dispatch, fetchAddresses, isBn]
  );

  const handleDeleteAddress = useCallback(
    async (id: string) => {
      try {
        await addressService.deleteAddress(id);
        await fetchAddresses();
        toast.info(isBn ? 'ঠিকানা মোছা হয়েছে' : 'Address removed');
      } catch (e) {
        toast.error(isBn ? 'ঠিকানা মুছতে ব্যর্থ হয়েছে' : 'Failed to delete address');
      }
    },
    [fetchAddresses, isBn]
  );

  const handleSelectAddress = useCallback(
    (id: string) => {
      dispatch(setSelectedAddressId(id));
    },
    [dispatch]
  );

  const handleSetCustomAddress = useCallback(
    (addr: ShippingAddress | null) => {
      dispatch(setCustomAddress(addr));
    },
    [dispatch]
  );

  const handleSetDefaultAddress = useCallback(
    async (id: string) => {
      try {
        const updated = await addressService.setDefaultAddress(id);
        setAddresses(updated);
        dispatch(setSelectedAddressId(id));
        toast.success(
          isBn
            ? 'ডিফল্ট ঠিকানা আপডেট করা হয়েছে'
            : 'Default address updated'
        );
      } catch (e) {
        toast.error(isBn ? 'আপডেট করতে সমস্যা হয়েছে' : 'Failed to update default address');
      }
    },
    [dispatch, isBn]
  );

  return {
    addresses,
    selectedAddress,
    selectedAddressId,
    customAddress,
    isLoading,
    saveAddress: handleSaveAddress,
    deleteAddress: handleDeleteAddress,
    selectAddress: handleSelectAddress,
    setCustomAddress: handleSetCustomAddress,
    setDefaultAddress: handleSetDefaultAddress,
    refreshAddresses: fetchAddresses,
  };
}
