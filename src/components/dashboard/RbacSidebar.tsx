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
  const [isCatalogExpanded, setIsCatalogExpanded] = useState(true);

  const handleSubItemClick = (tab: string, targetPath?: string) => {
    setActiveTab(tab as RbacTabId);
    onCloseMobile();
    if (targetPath) {
      router.push(targetPath);
    } else {
      router.push(`/dashboard/admin?tab=${tab}`);
    }
  };

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
              {isBn ? 'এডমিন প্যানেল v2.0' : 'Pharmacy Admin Panel'}
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

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* 1. Overview */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleSubItemClick('overview')}
            className={`w-full flex items-center gap-3 rounded-2xl px-3.5 py-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-foreground hover:bg-muted/70'
            }`}
          >
            <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
            <span>{isBn ? 'ওভারভিউ ও অ্যানালিটিক্স' : 'Overview & Analytics'}</span>
          </button>
        </div>

        {/* 2. Accordion Parent Item: Pharma Operations */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setIsCatalogExpanded(!isCatalogExpanded)}
            className="group w-full flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-bold bg-primary/10 text-primary transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <Tags className="h-4.5 w-4.5 text-primary shrink-0 transition-transform group-hover:scale-110" />
              <span className="font-black">
                {isBn ? 'ফার্মাসিউটিক্যালস অপারেশন্স' : 'Pharma Operations'}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isCatalogExpanded ? 180 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-4 w-4 text-primary shrink-0" />
            </motion.div>
          </button>

          {/* Sub-Buttons */}
          <AnimatePresence initial={false}>
            {isCatalogExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden pl-3 pr-1 pt-1 space-y-1"
              >
                {/* POS Sales Counter */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('pos_sales', '/dashboard/sales')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'pos_sales'
                      ? 'bg-emerald-600 text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Store className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'কাউন্টার পজ বিক্রয় (POS)' : 'In-Store POS Terminal'}</span>
                </button>

                {/* Shared Central Inventory */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('inventory', '/dashboard/inventory')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'inventory'
                      ? 'bg-indigo-600 text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Boxes className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'শেয়ার্ড ইনভেন্টরি ও ব্যাচ' : 'Inventory & Batches'}</span>
                </button>

                {/* Stock Audit Ledger */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('ledger')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'ledger'
                      ? 'bg-purple-600 text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <History className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'অডিট লেজার ট্রেইল' : 'Stock Audit Ledger'}</span>
                </button>

                {/* Prescription Audit Queue */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('prescriptions')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'prescriptions'
                      ? 'bg-amber-600 text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <FileCheck2 className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>{isBn ? 'প্রেসক্রিপশন অডিট কিউ' : 'Prescription Queue'}</span>
                </button>

                {/* Medicine Products Catalog */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('products')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-primary text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Package className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'ওষুধ ও পণ্য ক্যাটালগ' : 'Medicine Catalog'}</span>
                </button>

                {/* Pharmacy Categories */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('categories')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'categories' || activeTab === 'inventory_categories'
                      ? 'bg-primary text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <FolderTree className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'ফার্মেসি ক্যাটাগরি' : 'Pharmacy Categories'}</span>
                </button>

                {/* Pharma Brands (DGDA) */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('brands')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'brands'
                      ? 'bg-primary text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'ফার্মাসিউটিক্যালস ব্র্যান্ডস' : 'Pharma Brands'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. Section: Orders & Customers */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
            {isBn ? 'অর্ডার ও কাস্টমার' : 'Orders & Customers'}
          </span>

          <button
            type="button"
            onClick={() => handleSubItemClick('orders')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ShoppingBag className="h-4 w-4 shrink-0" />
            <span>{isBn ? 'সকল কাস্টমার অর্ডার' : 'Customer Orders'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubItemClick('users')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Users className="h-4 w-4 shrink-0" />
            <span>{isBn ? 'কাস্টমার ডিরেক্টরি' : 'Customer Directory'}</span>
          </button>
        </div>

        {/* 4. Section: Marketing & Reviews */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
            {isBn ? 'মার্কেটিং ও প্রমোশন' : 'Marketing & Offers'}
          </span>

          <button
            type="button"
            onClick={() => handleSubItemClick('coupons')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Ticket className="h-4 w-4 shrink-0" />
            <span>{isBn ? 'ডিসকাউন্ট কুপন ও কোড' : 'Coupons & Promo Codes'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubItemClick('banners')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ImageIcon className="h-4 w-4 shrink-0" />
            <span>{isBn ? 'ব্যানার ও স্লাইডার' : 'Hero Banners'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubItemClick('reviews')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Star className="h-4 w-4 shrink-0" />
            <span>{isBn ? 'রিভিউ ও রেটিং' : 'Reviews & Rating'}</span>
          </button>
        </div>

        {/* 5. Section: Reports & Analytics */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
            {isBn ? 'রিপোর্টস ও বিজনেস এ্যানালিটিক্স' : 'Analytics & Finance'}
          </span>

          <button
            type="button"
            onClick={() => handleSubItemClick('reports')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            <span>{isBn ? 'সেলস ও সম্পদ ভ্যালুয়েশন' : 'Reports & Valuation'}</span>
          </button>
        </div>

        {/* 6. Section: System & Settings */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground block">
            {isBn ? 'সিস্টেম ও স্টাফ পারমিশন' : 'System Control & RBAC'}
          </span>

          <button
            type="button"
            onClick={() => handleSubItemClick('staff')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{isBn ? 'স্টাফ অ্যাকাউন্ট ও রোলস (RBAC)' : 'Staff & Roles RBAC'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSubItemClick('settings')}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-primary text-white font-black shadow-md'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            <span>{isBn ? 'সাইট সেটিংস ও ব্র্যান্ডিং' : 'Site Settings & Dynamic Branding'}</span>
          </button>
        </div>
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
