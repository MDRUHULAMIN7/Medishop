'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User as UserIcon,
  Upload,
  ChevronDown,
  LogOut,
  X,
  Phone,
  ShieldCheck,
  Truck,
  LayoutDashboard,
  Bell,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSearchQuery, setLanguage, toggleMobileSearch } from '@/store/slices/uiSlice';
import { openAuthModal } from '@/store/slices/authSlice';
import { openPrescriptionModal, closePrescriptionModal } from '@/store/slices/uiSlice';
import { UploadPrescriptionModal } from '@/components/modals/UploadPrescriptionModal';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { notificationService } from '@/services/notification.service';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { MobileSearchOverlay } from './MobileSearchOverlay';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { HOTLINE_NUMBER } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useBranding } from '@/context/BrandingContext';
import { useAuth } from '@/hooks/useAuth';
import { RBAC_ROLES_CONFIG, getRoleDashboardTitle } from '@/config/rbac.config';

export function Navbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { logout: executeLogout } = useAuth();
  const { settings } = useBranding();
  const isScrolled = useScrollPosition(8);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const language = useAppSelector((state) => state.ui.language);
  const isPrescriptionModalOpen = useAppSelector((state) => state.ui.isPrescriptionModalOpen);
  const isBn = language === 'bn';

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);
  const accountDropdownRef = useRef<HTMLDivElement | null>(null);

  const isStaffOrAdmin = Boolean(user?.role && user.role !== 'customer');
  const roleConfig = user?.role ? RBAC_ROLES_CONFIG[user.role] : null;

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Click outside listener for Search suggestions & User dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    setIsAccountDropdownOpen(false);
    executeLogout();
  };

  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-primary-dark text-white text-xs py-1.5 px-4 hidden md:block border-b border-primary/20">
        <div className="mx-auto flex justify-between items-center max-w-[1700px]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              {isBn ? '১০০% আসল ও রেজিস্টার্ড ফার্মাসিস্ট দ্বারা ভেরিফাইড ওষুধ' : '100% Genuine Medicines & Doctor Verified'}
            </span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <Truck className="h-3.5 w-3.5 text-accent" />
              {isBn ? 'সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি' : 'Fast Cash On Delivery Nationwide'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.general?.contactPhone || HOTLINE_NUMBER}`}
              className="flex items-center gap-1.5 font-bold text-accent hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{settings.general?.contactPhone || HOTLINE_NUMBER} (24/7)</span>
            </a>
            <span className="text-white/30">|</span>
            <button
              onClick={() => dispatch(setLanguage(isBn ? 'en' : 'bn'))}
              className="font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              {isBn ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full bg-background/98 backdrop-blur-md transition-all duration-200 border-b border-border',
          isScrolled ? 'shadow-md py-0.5' : 'shadow-xs'
        )}
      >
        <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between max-w-[1700px] px-4 sm:px-6 lg:px-8 h-auto md:h-[72px]">
          {/* Logo & Mobile Actions */}
          <div className="flex h-14 md:h-full items-center justify-between w-full md:w-auto shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              {settings.general?.logoLight &&
              settings.general.logoLight !== '/images/logo.png' &&
              settings.general.logoLight.trim() !== '' ? (
                <div className="relative h-9 w-9 md:h-10 md:w-10 rounded-xl overflow-hidden shadow-md transition-transform group-hover:scale-105 shrink-0 border border-primary/20 bg-white">
                  <Image
                    src={settings.general.logoLight}
                    alt={settings.general?.siteName || 'mediShop'}
                    fill
                    sizes="40px"
                    className="object-contain p-1"
                    priority
                  />
                </div>
              ) : (
                <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md transition-transform group-hover:scale-105 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="font-serif-title text-2xl md:text-3xl font-extrabold tracking-tight text-primary leading-none">
                  {settings.general?.siteName || 'mediShop'}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
                  {isBn ? 'অনলাইন ফার্মেসি ও হেলথকেয়ার' : (settings.general?.tagline || 'Online Pharmacy BD')}
                </span>
              </div>
            </Link>

            {/* Mobile Header Right Icons */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                type="button"
                onClick={() => dispatch(toggleMobileSearch())}
                aria-label={isBn ? 'অনুসন্ধান করুন' : 'Open search'}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-foreground transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 shrink-0 cursor-pointer"
              >
                <Search className="h-4.5 w-4.5" />
              </button>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(true)}
                  aria-label="Notifications"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-foreground transition-colors hover:bg-muted active:scale-95 shrink-0 cursor-pointer"
                >
                  <Bell className="h-4.5 w-4.5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-extrabold text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatch(openAuthModal('signin'))}
                  className="flex h-9 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-bold text-white shadow-2xs hover:bg-primary-dark transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>{isBn ? 'সাইন ইন' : 'Sign In'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Desktop Search Bar with Live Autocomplete */}
          <div
            ref={searchContainerRef}
            className="hidden flex-1 max-w-2xl mx-6 lg:mx-8 md:flex items-center relative my-auto"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <button
                type="submit"
                aria-label={isBn ? 'অনুসন্ধান করুন' : 'Submit search'}
                className="absolute left-4 p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  dispatch(setSearchQuery(e.target.value));
                  if (!isSearchFocused) setIsSearchFocused(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                  }
                }}
                placeholder={
                  isBn
                    ? 'ওষুধ বা স্বাস্থ্য সামগ্রী খুঁজুন (যেমন: Napa, Sergel)...'
                    : 'Search medicines or healthcare items (Ex: Napa, Sergel)...'
                }
                className="h-11 w-full rounded-2xl border border-border bg-muted/30 pl-11 pr-10 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(''))}
                  aria-label={isBn ? 'মুছে ফেলুন' : 'Clear search'}
                  className="absolute right-3.5 rounded-full p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>

            {/* Mounted Search Autocomplete Suggestions */}
            <SearchAutocomplete
              query={searchQuery}
              isOpen={isSearchFocused}
              onClose={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Desktop Right Actions (Cart removed, sticky cart takes over) */}
          <div className="hidden md:flex items-center gap-3 shrink-0 my-auto">
            {/* Upload Prescription Button */}
            <button
              type="button"
              onClick={() => dispatch(openPrescriptionModal())}
              className="flex h-11 items-center gap-2 rounded-2xl bg-primary/10 border border-primary/20 px-4 text-xs sm:text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white shadow-2xs shrink-0 cursor-pointer"
            >
              <Upload className="h-4.5 w-4.5" />
              <span>{isBn ? 'প্রেসক্রিপশন আপলোড' : 'Upload Prescription'}</span>
            </button>

            {/* Notification Bell */}
            {isAuthenticated && (
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(true)}
                aria-label="Notifications"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-muted/30 text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-extrabold text-white animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile Dropdown */}
            {isAuthenticated ? (
              <div ref={accountDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  aria-expanded={isAccountDropdownOpen}
                  aria-label={isBn ? 'ইউজার অ্যাকাউন্ট মেনু' : 'User Account Menu'}
                  className="flex h-11 items-center gap-2 rounded-2xl border border-border p-1.5 pr-3 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary shrink-0 cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-bold text-xs text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden max-w-[110px] truncate text-xs font-bold text-foreground md:inline-block">
                    {user?.name || (isBn ? 'গ্রাহক' : 'Account')}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {isAccountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background p-1.5 shadow-2xl ring-1 ring-black/5 z-50"
                    >
                      <div className="border-b border-border px-3 py-2.5">
                        <p className="text-xs font-extrabold text-foreground truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {user?.phone || user?.email}
                        </p>
                        {isStaffOrAdmin && roleConfig && (
                          <span className="inline-flex items-center gap-1 mt-1.5 rounded-full px-2 py-0.5 text-[9px] font-black border bg-primary/10 text-primary border-primary/20">
                            <ShieldCheck className="h-2.5 w-2.5" />
                            <span>{isBn ? roleConfig.titleBn : roleConfig.titleEn}</span>
                          </span>
                        )}
                      </div>

                      <div className="py-1 space-y-1">
                        {/* If Staff/Admin, show dynamic Dashboard link */}
                        {isStaffOrAdmin && (
                          <Link
                            href="/dashboard"
                            onClick={() => setIsAccountDropdownOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-extrabold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all shadow-xs"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>{getRoleDashboardTitle(user?.role, isBn)}</span>
                          </Link>
                        )}

                        {/* Profile Link */}
                        <Link
                          href="/profile"
                          onClick={() => setIsAccountDropdownOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                        >
                          <UserIcon className="h-4 w-4 text-primary" />
                          <span>{isBn ? 'আমার প্রোফাইল' : 'My Profile'}</span>
                        </Link>

                        {/* Customer Specific Links */}
                        {!isStaffOrAdmin && (
                          <>
                            <Link
                              href="/profile?tab=orders"
                              onClick={() => setIsAccountDropdownOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                            >
                              <ShoppingBag className="h-4 w-4 text-primary" />
                              <span>{isBn ? 'আমার অর্ডারসমূহ' : 'My Orders'}</span>
                            </Link>
                            <Link
                              href="/profile?tab=addresses"
                              onClick={() => setIsAccountDropdownOpen(false)}
                              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                            >
                              <MapPin className="h-4 w-4 text-primary" />
                              <span>{isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Addresses'}</span>
                            </Link>
                          </>
                        )}

                        {/* Logout Button */}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>{isBn ? 'লগআউট' : 'Logout'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openAuthModal('signin'))}
                className="flex h-11 items-center gap-2 rounded-2xl bg-primary px-5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark active:scale-98 shrink-0 cursor-pointer"
              >
                <UserIcon className="h-4.5 w-4.5" />
                <span>{isBn ? 'সাইন ইন' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <MobileMenuDrawer />
      <MobileSearchOverlay />
      <UploadPrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => dispatch(closePrescriptionModal())}
      />
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNotificationsUpdated={fetchUnreadCount}
      />
    </>
  );
}
