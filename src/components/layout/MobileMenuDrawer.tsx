'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShieldCheck,
  Upload,
  User as UserIcon,
  Pill,
  Stethoscope,
  Activity,
  Heart,
  Baby,
  ShieldPlus,
  Sparkles,
  Apple,
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  ChevronRight,
  LogOut,
  Globe,
  Info,
  PhoneCall,
  HelpCircle,
  Shield,
  LogIn,
} from 'lucide-react';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLanguage, setMobileMenu, setMobileMenuMode } from '@/store/slices/uiSlice';
import { openAuthModal } from '@/store/slices/authSlice';
import { useCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';
import { useBranding } from '@/context/BrandingContext';
import { RBAC_ROLES_CONFIG, getRoleDashboardTitle } from '@/config/rbac.config';

const ICON_MAP: Record<string, React.ReactNode> = {
  Pill: <Pill className="h-5 w-5 text-primary" />,
  Stethoscope: <Stethoscope className="h-5 w-5 text-primary" />,
  Activity: <Activity className="h-5 w-5 text-primary" />,
  Heart: <Heart className="h-5 w-5 text-primary" />,
  Baby: <Baby className="h-5 w-5 text-primary" />,
  ShieldPlus: <ShieldPlus className="h-5 w-5 text-primary" />,
  Sparkles: <Sparkles className="h-5 w-5 text-primary" />,
  Apple: <Apple className="h-5 w-5 text-primary" />,
};

export function MobileMenuDrawer() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const mobileMenuMode = useAppSelector((state) => state.ui.mobileMenuMode);
  const language = useAppSelector((state) => state.ui.language);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { categories } = useCategories();
  const { logout: executeLogout } = useAuth();

  const isBn = language === 'bn';
  const isAccountMode = mobileMenuMode === 'account';
  const isStaffOrAdmin = Boolean(user?.role && user.role !== 'customer');
  const roleConfig = user?.role ? RBAC_ROLES_CONFIG[user.role] : null;

  const { settings } = useBranding();
  const siteName = settings.general?.siteName || 'mediShop';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(setMobileMenu(false));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dispatch]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const closeDrawer = () => {
    dispatch(setMobileMenu(false));
  };

  const handleAuthClick = () => {
    closeDrawer();
    dispatch(openAuthModal('signin'));
  };

  const handleLogout = async () => {
    closeDrawer();
    await executeLogout();
  };

  const handleProfileTab = (tab: 'profile' | 'orders' | 'addresses') => {
    closeDrawer();
    router.push(`/profile?tab=${tab}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            role="dialog"
            aria-modal="true"
            aria-label={isAccountMode ? (isBn ? 'মেনু ও অ্যাকাউন্ট' : 'Menu & Account') : (isBn ? 'ক্যাটাগরি মেনু' : 'Category Menu')}
            className="fixed inset-y-0 left-0 z-50 flex w-[320px] max-w-[88vw] flex-col overflow-hidden bg-background shadow-2xl md:hidden"
          >
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between border-b border-border px-4 bg-background/95 shrink-0">
              <Link href="/" onClick={closeDrawer} className="flex items-center gap-2.5">
                {settings.general?.logoLight &&
                settings.general.logoLight !== '/images/logo.png' &&
                settings.general.logoLight.trim() !== '' ? (
                  <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-md shrink-0 border border-primary/20 bg-white">
                    <Image
                      src={settings.general.logoLight}
                      alt={siteName}
                      fill
                      sizes="36px"
                      className="object-contain p-0.5"
                    />
                  </div>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <span className="font-serif-title text-xl font-extrabold tracking-tight text-primary leading-none">
                    {siteName}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground mt-0.5">
                    {isAccountMode ? (isBn ? 'মেনু ও সেটিংস' : 'Menu & Settings') : (isBn ? 'ঔষধ ক্যাটাগরি' : 'Medicine Categories')}
                  </span>
                </div>
              </Link>
              <button
                onClick={closeDrawer}
                aria-label={isBn ? 'মেনু বন্ধ করুন' : 'Close menu'}
                className="rounded-full p-2 text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar space-y-4">
              {isAccountMode ? (
                /* === ACCOUNT / THREE-DOT MENU VIEW === */
                <div className="space-y-4">
                  {/* User Profile Card */}
                  <div className="rounded-2xl border border-border bg-muted/40 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white font-bold text-base shadow-xs">
                          {isAuthenticated && user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-5 w-5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-foreground truncate">
                            {isAuthenticated ? user?.name : (isBn ? 'অতিথি ইউজার' : 'Guest User')}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {isAuthenticated ? (user?.phone || user?.email) : (isBn ? 'লগইন করে অর্ডার ট্র্যাক করুন' : 'Sign in to manage orders')}
                          </p>
                          {isStaffOrAdmin && roleConfig && (
                            <span className="inline-flex items-center gap-1 mt-1 rounded-full px-2 py-0.5 text-[9px] font-black border bg-primary/10 text-primary border-primary/20">
                              <ShieldCheck className="h-2.5 w-2.5" />
                              <span>{isBn ? roleConfig.titleBn : roleConfig.titleEn}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Language Switch */}
                      <button
                        type="button"
                        onClick={() => dispatch(setLanguage(isBn ? 'en' : 'bn'))}
                        className="flex items-center gap-1 rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground shadow-xs shrink-0 cursor-pointer"
                      >
                        <Globe className="h-3.5 w-3.5 text-primary" />
                        <span>{isBn ? 'EN' : 'বাং'}</span>
                      </button>
                    </div>

                    {!isAuthenticated && (
                      <button
                        type="button"
                        onClick={handleAuthClick}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark cursor-pointer"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>{isBn ? 'সাইন ইন / রেজিস্ট্রেশন' : 'Sign In / Register'}</span>
                      </button>
                    )}
                  </div>

                  {/* Vertical Items List (Niche Niche) */}
                  <div className="space-y-1.5">
                    {isAuthenticated && (
                      <>
                        {/* 1. My Profile */}
                        <button
                          type="button"
                          onClick={() => handleProfileTab('profile')}
                          className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-3 text-left shadow-2xs hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <UserIcon className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-foreground">{isBn ? 'আমার প্রোফাইল' : 'My Profile'}</p>
                              <p className="text-[10px] text-muted-foreground">{isBn ? 'নাম, কন্টাক্ট ও প্রোফাইল সেটিংস' : 'Name & contact details'}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>

                        {/* 2. My Orders */}
                        <button
                          type="button"
                          onClick={() => handleProfileTab('orders')}
                          className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-3 text-left shadow-2xs hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <ShoppingBag className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-foreground">{isBn ? 'আমার অর্ডারসমূহ' : 'My Orders'}</p>
                              <p className="text-[10px] text-muted-foreground">{isBn ? 'অর্ডারের বিবরণ ও ডেলিভারি স্ট্যাটাস' : 'Track orders & history'}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>

                        {/* 3. Delivery Addresses */}
                        <button
                          type="button"
                          onClick={() => handleProfileTab('addresses')}
                          className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-3 text-left shadow-2xs hover:bg-muted transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <MapPin className="h-4.5 w-4.5" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-foreground">{isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery Addresses'}</p>
                              <p className="text-[10px] text-muted-foreground">{isBn ? 'সংরক্ষিত ডেলিভারি লোকেশন' : 'Saved delivery locations'}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </button>

                        {/* 4. Staff Dashboard (Only for Admin / Staff, NEVER for Customer) */}
                        {isStaffOrAdmin && (
                          <Link
                            href="/dashboard"
                            onClick={closeDrawer}
                            className="flex w-full items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 p-3 text-left shadow-2xs hover:bg-primary hover:text-white transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white group-hover:bg-white group-hover:text-primary transition-colors">
                                <LayoutDashboard className="h-4.5 w-4.5" />
                              </div>
                              <div>
                                <p className="text-xs font-extrabold text-primary group-hover:text-white">{getRoleDashboardTitle(user?.role, isBn)}</p>
                                <p className="text-[10px] text-primary/80 group-hover:text-white/80">{isBn ? 'ম্যানেজমেন্ট ও কন্ট্রোল প্যানেল' : 'Access management panel'}</p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-primary group-hover:text-white" />
                          </Link>
                        )}
                      </>
                    )}

                    {/* 5. About Us */}
                    <Link
                      href="/about"
                      onClick={closeDrawer}
                      className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-3 text-left shadow-2xs hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
                          <Info className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-foreground">{isBn ? 'আমাদের সম্পর্কে' : 'About Us'}</p>
                          <p className="text-[10px] text-muted-foreground">{isBn ? 'মেডিশপ সম্পর্কে জানুন' : 'Learn about mediShop'}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>

                    {/* 6. Contact Us */}
                    <Link
                      href="/contact"
                      onClick={closeDrawer}
                      className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-3 text-left shadow-2xs hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
                          <PhoneCall className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-foreground">{isBn ? 'যোগাযোগ ও সাপোর্ট' : 'Contact Us & Support'}</p>
                          <p className="text-[10px] text-muted-foreground">{isBn ? 'ফার্মাসিস্ট ও কাস্টমার কেয়ার' : 'Reach our support team'}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>

                    {/* 7. Help & FAQs */}
                    <Link
                      href="/faq"
                      onClick={closeDrawer}
                      className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-3 text-left shadow-2xs hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
                          <HelpCircle className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-foreground">{isBn ? 'সাহায্য ও প্রশ্ন (FAQ)' : 'Help & FAQs'}</p>
                          <p className="text-[10px] text-muted-foreground">{isBn ? 'সাধারণ প্রশ্নোত্তর' : 'Frequently asked questions'}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>

                    {/* 8. Privacy Policy */}
                    <Link
                      href="/privacy"
                      onClick={closeDrawer}
                      className="flex w-full items-center justify-between rounded-2xl border border-border bg-background p-3 text-left shadow-2xs hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-foreground">
                          <Shield className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-foreground">{isBn ? 'গোপনীয়তা ও শর্তাবলী' : 'Privacy & Policies'}</p>
                          <p className="text-[10px] text-muted-foreground">{isBn ? 'ডাটা ও নিরাপত্তা নীতি' : 'Data protection & terms'}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </div>

                  {/* Logout Button */}
                  {isAuthenticated && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 dark:bg-rose-950/20 py-3 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{isBn ? 'লগআউট করুন' : 'Sign Out'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* === CATEGORIES DRAWER VIEW === */
                <div className="space-y-4">
                  {/* Upload Prescription Button */}
                  <Link
                    href="/upload-prescription"
                    onClick={closeDrawer}
                    className="flex items-center justify-center gap-2.5 rounded-2xl bg-primary px-4 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-dark transition-all"
                  >
                    <Upload className="h-4.5 w-4.5" />
                    <span>{isBn ? 'প্রেসক্রিপশন আপলোড করুন' : 'Upload Prescription'}</span>
                  </Link>

                  {/* Clean List of Categories */}
                  <div>
                    <h3 className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      {isBn ? 'ঔষধ ক্যাটাগরিসমূহ' : 'All Categories'}
                    </h3>
                    <nav className="flex flex-col gap-1.5">
                      {(categories || []).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          onClick={closeDrawer}
                          className="flex items-center justify-between rounded-2xl border border-border bg-background px-3.5 py-3 text-xs font-bold text-foreground transition-all hover:bg-primary/5 hover:border-primary/30"
                        >
                          <div className="flex items-center gap-3">
                            {ICON_MAP[cat.iconName || 'Pill'] || <Pill className="h-4.5 w-4.5 text-primary" />}
                            <span>{isBn ? cat.nameBn || cat.name : cat.nameEn || cat.name}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-border bg-muted/30 p-3 text-center shrink-0">
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>DGDA Licensed Pharmacy • BD</span>
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
