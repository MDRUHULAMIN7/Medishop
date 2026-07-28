import { ShippingAddress } from '@/types/address';

export const ADDRESSES_STORAGE_KEY = 'medishop_addresses_v1';

export const MOCK_INITIAL_ADDRESSES: ShippingAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Mohammad Ruhul Amin',
    phone: '01712345678',
    email: 'ruhul@example.com',
    division: 'Dhaka',
    district: 'Dhaka',
    area: 'Dhanmondi',
    streetAddress: 'House 42, Road 10/A, Dhanmondi R/A',
    postalCode: '1209',
    label: 'Home',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Mohammad Ruhul Amin',
    phone: '01898765432',
    email: 'ruhul.office@example.com',
    division: 'Dhaka',
    district: 'Dhaka',
    area: 'Gulshan 2',
    streetAddress: 'Level 5, Crystal Tower, Gulshan Avenue',
    postalCode: '1212',
    label: 'Office',
    isDefault: false,
  },
];

export class AddressService {
  public async getAddresses(): Promise<ShippingAddress[]> {
    if (typeof window === 'undefined') return MOCK_INITIAL_ADDRESSES;
    try {
      const stored = localStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      this.saveToStorage(MOCK_INITIAL_ADDRESSES);
      return MOCK_INITIAL_ADDRESSES;
    } catch {
      return MOCK_INITIAL_ADDRESSES;
    }
  }

  public async getAddressById(id: string): Promise<ShippingAddress | null> {
    const addresses = await this.getAddresses();
    return addresses.find((a) => a.id === id) || null;
  }

  public async saveAddress(
    addressData: Omit<ShippingAddress, 'id'> & { id?: string }
  ): Promise<ShippingAddress> {
    const addresses = await this.getAddresses();

    let updatedList = [...addresses];
    let savedAddress: ShippingAddress;

    if (addressData.id) {
      // Edit existing
      savedAddress = { ...(addressData as ShippingAddress) };
      updatedList = updatedList.map((a) =>
        a.id === addressData.id ? savedAddress : a
      );
    } else {
      // Create new
      savedAddress = {
        ...(addressData as Omit<ShippingAddress, 'id'>),
        id: `addr-${Date.now()}`,
      };
      if (savedAddress.isDefault || updatedList.length === 0) {
        savedAddress.isDefault = true;
      }
      updatedList.push(savedAddress);
    }

    // Handle isDefault uniqueness
    if (savedAddress.isDefault) {
      updatedList = updatedList.map((a) => ({
        ...a,
        isDefault: a.id === savedAddress.id,
      }));
    }

    this.saveToStorage(updatedList);
    return savedAddress;
  }

  public async deleteAddress(id: string): Promise<void> {
    const addresses = await this.getAddresses();
    let updatedList = addresses.filter((a) => a.id !== id);

    // If default was deleted, promote first item as default
    if (updatedList.length > 0 && !updatedList.some((a) => a.isDefault)) {
      updatedList[0].isDefault = true;
    }

    this.saveToStorage(updatedList);
  }

  public async setDefaultAddress(id: string): Promise<ShippingAddress[]> {
    const addresses = await this.getAddresses();
    const updatedList = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    this.saveToStorage(updatedList);
    return updatedList;
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
