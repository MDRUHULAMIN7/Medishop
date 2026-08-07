import { apiClient } from '@/lib/apiClient';
import { ShippingAddress } from '@/types/address';
import { User, UserAddress } from '@/types';

export const ADDRESSES_STORAGE_KEY = 'medishop_addresses_v1';

/**
 * Helper to map backend UserAddress format to frontend ShippingAddress format seamlessly.
 */
export function mapUserAddressToShippingAddress(addr: UserAddress): ShippingAddress {
  return {
    id: addr.id || (addr as any)._id?.toString() || `addr-${Date.now()}`,
    fullName: addr.recipientName || 'Recipient Name',
    recipientName: addr.recipientName || 'Recipient Name',
    phone: addr.phone || '01700000000',
    division: addr.division || 'Dhaka',
    district: addr.district || 'Dhaka',
    area: addr.thana || 'Thana',
    thana: addr.thana || 'Thana',
    streetAddress: addr.addressLine || 'Street Address',
    addressLine: addr.addressLine || 'Street Address',
    postalCode: addr.postalCode || '',
    label: (addr.label as any) || 'Home',
    isDefault: Boolean(addr.isDefault),
  };
}

export class AddressService {
  /**
   * Fetch all shipping addresses for current authenticated user from backend API (/users/me/addresses).
   */
  public async getAddresses(): Promise<ShippingAddress[]> {
    try {
      const response = await apiClient<UserAddress[]>('/users/me/addresses');
      if (Array.isArray(response)) {
        const mapped = response.map(mapUserAddressToShippingAddress);
        this.saveToStorage(mapped);
        return mapped;
      }
      return this.getFromStorage();
    } catch (err) {
      console.warn('Backend getAddresses failed, falling back to local state:', err);
      return this.getFromStorage();
    }
  }

  public async getAddressById(id: string): Promise<ShippingAddress | null> {
    const addresses = await this.getAddresses();
    return addresses.find((a) => a.id === id) || null;
  }

  /**
   * Add new or edit existing shipping address via backend API (/users/me/addresses).
   */
  public async saveAddress(
    addressData: Partial<ShippingAddress> & { id?: string; recipientName?: string; thana?: string; addressLine?: string }
  ): Promise<ShippingAddress> {
    const recipientName = (addressData.recipientName || addressData.fullName || 'Recipient Name').trim();
    const thana = (addressData.thana || addressData.area || 'Thana').trim();
    const addressLine = (addressData.addressLine || addressData.streetAddress || 'Street Address').trim();
    const district = (addressData.district || 'Dhaka').trim();
    const rawPhone = (addressData.phone || '01700000000').trim();
    const phone = rawPhone.replace(/[\s-]/g, '');

    const payload = {
      label: (addressData.label || 'Home').trim(),
      recipientName,
      phone,
      division: (addressData.division || 'Dhaka').trim(),
      district,
      thana,
      addressLine,
      postalCode: (addressData.postalCode || '').trim(),
      isDefault: addressData.isDefault,
    };

    try {
      let updatedUser: User;

      if (addressData.id) {
        // Edit existing address via PATCH /users/me/addresses/:addressId
        updatedUser = await apiClient<User>(`/users/me/addresses/${addressData.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        // Add new address via POST /users/me/addresses
        updatedUser = await apiClient<User>('/users/me/addresses', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      if (updatedUser && Array.isArray(updatedUser.addresses)) {
        const mapped = updatedUser.addresses.map(mapUserAddressToShippingAddress);
        this.saveToStorage(mapped);
        const target = mapped.find((a) => a.id === addressData.id) || mapped[mapped.length - 1];
        return target || mapUserAddressToShippingAddress(updatedUser.addresses[0]);
      }
    } catch (err: any) {
      console.warn('Backend address save failed, falling back to local state:', err);
    }

    // Local Storage fallback
    const addresses = await this.getFromStorage();
    let updatedList = [...addresses];
    let savedAddress: ShippingAddress;

    if (addressData.id) {
      savedAddress = {
        id: addressData.id,
        fullName: recipientName,
        recipientName,
        phone,
        division: addressData.division || 'Dhaka',
        district,
        area: thana,
        thana,
        streetAddress: addressLine,
        addressLine,
        postalCode: addressData.postalCode || '',
        label: (addressData.label as any) || 'Home',
        isDefault: Boolean(addressData.isDefault),
      };
      updatedList = updatedList.map((a) => (a.id === addressData.id ? savedAddress : a));
    } else {
      savedAddress = {
        id: `addr-${Date.now()}`,
        fullName: recipientName,
        recipientName,
        phone,
        division: addressData.division || 'Dhaka',
        district,
        area: thana,
        thana,
        streetAddress: addressLine,
        addressLine,
        postalCode: addressData.postalCode || '',
        label: (addressData.label as any) || 'Home',
        isDefault: addressData.isDefault || updatedList.length === 0,
      };
      updatedList.push(savedAddress);
    }

    this.saveToStorage(updatedList);
    return savedAddress;
  }

  /**
   * Set address as default via backend API (/users/me/addresses/:id/default).
   */
  public async setDefaultAddress(id: string): Promise<ShippingAddress[]> {
    try {
      const updatedUser = await apiClient<User>(`/users/me/addresses/${id}/default`, {
        method: 'PATCH',
      });
      if (updatedUser && Array.isArray(updatedUser.addresses)) {
        const mapped = updatedUser.addresses.map(mapUserAddressToShippingAddress);
        this.saveToStorage(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Set default address backend failed:', err);
    }

    const addresses = await this.getFromStorage();
    const updatedList = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    this.saveToStorage(updatedList);
    return updatedList;
  }

  /**
   * Delete address via backend API (/users/me/addresses/:id).
   */
  public async deleteAddress(id: string): Promise<void> {
    try {
      const updatedUser = await apiClient<User>(`/users/me/addresses/${id}`, {
        method: 'DELETE',
      });
      if (updatedUser && Array.isArray(updatedUser.addresses)) {
        const mapped = updatedUser.addresses.map(mapUserAddressToShippingAddress);
        this.saveToStorage(mapped);
        return;
      }
    } catch (err) {
      console.warn('Delete address backend failed:', err);
    }

    const addresses = await this.getFromStorage();
    const updatedList = addresses.filter((a) => a.id !== id);
    if (updatedList.length > 0 && !updatedList.some((a) => a.isDefault)) {
      updatedList[0].isDefault = true;
    }
    this.saveToStorage(updatedList);
  }

  private getFromStorage(): ShippingAddress[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Empty
    }
    return [];
  }

  private saveToStorage(addresses: ShippingAddress[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(addresses));
    } catch (e) {
      console.error('Failed to save addresses to storage:', e);
    }
  }
}

export const addressService = new AddressService();
