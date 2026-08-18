'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useBranding } from '@/context/BrandingContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Tags,
  Pill,
  X,
  ChevronDown,
  FolderTree,
  Building2,
  Package,
  Ticket,
  Store,
  Boxes,
  FileCheck2,
  ShoppingBag,
  Users,
  Image as ImageIcon,
  Star,
  BarChart3,
  ShieldCheck,
  Settings,
  History,
  Stethoscope,
  Megaphone,
  MessageSquare,
} from 'lucide-react';
import { UserRole } from '@/types';
import { RbacTabId, RBAC_ROLES_CONFIG } from '@/config/rbac.config';

interface RbacSidebarProps {
  currentRole: UserRole;
  activeTab: RbacTabId;
  setActiveTab: (tab: RbacTabId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isBn?: boolean;
}

const ROLE_ALLOWED_TABS: Record<UserRole, RbacTabId[]> = {
  admin: [
    'overview', 'products', 'categories', 'brands', 'inventory', 'ledger',
    'pos_sales', 'prescriptions', 'orders', 'chat', 'users',
    'coupons', 'banners', 'reviews', 'reports', 'staff', 'settings'
  ],
  super_admin: [
    'overview', 'products', 'categories', 'brands', 'inventory', 'ledger',
    'pos_sales', 'prescriptions', 'orders', 'chat', 'users',
    'coupons', 'banners', 'reviews', 'reports', 'staff', 'settings'
  ],
  pharmacist: [
    'overview', 'prescriptions', 'pos_sales', 'products', 'categories',
    'brands', 'inventory', 'orders', 'chat'
  ],
  pharmacist_verifier: [
    'overview', 'prescriptions', 'orders', 'chat'
  ],
  sales_staff: [
    'overview', 'pos_sales', 'orders', 'chat', 'products'
  ],
  order_manager: [
    'overview', 'orders', 'chat', 'users', 'prescriptions', 'pos_sales'
  ],
  inventory_manager: [
    'overview', 'products', 'categories', 'brands', 'inventory', 'ledger', 'reports'
  ],
  marketing_editor: [
    'overview', 'coupons', 'banners', 'reviews'
  ],
  customer: [],
};

export function RbacSidebar({
  currentRole,
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  isBn = true,
}: RbacSidebarProps) {
  const router = useRouter();
  const { settings } = useBranding();
  const siteName = settings.general?.siteName || 'mediShop';
  const roleConfig = RBAC_ROLES_CONFIG[currentRole] || RBAC_ROLES_CONFIG.admin;

  // Category Accordion Expanded States
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    catalog: true,
    clinical: true,
    sales: true,
    marketing: true,
    analytics: true,
    system: true,
  });

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubItemClick = (tab: string) => {
    setActiveTab(tab as RbacTabId);
    onCloseMobile();

    if (currentRole === 'sales_staff') {
      router.push(`/dashboard/sales?tab=${tab}`);
    } else if (currentRole === 'inventory_manager') {
      router.push(`/dashboard/inventory?tab=${tab}`);
    } else if (currentRole === 'pharmacist' || currentRole === 'pharmacist_verifier') {
      router.push(`/dashboard/pharmacist?tab=${tab}`);
    } else {
      router.push(`/dashboard/admin?tab=${tab}`);
    }
  };

  const CATEGORIES = [
    {
      key: 'catalog',
      titleBn: 'ওষুধ ক্যাটালগ ও ইনভেন্টরি',
      titleEn: 'Pharma Catalog & Stock',
      icon: Package,
      items: [
        { id: 'products', labelBn: 'সকল ওষুধ ও প্রোডাক্টস', labelEn: 'Medicine & Product Catalog', icon: Pill },
        { id: 'categories', labelBn: 'চিকিৎসা ও ওষুধ ক্যাটাগরি', labelEn: 'Pharmacy Categories', icon: FolderTree },
        { id: 'brands', labelBn: 'ডিজিডিএ নিবন্ধিত ব্রান্ডস', labelEn: 'DGDA Pharma Brands', icon: Building2 },
        { id: 'inventory', labelBn: 'ইনভেন্টরি ও ব্যাচ ট্র্যাকিং', labelEn: 'Inventory & Batches', icon: Boxes },
        { id: 'ledger', labelBn: 'স্টক মুভমেন্ট অডিট লেজার', labelEn: 'Stock Audit Ledger', icon: History },
      ],
    },
    {
      key: 'clinical',
      titleBn: 'ক্লিনিক্যাল সার্ভিসেস ও পিওএস',
      titleEn: 'Clinical Services & POS',
      icon: Stethoscope,
      items: [
        { id: 'pos_sales', labelBn: 'ইন-স্টোর পিওএস কাউন্টার', labelEn: 'In-Store POS Terminal', icon: Store, color: 'bg-emerald-600' },
        { id: 'prescriptions', labelBn: 'প্রেসক্রিপশন ভেরিফিকেশন কিউ', labelEn: 'Pharmacist Rx Verification', icon: FileCheck2, color: 'bg-amber-600' },
      ],
    },
    {
      key: 'sales',
      titleBn: 'কাস্টমার অর্ডার ও একাউন্টস',
      titleEn: 'Orders & Customer Directory',
      icon: ShoppingBag,
      items: [
        { id: 'orders', labelBn: 'অনলাইন কাস্টমার অর্ডারসমূহ', labelEn: 'Customer Orders', icon: ShoppingBag },
        { id: 'chat', labelBn: 'লাইভ ফার্মাসিস্ট চ্যাট', labelEn: 'Live Chat Support Center', icon: MessageSquare },
        { id: 'users', labelBn: 'নিবন্ধিত কাস্টমার ডিরেক্টরি', labelEn: 'Customer Accounts Directory', icon: Users },
      ],
    },
    {
      key: 'marketing',
      titleBn: 'মার্কেটিং, কুপন ও স্লাইডার',
      titleEn: 'Marketing & Hero Sliders',
      icon: Megaphone,
      items: [
        { id: 'coupons', labelBn: 'প্রমোশনাল কুপন ও ডিসকাউন্ট', labelEn: 'Coupons & Promo Codes', icon: Ticket },
        { id: 'banners', labelBn: 'হোমপেজ লাইভ ব্যানার স্লাইডার', labelEn: 'Homepage Hero Slider', icon: ImageIcon },
        { id: 'reviews', labelBn: 'কাস্টমার রিভিউ মোডারেশন', labelEn: 'Product Reviews & Ratings', icon: Star },
      ],
    },
    {
      key: 'analytics',
      titleBn: 'ব্যবসা এ্যানালিটিক্স ও রিপোর্ট',
      titleEn: 'Business Reports & Finance',
      icon: BarChart3,
      items: [
        { id: 'reports', labelBn: 'সেলস রিপোর্ট ও সম্পদ ভ্যালু', labelEn: 'Sales & Asset Valuation', icon: BarChart3 },
      ],
    },
    {
      key: 'system',
      titleBn: 'সাইট ব্র্যান্ডিং ও এক্সেস কন্ট্রোল',
      titleEn: 'Branding & Access Control',
      icon: ShieldCheck,
      items: [
        { id: 'staff', labelBn: 'ফার্মেসি স্টাফ ও পারমিশন ম্যাট্রিক্স', labelEn: 'Staff & Access Roles', icon: ShieldCheck },
        { id: 'settings', labelBn: 'সাইট ব্র্যান্ডিং ও গ্লোবাল সেটিংস', labelEn: 'Site Branding & Dynamic Settings', icon: Settings },
      ],
    },
  ];

  const allowedTabs = ROLE_ALLOWED_TABS[currentRole] || ROLE_ALLOWED_TABS.admin;

  const filteredCategories = CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => allowedTabs.includes(item.id as RbacTabId)),
  })).filter((cat) => cat.items.length > 0);

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background border-r border-border w-80 shrink-0 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          {settings.general?.logoLight &&
          settings.general.logoLight !== '/images/logo.png' &&
          settings.general.logoLight.trim() !== '' ? (
            <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-md transition-transform group-hover:scale-105 shrink-0 border border-primary/20 bg-white">
              <Image
                src={settings.general.logoLight}
                alt={siteName}
                fill
                sizes="36px"
                className="object-contain p-0.5"
              />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md transition-transform group-hover:scale-105 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <span className="font-serif-title text-xl font-extrabold tracking-tight text-primary leading-none">
              {siteName}
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
              {isBn ? roleConfig.titleBn : roleConfig.titleEn}
            </span>
          </div>
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Accordion Categories Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
        {filteredCategories.map((cat) => {
          const CatIcon = cat.icon;
          const isExpanded = expandedCategories[cat.key] ?? true;

          return (
            <div key={cat.key} className="space-y-1">
              {/* Category Accordion Header */}
              <button
                type="button"
                onClick={() => toggleCategory(cat.key)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <CatIcon className="h-4 w-4 text-primary shrink-0" />
                  <span className="uppercase tracking-wider text-[11px] font-black text-foreground">
                    {isBn ? cat.titleBn : cat.titleEn}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                </motion.div>
              </button>

              {/* Collapsible Sub Items with Framer Motion */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden pl-3 pr-1 pt-1 space-y-1"
                  >
                    {cat.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isActive = activeTab === subItem.id;

                      return (
                        <button
                          key={subItem.id}
                          type="button"
                          onClick={() => handleSubItemClick(subItem.id)}
                          className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? `${(subItem as any).color || 'bg-primary'} text-white font-black shadow-md`
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <SubIcon className="h-4 w-4 shrink-0" />
                          <span>{isBn ? subItem.labelBn : subItem.labelEn}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border bg-muted/20 text-center shrink-0">
        <p className="text-xs font-bold text-foreground">{siteName} BD</p>
        <p className="text-[11px] text-muted-foreground">DGDA License #10294 • Version 2.0</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar with Smooth Slide-in Spring Animation */}
      <AnimatePresence>
        {isOpenMobile && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={onCloseMobile}
              aria-hidden="true"
            />

            {/* Sliding Drawer Container */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="relative z-10 flex h-full w-80 max-w-[85vw]"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
