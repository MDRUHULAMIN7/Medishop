'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User as UserIcon,
  Upload,
  ChevronDown,
  LogOut,
  UserCheck,
  Package,
  Pill,
  X,
  Phone,
  ShieldCheck,
  Truck,
  Globe,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSearchQuery, setLanguage } from '@/store/slices/uiSlice';
import { openAuthModal, logout } from '@/store/slices/authSlice';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { MobileSearchOverlay } from './MobileSearchOverlay';
import { SearchAutocomplete } from '@/components/search/SearchAutocomplete';
import { HOTLINE_NUMBER, HOTLINE_TEL } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isScrolled = useScrollPosition(8);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const searchQuery = useAppSelector((state) => state.ui.searchQuery);
  const language = useAppSelector((state) => state.ui.language);

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isBn = language === 'bn';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsAccountDropdownOpen(false);
  };

  return (
    <>
      {/* Top Info Header Bar (Desktop & Tablet) */}
      <div className="hidden bg-primary-dark text-white text-xs py-1.5 px-4 md:block border-b border-white/10">
        <div className="mx-auto flex max-w-[1700px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 font-medium text-white/90">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              {isBn ? 'ডিজিডিএ অনুমোদিত অনলাইন ফার্মেসি' : 'DGDA Approved Pharmacy (#DAR-2026-BD)'}
            </span>
            <span className="flex items-center gap-1.5 text-white/80">
              <Truck className="h-3.5 w-3.5 text-sky-300" />
              {isBn ? 'ঢাকায় ৪-৬ ঘণ্টায় সেম-ডে এক্সপ্রেস ডেলিভারি' : 'Same-day express delivery in Dhaka'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={HOTLINE_TEL}
              className="flex items-center gap-1.5 font-bold text-accent hover:underline"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{HOTLINE_NUMBER} (24/7)</span>
            </a>
            <span className="text-white/30">|</span>
            <button
              onClick={() => dispatch(setLanguage(isBn ? 'en' : 'bn'))}
              className="font-semibold text-white/90 hover:text-white transition-colors"
            >
              {isBn ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full bg-background/98 backdrop-blur-md transition-all duration-200 border-b border-border',
          isScrolled ? 'shadow-md py-1' : 'shadow-xs'
        )}
      >
        <div className="mx-auto flex flex-col md:flex-row max-w-[1700px] justify-between px-4 sm:px-6 lg:px-8">
          {/* Mobile Top Row: Logo & Language Toggle + Call Button */}
          <div className="flex h-14 md:h-[76px] items-center justify-between w-full md:w-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-2xl bg-primary text-white font-bold shadow-md transition-transform group-hover:scale-105">
                <Pill className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif-title text-xl font-extrabold tracking-tight text-primary md:text-3xl">
                  mediShop
                </span>
                <span className="hidden text-[10px] font-semibold tracking-wider uppercase text-muted-foreground sm:inline-block">
                  {isBn ? 'অনলাইন ফার্মেসি ও হেলথকেয়ার' : 'Online Pharmacy BD'}
                </span>
              </div>
            </Link>

            {/* Mobile Header Right Actions */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => dispatch(setLanguage(isBn ? 'en' : 'bn'))}
                aria-label="Toggle Language"
                className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-bold text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>{isBn ? 'EN' : 'বাং'}</span>
              </button>

              <a
                href={HOTLINE_TEL}
                aria-label="Call Hotline"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Mobile Search Bar with Autocomplete */}
          <div className="pb-3 md:hidden w-full relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder={
                  isBn
                    ? 'ওষুধ খুঁজুন (যেমন: Napa, Sergel)...'
                    : 'Search medicine (e.g. Napa, Sergel)...'
                }
                className="w-full rounded-full border border-border bg-muted/40 py-2 pl-10 pr-9 text-xs font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(''))}
                  aria-label={isBn ? 'মুছে ফেলুন' : 'Clear search'}
                  className="absolute right-3 rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Search Autocomplete Overlay */}
            <SearchAutocomplete
              query={searchQuery}
              isOpen={isSearchFocused}
              onClose={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Desktop Search Bar with Autocomplete */}
          <div className="hidden flex-1 max-w-2xl mx-8 md:block my-auto relative">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder={
                  isBn
                    ? 'ওষুধ বা স্বাস্থ্য সামগ্রী খুঁজুন (যেমন: Napa, Sergel)...'
                    : 'Search medicines or healthcare items (Ex: Napa, Sergel)...'
                }
                className="w-full rounded-2xl border border-border bg-muted/30 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:ring-2 focus:ring-primary/20 focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(''))}
                  aria-label={isBn ? 'মুছে ফেলুন' : 'Clear search'}
                  className="absolute right-3 rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            {/* Search Autocomplete Overlay */}
            <SearchAutocomplete
              query={searchQuery}
              isOpen={isSearchFocused}
              onClose={() => setIsSearchFocused(false)}
            />
          </div>

          {/* Desktop Right Actions (Rx Upload, Cart, Auth) */}
          <div className="hidden md:flex items-center gap-3 my-auto">
            {/* Upload Prescription Button */}
            <Link
              href="/upload-prescription"
              className="flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-white shadow-2xs"
            >
              <Upload className="h-4 w-4" />
              <span>{isBn ? 'প্রেসক্রিপশন আপলোড' : 'Upload Prescription'}</span>
            </Link>

            {/* Account / User Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  aria-expanded={isAccountDropdownOpen}
                  aria-label={isBn ? 'ইউজার একাউন্ট মেনু' : 'User Account Menu'}
                  className="flex items-center gap-2 rounded-xl border border-border p-1.5 pr-2.5 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-xs text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden max-w-[100px] truncate text-xs font-bold text-foreground md:inline-block">
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
                      className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-background p-1.5 shadow-xl ring-1 ring-black/5"
                    >
                      <div className="border-b border-border px-3 py-2">
                        <p className="text-xs font-bold text-foreground truncate">
                          {user?.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {user?.phone || user?.email}
                        </p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>{isBn ? 'মাই প্রোফাইল' : 'My Profile'}</span>
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setIsAccountDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        <Package className="h-4 w-4 text-primary" />
                        <span>{isBn ? 'অর্ডার হিস্ট্রি' : 'Order History'}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-light/30"
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
                className="flex items-center gap-2 rounded-xl bg-primary py-2.5 px-4 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-primary-dark active:scale-98"
              >
                <UserIcon className="h-4 w-4" />
                <span>{isBn ? 'সাইন ইন' : 'Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <MobileMenuDrawer />
      <MobileSearchOverlay />
    </>
  );
}
