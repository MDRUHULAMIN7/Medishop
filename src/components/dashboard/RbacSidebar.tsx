'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const roleConfig = RBAC_ROLES_CONFIG[currentRole] || RBAC_ROLES_CONFIG.customer;

  const allowedMenuItems = RBAC_MENU_ITEMS.filter((item) =>
    item.roles.includes(currentRole)
  );

  const categories: {
    key: RbacMenuItem['category'];
    titleEn: string;
    titleBn: string;
  }[] = [
    { key: 'customer', titleEn: 'PATIENT ORDERS & RX', titleBn: 'অর্ডার ও প্রেসক্রিপশন' },
    { key: 'clinical', titleEn: 'PHARMACY CLINICAL AUDIT', titleBn: 'ফার্মেসী ক্লিনিকাল অডিট' },
    { key: 'sales', titleEn: 'COUNTER POS TERMINAL', titleBn: 'কাউন্টার সেলস (POS)' },
    { key: 'inventory', titleEn: 'INVENTORY & CATALOG', titleBn: 'স্টক ও প্রোডাক্ট ক্যাটালগ' },
    { key: 'administration', titleEn: 'SYSTEM ADMINISTRATION', titleBn: 'সিস্টেম এডমিন ও এনালাইটিক্স' },
  ];

  const handleMenuClick = (item: RbacMenuItem) => {
    setActiveTab(item.id);
    onCloseMobile();
    router.push(item.targetRoute);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background border-r border-border w-80 shrink-0 select-none shadow-xs">
      {/* Brand Header */}
      <div className="h-16 px-6 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-black shadow-md ring-4 ring-primary/10 group-hover:scale-105 transition-transform">
            <Pill className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif-title text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
              mediShop
            </span>
            <span className="block text-[10px] font-extrabold tracking-widest text-primary uppercase">
              {isBn ? 'ডিজিটাল পোর্টাল' : 'RBAC PORTAL'}
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

      {/* Role Badge Banner */}
      <div className="p-4 mx-4 mt-4 rounded-2xl border border-border bg-muted/40">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">
            {isBn ? 'আপনার রোল:' : 'Account Role:'}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black border ${roleConfig.badgeBg}`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {isBn ? roleConfig.titleBn : roleConfig.titleEn}
          </span>
        </div>
      </div>

      {/* Navigation Section List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {categories.map((cat) => {
          const items = allowedMenuItems.filter((item) => item.category === cat.key);
          if (items.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-2">
              <h4 className="px-3 text-xs font-black tracking-wider text-muted-foreground/80 uppercase">
                {isBn ? cat.titleBn : cat.titleEn}
              </h4>

              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.iconName] || User;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleMenuClick(item)}
                      className={`group w-full flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-primary/10 text-primary border-l-4 border-primary font-black shadow-xs'
                          : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                          }`}
                        />
                        <span className="truncate">{isBn ? item.labelBn : item.labelEn}</span>
                      </div>

                      {isActive && <ChevronRight className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
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
