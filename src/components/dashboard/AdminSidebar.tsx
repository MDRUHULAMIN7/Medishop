'use client';

import React from 'react';
import Link from 'next/link';
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
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store';

export type DashboardTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'brands'
  | 'banners'
  | 'orders'
  | 'payments'
  | 'reviews'
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
  const user = useAppSelector((state) => state.auth.user);
  const isBn = language === 'bn';

  const menuItems = [
    {
      id: 'overview' as DashboardTab,
      labelBn: 'ওভারভিউ ও অ্যানালিটিক্স',
      labelEn: 'Overview & Stats',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'products' as DashboardTab,
      labelBn: 'ওষুধ ও প্রডাক্টস',
      labelEn: 'Medicine & Products',
      icon: Package,
      badge: '254',
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
      id: 'banners' as DashboardTab,
      labelBn: 'ব্যানার ও হিরো স্লাইডার',
      labelEn: 'Banners & Hero',
      icon: ImageIcon,
    },
    {
      id: 'orders' as DashboardTab,
      labelBn: 'অর্ডার ও ট্র্যাকিং',
      labelEn: 'Orders & Tracking',
      icon: ShoppingBag,
      badge: '12 New',
      badgeColor: 'bg-accent text-slate-950 font-bold',
    },
    {
      id: 'payments' as DashboardTab,
      labelBn: 'পেমেন্ট ও রিফান্ড',
      labelEn: 'Payments & Refunds',
      icon: CreditCard,
    },
    {
      id: 'reviews' as DashboardTab,
      labelBn: 'রিভিউ ও রেটিং',
      labelEn: 'Reviews & Rating',
      icon: Star,
    },
    {
      id: 'support' as DashboardTab,
      labelBn: 'কাস্টমার সাপোর্ট',
      labelEn: 'Customer Support',
      icon: Headphones,
      badge: '3',
      badgeColor: 'bg-primary text-white font-bold',
    },
    {
      id: 'users' as DashboardTab,
      labelBn: 'ইউজার ম্যানেজমেন্ট',
      labelEn: 'User Directory',
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
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white font-bold shadow-md transition-transform group-hover:scale-105">
              <Pill className="h-5.5 w-5.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-2xl font-extrabold tracking-tight text-primary leading-none">
                mediShop
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
                {isBn ? 'এডমিন প্যানেল v1.2' : 'Admin Panel v1.2'}
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
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
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
                  'group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200',
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
