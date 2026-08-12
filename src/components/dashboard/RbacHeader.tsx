'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Globe,
  LogOut,
  User as UserIcon,
  Home,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLanguage } from '@/store/slices/uiSlice';
import { UserRole } from '@/types';
import { RBAC_ROLES_CONFIG } from '@/config/rbac.config';
import { RbacTabId } from '@/config/rbac.config';
import { useAuth } from '@/hooks/useAuth';

interface RbacHeaderProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onToggleMobileSidebar: () => void;
  onSelectTab?: (tab: RbacTabId) => void;
  isBn?: boolean;
}

export function RbacHeader({
  currentRole,
  onToggleMobileSidebar,
  isBn = true,
}: RbacHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { logout: executeLogout } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const activeRoleConfig = RBAC_ROLES_CONFIG[currentRole] || RBAC_ROLES_CONFIG.customer;

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    dispatch(setLanguage(isBn ? 'en' : 'bn'));
  };

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await executeLogout();
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur-md shrink-0">
      {/* Left: Mobile Menu Toggle & Role Badge Banner */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/30 text-foreground hover:bg-muted cursor-pointer"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
          <span className="font-extrabold text-foreground bg-muted/40 px-3 py-1.5 rounded-xl border border-border flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
            <span>{isBn ? activeRoleConfig.titleBn : activeRoleConfig.titleEn}</span>
          </span>
        </div>
      </div>

      {/* Right: Language Switcher & User Profile Actions */}
      <div className="flex items-center gap-3">
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
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background p-2 shadow-2xl ring-1 ring-black/5 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-extrabold text-foreground truncate">{user?.name || 'User Profile'}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.email || user?.phone}</p>
              </div>

              <div className="py-1 space-y-1">
                {/* 1. Store Homepage Link */}
                <Link
                  href="/"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  <Home className="h-4 w-4 text-primary" />
                  <span>{isBn ? 'হোমপেজ' : 'Store Homepage'}</span>
                </Link>

                {/* 2. My Profile Link */}
                <Link
                  href="/profile"
                  onClick={() => setIsProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                >
                  <UserIcon className="h-4 w-4 text-primary" />
                  <span>{isBn ? 'মাই প্রোফাইল' : 'My Profile'}</span>
                </Link>

                {/* 3. Logout Action */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isBn ? 'লগআউট' : 'Logout'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
