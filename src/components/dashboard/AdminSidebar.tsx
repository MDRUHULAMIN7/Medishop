'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useBranding } from '@/context/BrandingContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Building2,
  Image as ImageIcon,
  ShoppingBag,
  CreditCard,
  Star,
  Headphones,
  Users,
  Settings,
  Pill,
  ChevronRight,
  Boxes,
  Store,
  X,
  FileText,
  Tag,
  BarChart3,
  ShieldCheck,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';

export type DashboardTab =
  | 'overview'
  | 'products'
  | 'inventory'
  | 'ledger'
  | 'pos_sales'
  | 'categories'
  | 'brands'
  | 'banners'
  | 'coupons'
  | 'orders'
  | 'prescriptions'
  | 'payments'
  | 'reviews'
  | 'reports'
  | 'staff'
  | 'support'
  | 'users'
  | 'settings';

interface AdminSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const { settings } = useBranding();
  const siteName = settings.general?.siteName || 'mediShop';
  const user = useAppSelector((state) => state.auth.user);

  const menuItems = [
    {
      id: 'overview' as DashboardTab,
      labelBn: 'ওভারভিউ ও অ্যানালিটিক্স',
      labelEn: 'Overview & Stats',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'pos_sales' as DashboardTab,
      labelBn: 'কাউন্টার সেলস টার্মিনাল (POS)',
      labelEn: 'In-Store POS Terminal',
      icon: Store,
      badge: 'POS',
      badgeColor: 'bg-emerald-600 text-white font-bold',
    },
    {
      id: 'inventory' as DashboardTab,
      labelBn: 'ইনভেন্টরি ও ব্যাচ ট্র্যাকিং',
      labelEn: 'Inventory & Batches',
      icon: Boxes,
    },
    {
      id: 'ledger' as DashboardTab,
      labelBn: 'স্টক মুভমেন্ট অডিট লেজার',
      labelEn: 'Stock Audit Ledger',
      icon: History,
    },
    {
      id: 'products' as DashboardTab,
      labelBn: 'ওষুধ ও প্রডাক্ট ক্যাটালগ',
      labelEn: 'Medicine & Products',
      icon: Package,
    },
    {
      id: 'categories' as DashboardTab,
      labelBn: 'ক্যাটাগরি ম্যানেজমেন্ট',
      labelEn: 'Categories',
      icon: FolderTree,
    },
    {
      id: 'brands' as DashboardTab,
      labelBn: 'ফার্মা ব্র্যান্ডস',
      labelEn: 'Pharma Brands',
      icon: Building2,
    },
    {
      id: 'prescriptions' as DashboardTab,
      labelBn: 'প্রেসক্রিপশন ভেরিফিকেশন কিউ',
      labelEn: 'Prescription Queue',
      icon: FileText,
      badge: 'Rx',
      badgeColor: 'bg-amber-500 text-white font-bold',
    },
    {
      id: 'orders' as DashboardTab,
      labelBn: 'অর্ডার ও ডেলিভারি',
      labelEn: 'Orders & Logistics',
      icon: ShoppingBag,
    },
    {
      id: 'coupons' as DashboardTab,
      labelBn: 'কুপন ম্যানেজমেন্ট',
      labelEn: 'Coupons & Offers',
      icon: Tag,
    },
    {
      id: 'banners' as DashboardTab,
      labelBn: 'ব্যানার ও স্লাইডার',
      labelEn: 'Banners & Hero',
      icon: ImageIcon,
    },
    {
      id: 'reviews' as DashboardTab,
      labelBn: 'রিভিউ ও রেটিং',
      labelEn: 'Reviews & Rating',
      icon: Star,
    },
    {
      id: 'reports' as DashboardTab,
      labelBn: 'রিপোর্টস ও এ্যানালিটিক্স',
      labelEn: 'Reports & Analytics',
      icon: BarChart3,
    },
    {
      id: 'staff' as DashboardTab,
      labelBn: 'স্টাফ ও পারমিশন (RBAC)',
      labelEn: 'Staff & Roles (RBAC)',
      icon: ShieldCheck,
    },
    {
      id: 'users' as DashboardTab,
      labelBn: 'কাস্টমার ডিরেক্টরি',
      labelEn: 'Customer Directory',
      icon: Users,
    },
    {
      id: 'settings' as DashboardTab,
      labelBn: 'সাইট সেটিংস ও ব্র্যান্ডিং',
      labelEn: 'Settings & Branding',
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full w-full flex-col justify-between bg-background border-r border-border p-4">
      {/* Top Header & Brand */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            {settings.general?.logoLight &&
            settings.general.logoLight !== '/images/logo.png' &&
            settings.general.logoLight.trim() !== '' ? (
              <div className="relative h-10 w-10 rounded-2xl overflow-hidden shadow-md transition-transform group-hover:scale-105 shrink-0 border border-primary/20 bg-white">
                <Image
                  src={settings.general.logoLight}
                  alt={siteName}
                  fill
                  className="object-cover"
                  sizes="40px"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-bold shadow-md transition-transform group-hover:scale-105 shrink-0">
                <Pill className="h-5.5 w-5.5" />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <span className="font-serif-title text-2xl font-extrabold tracking-tight text-primary leading-none">
                {siteName}
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
                {isBn ? 'এডমিন প্যানেল v2.0' : 'Admin Panel v2.0'}
              </span>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden rounded-xl p-1.5 text-muted-foreground hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Admin Quick Info Pill */}
        <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-muted/40 p-3 shadow-2xs">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold text-foreground truncate">
              {user?.name || (isBn ? 'সুপার এডমিন' : 'Super Admin')}
            </span>
            <span className="text-[11px] font-medium text-success flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse inline-block" />
              <span>{isBn ? 'সক্রিয় এডমিন' : 'System Active'}</span>
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={cn(
                  'group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      'h-4.5 w-4.5 transition-transform group-hover:scale-110',
                      isActive ? 'text-white' : 'text-primary'
                    )}
                  />
                  <span>{isBn ? item.labelBn : item.labelEn}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-extrabold leading-none',
                        item.badgeColor ||
                          (isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-muted text-muted-foreground')
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={cn(
                      'h-3.5 w-3.5 transition-transform opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5',
                      isActive && 'opacity-100 text-white'
                    )}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Action */}
      <div className="border-t border-border pt-3 mt-2 flex items-center justify-between text-xs">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-primary hover:underline"
        >
          <span>{isBn ? '← মেইন সাইটে যান' : '← Back to Main Site'}</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left Column) */}
      <aside className="hidden w-64 shrink-0 md:block h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:hidden',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
}
