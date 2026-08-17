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

export type RbacTabId =
  | 'overview'
  | 'products'
  | 'categories'
  | 'brands'
  | 'inventory_categories'
  | 'inventory'
  | 'ledger'
  | 'pos_sales'
  | 'orders'
  | 'chat'
  | 'prescriptions'
  | 'coupons'
  | 'banners'
  | 'reviews'
  | 'reports'
  | 'staff'
  | 'users'
  | 'settings';

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
    titleEn: 'Admin',
    titleBn: 'এডমিন',
    descriptionEn: 'Full system control, categories & manufacturer brand management',
    descriptionBn: 'সম্পূর্ণ সিস্টেম একসেস, ক্যাটাগরি ও ব্রান্ড ম্যানেজমেন্ট',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    iconName: 'ShieldAlert',
  },
  super_admin: {
    role: 'super_admin',
    route: '/dashboard/admin',
    titleEn: 'Admin',
    titleBn: 'এডমিন',
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
    titleEn: 'Pharmacist',
    titleBn: 'ফার্মাসিস্ট',
    descriptionEn: 'Verify categories & prescription orders',
    descriptionBn: 'প্রেসক্রিপশন ও ড্রাগ ক্যাটাগরি ভেরিফিকেশন',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    iconName: 'Stethoscope',
  },
  pharmacist_verifier: {
    role: 'pharmacist_verifier',
    route: '/dashboard/admin',
    titleEn: 'Pharmacist Verifier',
    titleBn: 'প্রেসক্রিপশন ভেরিফায়ার',
    descriptionEn: 'Verify prescriptions & patient orders',
    descriptionBn: 'প্রেসক্রিপশন ভেরিফিকেশন ও রিভিউ',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    iconName: 'Stethoscope',
  },
  sales_staff: {
    role: 'sales_staff',
    route: '/dashboard/admin',
    titleEn: 'Sales Staff',
    titleBn: 'সেলস স্টাফ',
    descriptionEn: 'Counter POS & customer order processing',
    descriptionBn: 'কাউন্টার পিওএস ও অর্ডার প্রসেসিং',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    iconName: 'ShoppingCart',
  },
  order_manager: {
    role: 'order_manager',
    route: '/dashboard/admin',
    titleEn: 'Order Manager',
    titleBn: 'অর্ডার ম্যানেজার',
    descriptionEn: 'Manage orders, fulfillment & delivery dispatch',
    descriptionBn: 'কাস্টমার অর্ডার ও ডেলিভারি ডিসপ্যাচ',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconName: 'ShoppingBag',
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
  marketing_editor: {
    role: 'marketing_editor',
    route: '/dashboard/admin',
    titleEn: 'Marketing Editor',
    titleBn: 'মার্কেটিং এডিটর',
    descriptionEn: 'Manage coupons, sliders & customer reviews',
    descriptionBn: 'কুপন, হোম স্লাইডার ও রিভিউ মডারেশন',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
    badgeText: 'text-purple-700',
    badgeBorder: 'border-purple-200',
    iconName: 'Megaphone',
  },
  customer: {
    role: 'customer',
    route: '/profile',
    titleEn: 'Customer',
    titleBn: 'গ্রাহক',
    descriptionEn: 'Manage personal profile & shipping addresses',
    descriptionBn: 'প্রোফাইল সেটিং ও শিপিং এড্রেস বুক',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconName: 'User',
  },
};

export const getRoleDashboardTitle = (role?: string, isBn = true): string => {
  switch (role) {
    case 'pharmacist':
    case 'pharmacist_verifier':
      return isBn ? 'ফার্মাসিস্ট ড্যাশবোর্ড' : 'Pharmacist Dashboard';
    case 'sales_staff':
      return isBn ? 'সেলস ড্যাশবোর্ড' : 'Sales Dashboard';
    case 'inventory_manager':
      return isBn ? 'ইনভেন্টরি ড্যাশবোর্ড' : 'Inventory Dashboard';
    case 'order_manager':
      return isBn ? 'অর্ডার ড্যাশবোর্ড' : 'Order Dashboard';
    case 'marketing_editor':
      return isBn ? 'মার্কেটিং ড্যাশবোর্ড' : 'Marketing Dashboard';
    case 'super_admin':
    case 'admin':
    default:
      return isBn ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard';
  }
};

export const RBAC_MENU_ITEMS: RbacMenuItem[] = [
  {
    id: 'products',
    labelEn: 'Pharmaceutical Products',
    labelBn: 'ওষুধ ও পণ্য ক্যাটালগ',
    descriptionEn: 'Live REST API for Products, Images & Inventory Stock',
    descriptionBn: 'ওষুধ, ইমেজ ফাইল আপলোড ও স্টকে প্রোডাক্ট ক্যাটালগ',
    iconName: 'Pill',
    category: 'inventory',
    roles: ['admin', 'super_admin', 'inventory_manager', 'pharmacist', 'sales_staff'],
    targetRoute: '/dashboard/admin?tab=products',
  },
  {
    id: 'inventory_categories',
    labelEn: 'Categories & Brands',
    labelBn: 'ক্যাটাগরি ও ফার্মা ব্র্যান্ডস',
    descriptionEn: 'Live REST API for Categories & DGDA Manufacturer Brands',
    descriptionBn: 'ক্যাটাগরি ও ডিজিডিএ ম্যানুফ্যাকচারার ব্র্যান্ডস ম্যানেজমেন্ট',
    iconName: 'Tags',
    category: 'inventory',
    roles: ['admin', 'super_admin', 'inventory_manager', 'pharmacist'],
    targetRoute: '/dashboard/admin?tab=inventory_categories',
  },
];
