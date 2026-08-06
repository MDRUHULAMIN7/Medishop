export type AddressLabel = 'Home' | 'Office' | 'Other' | string;

export type Division =
  | 'Dhaka'
  | 'Chattogram'
  | 'Rajshahi'
  | 'Khulna'
  | 'Barishal'
  | 'Sylhet'
  | 'Rangpur'
  | 'Mymensingh'
  | string;

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  division?: Division;
  district: string;
  area?: string;
  streetAddress?: string;
  recipientName?: string;
  thana?: string;
  addressLine?: string;
  postalCode?: string;
  label?: AddressLabel;
  isDefault?: boolean;
}

export interface CreateAddressPayload {
  label?: string;
  recipientName: string;
  phone: string;
  division?: string;
  district: string;
  thana: string;
  addressLine: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload extends Partial<CreateAddressPayload> {}
