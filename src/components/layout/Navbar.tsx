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
          isScrolled ? 'shadow-md py-0.5' : 'shadow-xs'
        )}
      >
        <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between max-w-[1700px] px-4 sm:px-6 lg:px-8 h-auto md:h-[72px]">
          {/* Mobile Top Row: Logo & Language Toggle + Sign In Button */}
          <div className="flex h-14 md:h-full items-center justify-between w-full md:w-auto shrink-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md transition-transform group-hover:scale-105 shrink-0">
                <Pill className="h-5 w-5 md:h-5.5 md:w-5.5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-serif-title text-2xl md:text-3xl font-extrabold tracking-tight text-primary leading-none">
                  mediShop
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
                  {isBn ? 'অনলাইন ফার্মেসি ও হেলথকেয়ার' : 'Online Pharmacy BD'}
                </span>
              </div>
            </Link>

            {/* Mobile Header Right Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                onClick={() => dispatch(setLanguage(isBn ? 'en' : 'bn'))}
                aria-label="Toggle Language"
                className="flex h-8 items-center gap-1 rounded-full border border-border/80 bg-muted/50 px-2.5 text-xs font-bold text-foreground transition-colors hover:bg-primary/10 hover:text-primary active:scale-95 shrink-0"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span>{isBn ? 'EN' : 'বাং'}</span>
              </button>

              {isAuthenticated ? (
                <Link
                  href="/profile"
                  aria-label={isBn ? 'মাই প্রোফাইল' : 'My Profile'}
                  className="flex h-8 items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 text-xs font-bold text-primary transition-all active:scale-95 shrink-0"
                >
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="max-w-[65px] truncate">
                    {user?.name?.split(' ')[0] || (isBn ? 'প্রোফাইল' : 'Profile')}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => dispatch(openAuthModal('signin'))}
                  aria-label={isBn ? 'সাইন ইন' : 'Sign In'}
                  className="flex h-8 items-center justify-center rounded-full bg-primary px-3 text-xs font-bold text-white shadow-2xs transition-all hover:bg-primary-dark active:scale-95 shrink-0"
                >
                  <span>{isBn ? 'সাইন ইন' : 'Sign In'}</span>
                </button>
              )}
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
                className="w-full rounded-full border border-border bg-muted/40 py-2 pl-10 pr-9 text-xs font-medium text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:bg-background focus:ring-0 focus:outline-none"
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

          {/* Desktop Search Bar with Autocomplete (Unified Height h-11) */}
          <div className="hidden flex-1 max-w-2xl mx-6 lg:mx-8 md:flex items-center relative my-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <Search className="absolute left-4 h-4.5 w-4.5 text-muted-foreground" />
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
                className="h-11 w-full rounded-2xl border border-border bg-muted/30 pl-11 pr-10 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:ring-0 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => dispatch(setSearchQuery(''))}
                  aria-label={isBn ? 'মুছে ফেলুন' : 'Clear search'}
                  className="absolute right-3.5 rounded-full p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
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

          {/* Desktop Right Actions (Unified Height h-11) */}
          <div className="hidden md:flex items-center gap-3 shrink-0 my-auto">
            {/* Upload Prescription Button */}
            <Link
              href="/upload-prescription"
              className="flex h-11 items-center gap-2 rounded-2xl bg-primary/10 border border-primary/20 px-4 text-xs sm:text-sm font-bold text-primary transition-all hover:bg-primary hover:text-white shadow-2xs shrink-0"
            >
              <Upload className="h-4.5 w-4.5" />
              <span>{isBn ? 'প্রেসক্রিপশন আপলোড' : 'Upload Prescription'}</span>
            </Link>

            {/* Account / User Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                  aria-expanded={isAccountDropdownOpen}
                  aria-label={isBn ? 'ইউজার একাউন্ট মেনু' : 'User Account Menu'}
                  className="flex h-11 items-center gap-2 rounded-2xl border border-border p-1.5 pr-3 transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary shrink-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary font-bold text-xs text-white">
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
                className="flex h-11 items-center gap-2 rounded-2xl bg-primary px-5 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-primary-dark active:scale-98 shrink-0"
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
    </>
  );
}
