export type AddressLabel = 'Home' | 'Office' | 'Other';

export type Division =
  | 'Dhaka'
  | 'Chattogram'
  | 'Rajshahi'
  | 'Khulna'
  | 'Barishal'
  | 'Sylhet'
  | 'Rangpur'
  | 'Mymensingh';

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  division: Division;
  district: string;
  area: string;
  streetAddress: string;
  postalCode?: string;
  label: AddressLabel;
  isDefault: boolean;
}
