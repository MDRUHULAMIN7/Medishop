'use client';

import React from 'react';
import Link from 'next/link';
import {
  User,
  MapPin,
  PackageCheck,
  FileText,
  ClipboardCheck,
  ShoppingBag,
  Boxes,
  Tags,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Ticket,
  Pill,
  X,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { UserRole } from '@/types';
import {
  RBAC_MENU_ITEMS,
  RBAC_ROLES_CONFIG,
  RbacTabId,
  RbacMenuItem,
} from '@/config/rbac.config';

interface RbacSidebarProps {
  currentRole: UserRole;
  activeTab: RbacTabId;
  setActiveTab: (tab: RbacTabId) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isBn?: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  User,
  MapPin,
  PackageCheck,
  FileText,
  ClipboardCheck,
  ShoppingBag,
  Boxes,
  Tags,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  Ticket,
};

export function RbacSidebar({
  currentRole,
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  isBn = true,
}: RbacSidebarProps) {
  const roleConfig = RBAC_ROLES_CONFIG[currentRole] || RBAC_ROLES_CONFIG.customer;

  // Filter menu items allowed for the current role
  const allowedMenuItems = RBAC_MENU_ITEMS.filter((item) =>
    item.roles.includes(currentRole)
  );

  // Group menu items by category
  const categories: {
    key: RbacMenuItem['category'];
    titleEn: string;
    titleBn: string;
  }[] = [
    { key: 'personal', titleEn: 'PERSONAL PROFILE', titleBn: 'প্রোফাইল ও ঠিকানা' },
    { key: 'clinical', titleEn: 'PHARMACY CLINICAL', titleBn: 'ফার্মেসী অডিট' },
    { key: 'sales', titleEn: 'COUNTER SALES & POS', titleBn: 'কাউন্টার পিওএস' },
    { key: 'inventory', titleEn: 'INVENTORY & STOCK', titleBn: 'স্টক ও ক্যাটালগ' },
    { key: 'administration', titleEn: 'SUPER ADMINISTRATION', titleBn: 'সিস্টেম এডমিন' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background border-r border-border w-72 shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-extrabold shadow-sm ring-2 ring-primary/20">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif-title text-xl font-black tracking-tight text-foreground">
              mediShop
            </span>
            <span className="block text-[10px] font-extrabold tracking-widest text-primary uppercase">
              {isBn ? 'ডিজিটাল ড্যাশবোর্ড' : 'RBAC PORTAL'}
            </span>
          </div>
        </Link>

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Role Badge Banner */}
      <div className="p-4 mx-4 mt-4 rounded-2xl border border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground">
            {isBn ? 'আপনার এক্সেস রোল' : 'Active Account Role'}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black border ${roleConfig.badgeBg}`}
          >
            <ShieldCheck className="h-3 w-3" />
            {isBn ? roleConfig.titleBn : roleConfig.titleEn}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
          {isBn ? roleConfig.descriptionBn : roleConfig.descriptionEn}
        </p>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {categories.map((cat) => {
          const items = allowedMenuItems.filter((item) => item.category === cat.key);
          if (items.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-1">
              <h4 className="px-3 text-[10px] font-black tracking-wider text-muted-foreground/80 uppercase">
                {isBn ? cat.titleBn : cat.titleEn}
              </h4>

              <div className="space-y-1 pt-1">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.iconName] || User;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        onCloseMobile();
                      }}
                      className={`group w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary text-white shadow-md shadow-primary/20'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-white' : 'text-primary'
                          }`}
                        />
                        <span className="truncate">{isBn ? item.labelBn : item.labelEn}</span>
                      </div>

                      {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/80 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-border bg-muted/20 text-center">
        <p className="text-[11px] font-bold text-foreground">MediShop Pharmacy System</p>
        <p className="text-[10px] text-muted-foreground">DGDA Verified License #10294</p>
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
          <div className="relative z-10 flex h-full w-72 max-w-[80vw]">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
