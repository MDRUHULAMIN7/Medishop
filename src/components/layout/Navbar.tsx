'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Search,
  Menu,
  User as UserIcon,
  Upload,
  ChevronDown,
  LogOut,
  UserCheck,
  Package,
  Pill,
  X,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  toggleMobileMenu,
  setMobileSearch,
  setSearchQuery,
  setLanguage,
} from '@/store/slices/uiSlice';
import { openAuthModal, logout } from '@/store/slices/authSlice';
import { toggleCartDrawer, selectTotalQuantity } from '@/store/slices/cartSlice';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { MobileSearchOverlay } from './MobileSearchOverlay';
import { cn } from '@/lib/utils';

export function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isScrolled = useScrollPosition(8);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const totalCartQuantity = useAppSelector(selectTotalQuantity);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const language = useAppSelector((state) => state.ui.language);

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const isBn = language === 'bn';

  // Animate cart badge when count changes
  const [badgeAnimate, setBadgeAnimate] = useState(false);

  useEffect(() => {
    if (totalCartQuantity > 0) {
      setBadgeAnimate(true);
      const timer = setTimeout(() => setBadgeAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalCartQuantity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsAccountDropdownOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full bg-background/95 backdrop-blur-md transition-shadow duration-200 border-b border-border',
          isScrolled ? 'shadow-md' : 'shadow-xs'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-[72px] lg:px-8">
          {/* Left Zone: Hamburger (Mobile) + Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label={isBn ? 'মেনু খুলুন' : 'Open Navigation Menu'}
              aria-expanded={false}
              className="rounded-lg p-2 text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 transition-transform active:scale-98"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-xs">
                <Pill className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-title text-xl font-bold tracking-tight text-primary md:text-2xl">
                  mediShop
                </span>
                <span className="hidden text-[10px] font-medium tracking-wide text-muted-foreground sm:inline-block">
                  {isBn ? 'ডিজিটাল হেলথকেয়ার' : 'Online Pharmacy BD'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center Zone: Desktop Search Bar */}
          <div className="hidden flex-1 max-w-lg mx-6 md:block">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center"
            >
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder={
                  isBn
                    ? 'ওষুধ বা ব্র্যান্ডের নাম খুঁজুন...'
                    : 'Search medicines, generic or brands...'
                }
                className="w-full rounded-full border border-border bg-muted/40 py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:bg-background focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(''))}
                  aria-label={isBn ? 'মুছে ফেলুন' : 'Clear search'}
                  className="absolute right-3 rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="absolute right-3.5 hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground lg:inline-block">
                  Ctrl K
                </kbd>
              )}
            </form>
          </div>

          {/* Right Zone: Actions (Language, Rx Upload, Cart, Auth) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => dispatch(setMobileSearch(true))}
              aria-label={isBn ? 'অনুসন্ধান করুন' : 'Open Search'}
              className="rounded-lg p-2 text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary md:hidden"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Desktop Upload Prescription CTA */}
            <Link
              href="/upload-prescription"
              className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 lg:flex"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>{isBn ? 'প্রেসক্রিপশন আপলোড' : 'Upload Rx'}</span>
            </Link>

            {/* Language Switcher Toggle */}
            <button
              onClick={() => dispatch(setLanguage(isBn ? 'en' : 'bn'))}
              aria-label={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
              className="hidden rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary sm:flex"
            >
              {isBn ? 'EN' : 'বাং'}
            </button>

            {/* Shopping Cart Icon with Animated Badge */}
            <button
              onClick={() => dispatch(toggleCartDrawer())}
              aria-label={
                isBn
                  ? `কার্ট - ${totalCartQuantity} টি আইটেম`
                  : `Cart - ${totalCartQuantity} items`
              }
              className="relative rounded-lg p-2 text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              {totalCartQuantity > 0 && (
                <motion.span
                  animate={badgeAnimate ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-white shadow-xs"
                >
                  {totalCartQuantity}
                </motion.span>
              )}
            </button>

            {/* Account / User Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  aria-expanded={isAccountDropdownOpen}
                  aria-label={isBn ? 'ইউজার একাউন্ট মেনু' : 'User Account Menu'}
                  className="flex items-center gap-1.5 rounded-full border border-border p-1 pr-2 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary font-bold text-xs text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden max-w-[90px] truncate text-xs font-semibold text-foreground md:inline-block">
                    {user?.name || (isBn ? 'গ্রাহক' : 'Account')}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isAccountDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-background p-1.5 shadow-lg ring-1 ring-black/5"
                    >
                      <div className="border-b border-border px-3 py-2">
                        <p className="text-xs font-semibold text-foreground">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {user?.phone || user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>{isBn ? 'মাই প্রোফাইল' : 'My Profile'}</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted"
                      >
                        <Package className="h-4 w-4 text-primary" />
                        <span>{isBn ? 'অর্ডার হিস্ট্রি' : 'Order History'}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-danger hover:bg-danger-light/30"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{isBn ? 'লগআউট' : 'Logout'}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => dispatch(openAuthModal('signin'))}
                className="flex items-center gap-1.5 rounded-lg bg-primary py-2 px-3 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-primary-dark sm:px-4 sm:text-sm"
              >
                <UserIcon className="h-4 w-4" />
                <span>{isBn ? 'সাইন ইন' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer />

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay />
    </>
  );
}
