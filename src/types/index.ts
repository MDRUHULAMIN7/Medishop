export type Language = 'bn' | 'en';

export type AuthModalView = 'signin' | 'signup' | 'otp' | 'forgot';

export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
}

export interface CartItem {
  productId: string;
  nameEn: string;
  nameBn: string;
  price: number;
  mrp: number;
  image: string;
  quantity: number;
  requiresRx?: boolean;
}

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
