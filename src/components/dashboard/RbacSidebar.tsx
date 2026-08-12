'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tags,
  Pill,
  X,
  ChevronDown,
  FolderTree,
  Building2,
  Package,
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
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  isBn = true,
}: RbacSidebarProps) {
  const router = useRouter();
  const [isCatalogExpanded, setIsCatalogExpanded] = useState(true);

  const handleSubItemClick = (tab: 'products' | 'categories' | 'brands') => {
    setActiveTab(tab as RbacTabId);
    onCloseMobile();
    router.push(`/dashboard/admin?tab=${tab}&page=1`);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background border-r border-border w-80 shrink-0 select-none shadow-xs">
      {/* Brand Header: Perfectly aligned h-16 (64px) height matching RbacHeader */}
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
              {isBn ? 'অনলাইন ফার্মেসি ও হেলথকেয়ার' : 'Online Pharmacy BD'}
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
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {/* Accordion Parent Item: Categories, Brands & Products */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setIsCatalogExpanded(!isCatalogExpanded)}
            className="group w-full flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-bold bg-primary/10 text-primary transition-all cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <Tags className="h-5 w-5 text-primary shrink-0 transition-transform group-hover:scale-110" />
              <span className="font-black">
                {isBn ? 'ফার্মাসিউটিক্যালস ক্যাটালগ' : 'Pharma Inventory'}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isCatalogExpanded ? 180 : 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-4 w-4 text-primary shrink-0" />
            </motion.div>
          </button>

          {/* Smooth Rich Animated Collapsible Sub-Buttons */}
          <AnimatePresence initial={false}>
            {isCatalogExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden pl-4 pr-1 pt-1.5 space-y-1.5"
              >
                {/* Sub-Button 1: Medicine Products Catalog */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('products')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-primary text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Package className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'ওষুধ ও পণ্য ক্যাটালগ' : 'Medicine Catalog'}</span>
                </button>

                {/* Sub-Button 2: Pharmacy Categories */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('categories')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'categories' || activeTab === 'inventory_categories'
                      ? 'bg-primary text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <FolderTree className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'ফার্মেসি ক্যাটাগরি' : 'Pharmacy Categories'}</span>
                </button>

                {/* Sub-Button 3: Pharma Brands (DGDA) */}
                <button
                  type="button"
                  onClick={() => handleSubItemClick('brands')}
                  className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'brands'
                      ? 'bg-primary text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span>{isBn ? 'ফার্মাসিউটিক্যালস ব্র্যান্ডস (DGDA)' : 'Pharma Brands (DGDA)'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
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
