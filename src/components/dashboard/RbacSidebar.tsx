'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { UserRole } from '@/types';
import { RbacTabId } from '@/config/rbac.config';

interface RbacSidebarProps {
  currentRole: UserRole;
  activeTab: RbacTabId;
  setActiveTab: (tab: RbacTabId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isBn?: boolean;
}

export function RbacSidebar({
  currentRole,
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  isBn = true,
}: RbacSidebarProps) {
  const router = useRouter();

  // Category Accordion Expanded States
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    catalog: true,
    clinical: true,
    sales: true,
    marketing: false,
    analytics: false,
    system: false,
  });

  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubItemClick = (tab: string, targetPath?: string) => {
    setActiveTab(tab as RbacTabId);
    onCloseMobile();
    if (targetPath) {
      router.push(targetPath);
    } else {
      router.push(`/dashboard/admin?tab=${tab}`);
    }
  };

  const CATEGORIES = [
    {
      key: 'catalog',
      titleBn: 'ফার্মা ক্যাটালগ ও স্টক',
      titleEn: 'Pharma Catalog & Stock',
      icon: Package,
      items: [
        { id: 'products', labelBn: 'ওষুধ ও পণ্য ক্যাটালগ', labelEn: 'Medicine Catalog', icon: Pill },
        { id: 'categories', labelBn: 'ফার্মেসি ক্যাটাগরি', labelEn: 'Pharmacy Categories', icon: FolderTree },
        { id: 'brands', labelBn: 'ফার্মাসিউটিক্যালস ব্র্যান্ডস', labelEn: 'Pharma Brands (DGDA)', icon: Building2 },
        { id: 'inventory', labelBn: 'শেয়ার্ড ইনভেন্টরি ও ব্যাচ', labelEn: 'Inventory & Batches', icon: Boxes, targetPath: '/dashboard/inventory' },
        { id: 'ledger', labelBn: 'অডিট লেজার ট্রেইল', labelEn: 'Stock Audit Ledger', icon: History },
      ],
    },
    {
      key: 'clinical',
      titleBn: 'ক্লিনিক্যাল ও পিওএস সেলস',
      titleEn: 'Clinical & POS Operations',
      icon: Stethoscope,
      items: [
        { id: 'pos_sales', labelBn: 'কাউন্টার পজ বিক্রয় (POS)', labelEn: 'In-Store POS Terminal', icon: Store, targetPath: '/dashboard/sales', color: 'bg-emerald-600' },
        { id: 'prescriptions', labelBn: 'প্রেসক্রিপশন অডিট কিউ', labelEn: 'Prescription Queue', icon: FileCheck2, color: 'bg-amber-600' },
      ],
    },
    {
      key: 'sales',
      titleBn: 'সেলস ও কাস্টমার ডিরেক্টরি',
      titleEn: 'Orders & Customers',
      icon: ShoppingBag,
      items: [
        { id: 'orders', labelBn: 'সকল কাস্টমার অর্ডার', labelEn: 'Customer Orders', icon: ShoppingBag },
        { id: 'users', labelBn: 'লাইভ কাস্টমার ডিরেক্টরি', labelEn: 'User Directory (Live DB)', icon: Users },
      ],
    },
    {
      key: 'marketing',
      titleBn: 'মার্কেটিং ও অফার প্রমোশন',
      titleEn: 'Marketing & Offers',
      icon: Megaphone,
      items: [
        { id: 'coupons', labelBn: 'ডিসকাউন্ট কুপন ও কোড', labelEn: 'Coupons & Promo Codes', icon: Ticket },
        { id: 'banners', labelBn: 'হিরো ব্যানার ও স্লাইডার', labelEn: 'Hero Banner Slider', icon: ImageIcon },
        { id: 'reviews', labelBn: 'রিভিউ ও রেটিং মোডারেশন', labelEn: 'Reviews & Rating', icon: Star },
      ],
    },
    {
      key: 'analytics',
      titleBn: 'রিপোর্টস ও বিজনেস ফাইন্যান্স',
      titleEn: 'Reports & Analytics',
      icon: BarChart3,
      items: [
        { id: 'reports', labelBn: 'সেলস ও সম্পদ ভ্যালুয়েশন', labelEn: 'Reports & Valuation', icon: BarChart3 },
      ],
    },
    {
      key: 'system',
      titleBn: 'সিস্টেম ও স্টাফ পারমিশন',
      titleEn: 'System Control & RBAC',
      icon: ShieldCheck,
      items: [
        { id: 'staff', labelBn: 'স্টাফ অ্যাকাউন্ট ও রোলস (RBAC)', labelEn: 'Staff & Roles (RBAC)', icon: ShieldCheck },
        { id: 'settings', labelBn: 'সাইট সেটিংস ও ব্র্যান্ডিং', labelEn: 'Site Settings & Dynamic Branding', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background border-r border-border w-80 shrink-0 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md transition-transform group-hover:scale-105 shrink-0">
            <Pill className="h-5 w-5" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-serif-title text-2xl font-extrabold tracking-tight text-primary leading-none">
              mediShop
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
              {isBn ? 'ফার্মেসি এডমিন প্যানেল v2.0' : 'Pharmacy Admin Panel'}
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {/* Top Overview Button */}
        <button
          type="button"
          onClick={() => handleSubItemClick('overview')}
          className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-primary text-white font-black shadow-md'
              : 'bg-muted/40 text-foreground hover:bg-muted/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
            <span>{isBn ? 'ওভারভিউ ও অ্যানালিটিক্স' : 'Overview & Analytics'}</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
            Live
          </span>
        </button>

        {/* Accordion Categories */}
        {CATEGORIES.map((cat) => {
          const CatIcon = cat.icon;
          const isExpanded = !!expandedCategories[cat.key];
          const hasActiveItem = cat.items.some((it) => it.id === activeTab);

          return (
            <div key={cat.key} className="space-y-1">
              <button
                type="button"
                onClick={() => toggleCategory(cat.key)}
                className={`group w-full flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                  hasActiveItem
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-muted/20 text-foreground hover:bg-muted/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CatIcon className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
                  <span className="font-black">
                    {isBn ? cat.titleBn : cat.titleEn}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                >
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </motion.div>
              </button>

              {/* Collapsible Sub Items with Framer Motion */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden pl-3 pr-1 pt-1 space-y-1"
                  >
                    {cat.items.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isActive = activeTab === subItem.id;

                      return (
                        <button
                          key={subItem.id}
                          type="button"
                          onClick={() => handleSubItemClick(subItem.id, subItem.targetPath)}
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
        <p className="text-xs font-bold text-foreground">mediShop Healthcare BD</p>
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

      {/* Mobile Drawer Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex h-full w-80 max-w-[85vw]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
