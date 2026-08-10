import { UserRole } from '@/types';

export interface RbacRoleInfo {
  role: UserRole;
  route: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconName: string;
}

export type RbacTabId = 'inventory_categories';

export interface RbacMenuItem {
  id: RbacTabId;
  labelEn: string;
  labelBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  iconName: string;
  category: 'inventory';
  roles: UserRole[];
  badgeCount?: number;
  targetRoute: string;
}

export const RBAC_ROLES_CONFIG: Record<UserRole, RbacRoleInfo> = {
  admin: {
    role: 'admin',
    route: '/dashboard/admin',
    titleEn: 'Super Administrator',
    titleBn: 'সিস্টেম এডমিন',
    descriptionEn: 'Full system control, categories & manufacturer brand management',
    descriptionBn: 'সম্পূর্ণ সিস্টেম একসেস, ক্যাটাগরি ও ব্রান্ড ম্যানেজমেন্ট',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    iconName: 'ShieldAlert',
  },
  pharmacist: {
    role: 'pharmacist',
    route: '/dashboard/admin',
    titleEn: 'Licensed Pharmacist',
    titleBn: 'রেজিস্টার্ড ফার্মাসিস্ট',
    descriptionEn: 'Verify categories & drug classifications',
    descriptionBn: 'প্রেসক্রিপশন ও ড্রাগ ক্যাটাগরি ভেরিফিকেশন',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    iconName: 'Stethoscope',
  },
  sales_staff: {
    role: 'sales_staff',
    route: '/dashboard/admin',
    titleEn: 'Sales & POS Staff',
    titleBn: 'সেলস ও কাউন্টার স্টাফ',
    descriptionEn: 'Counter POS & product category lookup',
    descriptionBn: 'কাউন্টার পিওএস ও ক্যাটাগরি লুকআপ',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    iconName: 'ShoppingCart',
  },
  inventory_manager: {
    role: 'inventory_manager',
    route: '/dashboard/admin',
    titleEn: 'Inventory Manager',
    titleBn: 'ইনভেন্টরি ম্যানেজার',
    descriptionEn: 'Manage medicine categories, manufacturers & brands',
    descriptionBn: 'মেডিসিন ক্যাটাগরি ও ম্যানুফ্যাকচারার ব্র্যান্ডস',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    iconName: 'Package',
  },
  customer: {
    role: 'customer',
    route: '/profile',
    titleEn: 'Customer / Patient',
    titleBn: 'গ্রাহক / পেশেন্ট',
    descriptionEn: 'Manage personal profile & shipping addresses',
    descriptionBn: 'প্রোফাইল সেটিং ও শিপিং এড্রেস বুক',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconName: 'User',
  },
};

export const RBAC_MENU_ITEMS: RbacMenuItem[] = [
  // Integrated Backend Inventory Catalog (Categories & Brands API)
  {
    id: 'inventory_categories',
    labelEn: 'Categories & Brands',
    labelBn: 'ক্যাটাগরি ও ফার্মা ব্র্যান্ডস',
    descriptionEn: 'Live REST API for Categories & DGDA Manufacturer Brands',
    descriptionBn: 'ক্যাটাগরি ও ডিজিডিএ ম্যানুফ্যাকচারার ব্র্যান্ডস ম্যানেজমেন্ট',
    iconName: 'Tags',
    category: 'inventory',
    roles: ['admin', 'inventory_manager', 'pharmacist', 'sales_staff', 'customer'],
    targetRoute: '/dashboard/admin?tab=categories',
  },
];
