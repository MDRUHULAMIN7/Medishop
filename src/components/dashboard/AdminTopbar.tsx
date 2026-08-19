'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Menu,
  Search,
  Bell,
  Globe,
  Plus,
  ShieldCheck,
  UserCheck,
  ChevronDown,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLanguage } from '@/store/slices/uiSlice';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { notificationService } from '@/services/notification.service';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

interface AdminTopbarProps {
  onToggleMobileSidebar: () => void;
  onOpenQuickAdd?: () => void;
}

export function AdminTopbar({
  onToggleMobileSidebar,
  onOpenQuickAdd,
}: AdminTopbarProps) {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isBn = language === 'bn';
  const { logout: logoutUser } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchVal, setSearchVal] = useState('');

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    const count = await notificationService.getUnreadCount();
    setUnreadCount(count);
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      toast.info(
        isBn
          ? `এডমিন প্যানেলে খুঁজছেন: "${searchVal}"`
          : `Searching Admin Database: "${searchVal}"`
      );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/98 px-4 backdrop-blur-md sm:px-6">
        {/* Left: Mobile Toggle & Global Search Input */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Open Mobile Menu"
            className="rounded-xl border border-border bg-muted/40 p-2 text-foreground md:hidden hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Global Admin Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={
                isBn
                  ? 'মেডিসিন, কাস্টমার, অর্ডার বা ট্র্যাকিং খুঁজুন...'
                  : 'Search medicine, customer, order ID or tracking...'
              }
              className="h-10 w-full rounded-2xl border border-border bg-muted/30 pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none"
            />
          </form>
        </div>

        {/* Right Actions & Admin Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Quick Add Button */}
          {onOpenQuickAdd && (
            <button
              onClick={onOpenQuickAdd}
              className="hidden sm:flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-bold text-white shadow-2xs hover:bg-primary-dark transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>{isBn ? 'নতুন ওষুধ যোগ' : 'Add Medicine'}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={() => dispatch(setLanguage(isBn ? 'en' : 'bn'))}
            aria-label="Toggle Language"
            className="flex h-9 items-center gap-1 rounded-xl border border-border/80 bg-muted/50 px-2.5 text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Globe className="h-3.5 w-3.5 text-primary" />
            <span>{isBn ? 'EN' : 'বাং'}</span>
          </button>

          {/* Notifications Icon with Badge */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/30 text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-extrabold text-white animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

        {/* Admin Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2 rounded-2xl border border-border p-1 pr-2 hover:bg-muted transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-bold text-xs text-white shadow-2xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="hidden text-xs font-bold text-foreground sm:inline-block max-w-[90px] truncate">
              {user?.name || (isBn ? 'এডমিন' : 'Admin')}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {/* Profile Menu Popover */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-background p-1.5 shadow-xl ring-1 ring-black/5 z-50">
              <div className="border-b border-border px-3 py-2">
                <p className="text-xs font-bold text-foreground truncate">
                  {user?.name || 'Super Admin'}
                </p>
                <p className="text-[11px] font-medium text-success flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{isBn ? 'সিস্টেম ম্যানেজার' : 'System Manager'}</span>
                </p>
              </div>

              <Link
                href="/"
                target="_blank"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted mt-1"
              >
                <span>{isBn ? 'লাইভ ওয়েবসাইট দেখুন' : 'View Live Website'}</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>

              <button
                onClick={() => {
                  void logoutUser();
                  setIsProfileOpen(false);
                  toast.success(isBn ? 'এডমিন লগআউট হয়েছে' : 'Admin logged out');
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-light/40 mt-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{isBn ? 'লগআউট' : 'Logout'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

    <NotificationDrawer
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      onNotificationsUpdated={fetchUnreadCount}
    />
  </>
);
}
