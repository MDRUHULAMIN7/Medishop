export type Language = 'bn' | 'en';

export type AuthModalView = 'signin' | 'signup' | 'otp' | 'forgot';

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}

export * from './cart';
export * from './address';
export * from './checkout';
export * from './order';

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
