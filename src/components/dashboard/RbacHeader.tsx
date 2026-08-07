'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Menu,
  Search,
  Globe,
  LogOut,
  User as UserIcon,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLanguage } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { UserRole } from '@/types';
import { RBAC_ROLES_CONFIG } from '@/config/rbac.config';
import { RbacTabId } from '@/config/rbac.config';

interface RbacHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onToggleMobileSidebar: () => void;
  onSelectTab: (tab: RbacTabId) => void;
  isBn?: boolean;
}

const ROLE_OPTIONS: { role: UserRole; labelEn: string; labelBn: string; icon: React.ElementType }[] = [
  { role: 'customer', labelEn: 'Customer / Patient', labelBn: 'গ্রাহক / পেশেন্ট', icon: UserIcon },
  { role: 'pharmacist', labelEn: 'Licensed Pharmacist', labelBn: 'ফার্মাসিস্ট', icon: Stethoscope },
  { role: 'sales_staff', labelEn: 'Sales & POS Staff', labelBn: 'সেলস স্টাফ', icon: ShoppingCart },
  { role: 'inventory_manager', labelEn: 'Inventory Manager', labelBn: 'ইনভেন্টরি ম্যানেজার', icon: Package },
  { role: 'admin', labelEn: 'Super Administrator', labelBn: 'সিস্টেম এডমিন', icon: ShieldAlert },
];

export function RbacHeader({
  currentRole,
  onRoleChange,
  onToggleMobileSidebar,
  onSelectTab,
  isBn = true,
}: RbacHeaderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const activeRoleConfig = RBAC_ROLES_CONFIG[currentRole] || RBAC_ROLES_CONFIG.customer;

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    dispatch(setLanguage(isBn ? 'en' : 'bn'));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/30 text-foreground hover:bg-muted cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">
            {isBn ? 'ড্যাশবোর্ড মোড:' : 'Dashboard Mode:'}
          </span>
          <span className="text-xs font-extrabold text-foreground">
            {isBn ? activeRoleConfig.titleBn : activeRoleConfig.titleEn}
          </span>
        </div>
      </div>

      {/* Center/Right: Role Switcher Tester Dropdown & Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Switcher Tester Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer ${activeRoleConfig.badgeBg}`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden md:inline font-extrabold">
              {isBn ? activeRoleConfig.titleBn : activeRoleConfig.titleEn}
            </span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-background p-2 shadow-xl ring-1 ring-black/5 z-50">
              <div className="px-3 py-2 border-b border-border text-[11px] font-extrabold text-muted-foreground uppercase">
                {isBn ? 'টেস্টিং ভিউ পরিবর্তন করুন (RBAC Switcher)' : 'Switch Role View (RBAC)'}
              </div>
              <div className="py-1 space-y-1">
                {ROLE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = currentRole === opt.role;
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => {
                        onRoleChange(opt.role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary text-white'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{isBn ? opt.labelBn : opt.labelEn}</span>
                      </div>
                      {isSelected && <span className="text-[10px] font-black uppercase">Active</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 text-xs font-bold text-foreground hover:bg-muted transition-all cursor-pointer"
        >
          <Globe className="h-4 w-4 text-primary" />
          <span>{isBn ? 'EN' : 'বাং'}</span>
        </button>

        {/* User Profile Avatar Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-border p-1 hover:bg-muted/40 transition-all cursor-pointer"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-white overflow-hidden">
              {user?.avatar ? (
                <Image src={user.avatar} alt="Avatar" width={32} height={32} className="h-full w-full object-cover" />
              ) : (
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mr-1 hidden sm:inline" />
          </button>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background p-2 shadow-xl ring-1 ring-black/5 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-extrabold text-foreground truncate">{user?.name || 'User Profile'}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email || user?.phone}</p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('profile');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted cursor-pointer"
                >
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span>{isBn ? 'মাই প্রোফাইল সেটিং' : 'My Profile Settings'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isBn ? 'লগআউট করুন' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
