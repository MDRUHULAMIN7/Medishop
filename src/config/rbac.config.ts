import { UserRole } from '@/types';

export interface RbacRoleInfo {
  role: UserRole;
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
  | 'profile'
  | 'addresses'
  | 'orders_me'
  | 'prescriptions_me'
  | 'prescriptions_audit'
  | 'pos_sales'
  | 'inventory_products'
  | 'inventory_categories'
  | 'inventory_low_stock'
  | 'admin_analytics'
  | 'admin_users'
  | 'admin_coupons';

export interface RbacMenuItem {
  id: RbacTabId;
  labelEn: string;
  labelBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  iconName: string;
  category: 'personal' | 'clinical' | 'sales' | 'inventory' | 'administration';
  roles: UserRole[];
  badgeCount?: number;
}

export const RBAC_ROLES_CONFIG: Record<UserRole, RbacRoleInfo> = {
  customer: {
    role: 'customer',
    titleEn: 'Customer / Patient',
    titleBn: 'গ্রাহক / পেশেন্ট',
    descriptionEn: 'Manage prescriptions, order history, and delivery addresses',
    descriptionBn: 'প্রেসক্রিপশন আপলোড, অর্ডারের হিস্ট্রি ও ডেলিভারি এড্রেস কন্ট্রোল',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconName: 'User',
  },
  pharmacist: {
    role: 'pharmacist',
    titleEn: 'Licensed Pharmacist',
    titleBn: 'রেজিস্টার্ড ফার্মাসিস্ট',
    descriptionEn: 'Audit Rx prescriptions, verify OTC compliance & counter sales',
    descriptionBn: 'প্রেসক্রিপশন ভেরিফিকেশন, ওটিসি ড্রাগ রিভিউ ও কাউন্টার সেলস',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    iconName: 'Stethoscope',
  },
  sales_staff: {
    role: 'sales_staff',
    titleEn: 'Sales & POS Staff',
    titleBn: 'সেলস ও কাউন্টার স্টাফ',
    descriptionEn: 'Process fast counter sales, print billing receipts & register cash',
    descriptionBn: 'কাউন্টার পিওএস সেলস, ক্যাশ রেজিস্টার ও বিলিং রিসিপ্ট',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    iconName: 'ShoppingCart',
  },
  inventory_manager: {
    role: 'inventory_manager',
    titleEn: 'Inventory Manager',
    titleBn: 'ইনভেন্টরি ম্যানেজার',
    descriptionEn: 'Manage stock levels, batch expiry dates, categories & brands',
    descriptionBn: 'মেডিসিন স্টক ট্র্যাকিং, ব্যাচ মেয়াদ, ক্যাটাগরি ও ব্র্যান্ড',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    iconName: 'Package',
  },
  admin: {
    role: 'admin',
    titleEn: 'Super Administrator',
    titleBn: 'সিস্টেম এডমিন',
    descriptionEn: 'Full system control, sales analytics, user status block & coupons',
    descriptionBn: 'সম্পূর্ণ সিস্টেম একসেস, সেলস এনালাইটিক্স, ইউজার ব্লক ও কুপন',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    iconName: 'ShieldAlert',
  },
};

export const RBAC_MENU_ITEMS: RbacMenuItem[] = [
  // 1. Personal Section (Available to ALL roles)
  {
    id: 'profile',
    labelEn: 'Personal Profile',
    labelBn: 'প্রোফাইল তথ্য',
    descriptionEn: 'Update name, mobile, email and profile picture (Max 5MB)',
    descriptionBn: 'নাম, মোবাইল, ইমেইল ও প্রোফাইল ছবি সেটিং (সর্বোচ্চ 5MB)',
    iconName: 'User',
    category: 'personal',
    roles: ['customer', 'pharmacist', 'sales_staff', 'inventory_manager', 'admin'],
  },
  {
    id: 'addresses',
    labelEn: 'Delivery Addresses',
    labelBn: 'শিপিং এড্রেস বুক',
    descriptionEn: 'Manage primary and multiple saved delivery addresses',
    descriptionBn: 'একাধিক ডেলিভারি ঠিকানা যোগ ও ডিফল্ট এড্রেস নির্বাচন',
    iconName: 'MapPin',
    category: 'personal',
    roles: ['customer', 'pharmacist', 'sales_staff', 'inventory_manager', 'admin'],
  },
  {
    id: 'orders_me',
    labelEn: 'My Order History',
    labelBn: 'আমার অনলাইন অর্ডারস',
    descriptionEn: 'Track placed medicine orders, status updates and invoices',
    descriptionBn: 'অর্ডারের লাইভ স্টেটাস, ট্র্যাকিং ও ট্যাক্স ইনভয়েস',
    iconName: 'PackageCheck',
    category: 'personal',
    roles: ['customer', 'admin'],
  },
  {
    id: 'prescriptions_me',
    labelEn: 'My Prescriptions',
    labelBn: 'আমার প্রেসক্রিপশন সমূহ',
    descriptionEn: 'Upload medical prescription PDFs or photos for verification',
    descriptionBn: 'প্রেসক্রিপশন ফাইল আপলোড ও ডাক্তার প্রেসক্রিপশন রেকর্ডস',
    iconName: 'FileText',
    category: 'personal',
    roles: ['customer', 'admin'],
  },

  // 2. Clinical & Prescription Section (Pharmacist & Admin)
  {
    id: 'prescriptions_audit',
    labelEn: 'Rx Audit & Verification',
    labelBn: 'প্রেসক্রিপশন অডিট ও অনুমোদন',
    descriptionEn: 'Review patient uploaded prescriptions, verify OTC & approve',
    descriptionBn: 'পেশেন্টের আপলোড করা প্রেসক্রিপশন রিভিউ ও ডিজিটাল সিগনেচার',
    iconName: 'ClipboardCheck',
    category: 'clinical',
    roles: ['pharmacist', 'admin'],
  },

  // 3. Sales & Counter POS Section (Sales Staff, Pharmacist & Admin)
  {
    id: 'pos_sales',
    labelEn: 'Counter POS Terminal',
    labelBn: 'কাউন্টার সেলস টার্মিনাল (POS)',
    descriptionEn: 'In-store fast medicine billing, barcode scanner & receipts',
    descriptionBn: 'ফার্মেসী ডিসপেনসারি ক্যাশ কাউন্টার বিলিং ও রসিদ প্রিন্টিং',
    iconName: 'ShoppingBag',
    category: 'sales',
    roles: ['sales_staff', 'pharmacist', 'admin'],
  },

  // 4. Inventory Management Section (Inventory Manager & Admin)
  {
    id: 'inventory_products',
    labelEn: 'Medicine & Stock Catalog',
    labelBn: 'মেডিসিন ক্যাটালগ ও স্টক',
    descriptionEn: 'Manage product listings, pricing, strip sizes & stock count',
    descriptionBn: 'মেডিসিন প্রাইসিং, স্ট্রিপ সাইজ ও ডাটাবেজ ক্যাটালগ',
    iconName: 'Boxes',
    category: 'inventory',
    roles: ['inventory_manager', 'admin'],
  },
  {
    id: 'inventory_categories',
    labelEn: 'Categories & Brands',
    labelBn: 'ক্যাটাগরি ও ফার্মাসিউটিক্যালস',
    descriptionEn: 'Manage category tree and pharma manufacturer brand profiles',
    descriptionBn: 'ঔষধের শ্রেণীবিভাগ ও স্কয়ার, ইনসেপ্টার মতো ব্র্যান্ডস',
    iconName: 'Tags',
    category: 'inventory',
    roles: ['inventory_manager', 'admin'],
  },
  {
    id: 'inventory_low_stock',
    labelEn: 'Low Stock Restock Alerts',
    labelBn: 'স্টক শর্টেজ ও রিস্টক এলার্ট',
    descriptionEn: 'Real-time alert report for products running out of stock',
    descriptionBn: 'স্টক কমে যাওয়া জরুরি ওষুধের রিস্টক নোটিফিকেশন',
    iconName: 'AlertTriangle',
    category: 'inventory',
    roles: ['inventory_manager', 'pharmacist', 'admin'],
  },

  // 5. System Administration Section (Admin only)
  {
    id: 'admin_analytics',
    labelEn: 'Executive Dashboard & KPIs',
    labelBn: 'সেলস এনালাইটিক্স ও ড্যাশবোর্ড',
    descriptionEn: 'Revenue charts, POS counter sales breakdown & KPI overview',
    descriptionBn: 'দৈনিক ও মাসিক আয়, অনলাইন বনাম কাউন্টার সেলস রিপোর্ট',
    iconName: 'TrendingUp',
    category: 'administration',
    roles: ['admin'],
  },
  {
    id: 'admin_users',
    labelEn: 'User Control & Block Status',
    labelBn: 'ইউজার ম্যানেজমেন্ট ও ব্লক সেটিং',
    descriptionEn: 'Manage user accounts, roles & block suspicious users',
    descriptionBn: 'ইউজার মেম্বারশিপ তালিকা, রোল অ্যাসাইন ও সেশন ব্লক সুবিধা',
    iconName: 'UserCheck',
    category: 'administration',
    roles: ['admin'],
  },
  {
    id: 'admin_coupons',
    labelEn: 'Promo Coupons & Discounts',
    labelBn: 'প্রোমো কোড ও ডিসকাউন্ট',
    descriptionEn: 'Create discount vouchers and percentage discount campaigns',
    descriptionBn: 'প্রোমো কোড তৈরি, মিনিমাম অর্ডার সীমা ও মেয়াদ নির্ধারণ',
    iconName: 'Ticket',
    category: 'administration',
    roles: ['admin'],
  },
];
