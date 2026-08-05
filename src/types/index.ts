export type Language = 'bn' | 'en';

export type AuthModalView =
  | 'identifier'
  | 'password_login'
  | 'verify_otp'
  | 'complete_registration'
  | 'reset_password'
  // Compatibility aliases
  | 'signin'
  | 'signup'
  | 'otp'
  | 'forgot';

export type UserRole = 'customer' | 'pharmacist' | 'sales_staff' | 'inventory_manager' | 'admin';
export type UserStatus = 'active' | 'blocked';

export interface UserAddress {
  id: string;
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

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  avatar?: string | null;
  status?: UserStatus;
  isVerified?: boolean;
  addresses?: UserAddress[];
  lastLoginAt?: string | null;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export * from './cart';
export * from './address';
export * from './checkout';
export * from './order';
export * from './auth';

export interface NavCategory {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  iconName: string;
  isPopular?: boolean;
}

export interface TrustBadge {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  iconName: string;
}

export interface NavigationLink {
  labelBn: string;
  labelEn: string;
  href: string;
  badge?: string;
}
