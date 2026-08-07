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
  | 'admin_analytics'
  | 'admin_users'
  | 'admin_coupons'
  | 'prescriptions_audit'
  | 'pos_sales'
  | 'inventory_products'
  | 'inventory_categories'
  | 'inventory_low_stock'
  | 'orders_customer'
  | 'prescriptions_customer';

export interface RbacMenuItem {
  id: RbacTabId;
  labelEn: string;
  labelBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  iconName: string;
  category: 'clinical' | 'sales' | 'inventory' | 'administration' | 'customer';
  roles: UserRole[];
  badgeCount?: number;
}

export const RBAC_ROLES_CONFIG: Record<UserRole, RbacRoleInfo> = {
  admin: {
    role: 'admin',
    route: '/dashboard/admin',
    titleEn: 'Super Administrator',
    titleBn: 'সিস্টেম এডমিন',
    descriptionEn: 'Full system control, sales analytics, user status block & coupons',
    descriptionBn: 'সম্পূর্ণ সিস্টেম একসেস, সেলস এনালাইটিক্স, ইউজার ব্লক ও কুপন',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    iconName: 'ShieldAlert',
  },
  pharmacist: {
    role: 'pharmacist',
    route: '/dashboard/pharmacist',
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
    route: '/dashboard/sales',
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
    route: '/dashboard/inventory',
    titleEn: 'Inventory Manager',
    titleBn: 'ইনভেন্টরি ম্যানেজার',
    descriptionEn: 'Manage stock levels, batch expiry dates, categories & brands',
    descriptionBn: 'মেডিসিন স্টক ট্র্যাকিং, ব্যাচ মেয়াদ, ক্যাটাগরি ও ব্র্যান্ড',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    iconName: 'Package',
  },
  customer: {
    role: 'customer',
    route: '/dashboard/customer',
    titleEn: 'Customer / Patient',
    titleBn: 'গ্রাহক / পেশেন্ট',
    descriptionEn: 'Track placed orders, prescriptions, and health history',
    descriptionBn: 'অর্ডারের ট্র্যাকিং, আপলোড করা প্রেসক্রিপশন ও হিস্ট্রি',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    iconName: 'User',
  },
};

export const RBAC_MENU_ITEMS: RbacMenuItem[] = [
  // 1. Clinical Section (Pharmacist & Admin)
  {
    id: 'prescriptions_audit',
    labelEn: 'Rx Audit & Verification',
    labelBn: 'প্রেসক্রিপশন অডিট ও অনুমোদন',
    descriptionEn: 'Review patient uploaded prescriptions, verify OTC & approve',
    descriptionBn: 'পেশেন্টের আপলোড করা প্রেসক্রিপশন রিভিউ ও ভেরিফিকেশন',
    iconName: 'ClipboardCheck',
    category: 'clinical',
    roles: ['pharmacist', 'admin'],
  },

  // 2. Counter POS Section (Sales Staff, Pharmacist & Admin)
  {
    id: 'pos_sales',
    labelEn: 'Counter POS Terminal',
    labelBn: 'কাউন্টার সেলস (POS)',
    descriptionEn: 'In-store fast medicine billing, barcode scanner & receipts',
    descriptionBn: 'ফার্মেসী ক্যাশ কাউন্টার বিলিং ও মেমো রিসিপ্ট প্রিন্টিং',
    iconName: 'ShoppingBag',
    category: 'sales',
    roles: ['sales_staff', 'pharmacist', 'admin'],
  },

  // 3. Inventory Section (Inventory Manager & Admin)
  {
    id: 'inventory_products',
    labelEn: 'Medicine Catalog',
    labelBn: 'মেডিসিন ক্যাটালগ ও স্টক',
    descriptionEn: 'Manage product listings, pricing, strip sizes & stock count',
    descriptionBn: 'মেডিসিন প্রাইজ, স্ট্রিপ সাইজ ও ডাটাবেজ ক্যাটালগ',
    iconName: 'Boxes',
    category: 'inventory',
    roles: ['inventory_manager', 'admin'],
  },
  {
    id: 'inventory_categories',
    labelEn: 'Categories & Brands',
    labelBn: 'ক্যাটাগরি ও ব্র্যান্ডস',
    descriptionEn: 'Manage category tree and pharma manufacturer brand profiles',
    descriptionBn: 'ঔষধের শ্রেণীবিভাগ ও ম্যানুফ্যাকচারার ব্র্যান্ডস',
    iconName: 'Tags',
    category: 'inventory',
    roles: ['inventory_manager', 'admin'],
  },
  {
    id: 'inventory_low_stock',
    labelEn: 'Low Stock Alerts',
    labelBn: 'স্টক শর্টেজ রিস্টক এলার্ট',
    descriptionEn: 'Real-time alert report for products running out of stock',
    descriptionBn: 'স্টক কমে যাওয়া জরুরি ওষুধের রিস্টক নোটিফিকেশন',
    iconName: 'AlertTriangle',
    category: 'inventory',
    roles: ['inventory_manager', 'pharmacist', 'admin'],
  },

  // 4. Administration Section (Admin only)
  {
    id: 'admin_analytics',
    labelEn: 'Sales & Revenue KPIs',
    labelBn: 'সেলস এনালাইটিক্স ড্যাশবোর্ড',
    descriptionEn: 'Revenue charts, POS counter sales breakdown & KPI overview',
    descriptionBn: 'দৈনিক ও মাসিক আয়, অনলাইন বনাম কাউন্টার সেলস রিপোর্ট',
    iconName: 'TrendingUp',
    category: 'administration',
    roles: ['admin'],
  },
  {
    id: 'admin_users',
    labelEn: 'User Control & Block',
    labelBn: 'ইউজার মেম্বারশিপ ও ব্লক সেটিং',
    descriptionEn: 'Manage user accounts, roles & block suspicious users',
    descriptionBn: 'ইউজার তালিকা, রোল অ্যাসাইন ও সেশন ব্লক সুবিধা',
    iconName: 'UserCheck',
    category: 'administration',
    roles: ['admin'],
  },
  {
    id: 'admin_coupons',
    labelEn: 'Promo Coupons',
    labelBn: 'প্রোমো কোড ও কুপন',
    descriptionEn: 'Create discount vouchers and percentage discount campaigns',
    descriptionBn: 'প্রোমো কোড তৈরি, মিনিমাম অর্ডার সীমা ও ডিসকাউন্ট',
    iconName: 'Ticket',
    category: 'administration',
    roles: ['admin'],
  },

  // 5. Customer Section (Customer & Admin)
  {
    id: 'orders_customer',
    labelEn: 'My Order History',
    labelBn: 'আমার অর্ডার হিস্ট্রি',
    descriptionEn: 'Track online medicine orders, delivery status and invoices',
    descriptionBn: 'অর্ডারের লাইভ স্টেটাস, ট্র্যাকিং ও ট্যাক্স ইনভয়েস',
    iconName: 'PackageCheck',
    category: 'customer',
    roles: ['customer', 'admin'],
  },
  {
    id: 'prescriptions_customer',
    labelEn: 'My Prescriptions',
    labelBn: 'আমার প্রেসক্রিপশন ফাইলস',
    descriptionEn: 'Uploaded doctor prescription records',
    descriptionBn: 'প্রেসক্রিপশন ফাইলস ও স্বাস্থ্য সংক্রান্ত তথ্য',
    iconName: 'FileText',
    category: 'customer',
    roles: ['customer', 'admin'],
  },
];
