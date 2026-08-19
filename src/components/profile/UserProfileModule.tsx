'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { User, MapPin, ShoppingBag, Settings, Bell, LockKeyhole, Globe, ShieldCheck, ChevronRight } from 'lucide-react';
import { ProfileModule } from '@/components/dashboard/modules/ProfileModule';
import { AddressesModule } from '@/components/dashboard/modules/AddressesModule';
import { MyOrdersSection } from './MyOrdersSection';
import { useAppSelector } from '@/store';
import { useAppDispatch } from '@/store';
import { setLanguage } from '@/store/slices/uiSlice';
import { openAuthModal } from '@/store/slices/authSlice';
import { RBAC_ROLES_CONFIG } from '@/config/rbac.config';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { toast } from 'sonner';

import { CustomerStaffInvitationBanner } from '@/components/dashboard/CustomerStaffInvitationBanner';

interface UserProfileModuleProps {
  isBn?: boolean;
}

type ProfileTab = 'profile' | 'orders' | 'addresses' | 'settings';

const TAB_ITEMS: Array<{
  id: ProfileTab;
  icon: React.ComponentType<{ className?: string }>;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
}> = [
  {
    id: 'profile',
    icon: User,
    titleBn: 'আমার প্রোফাইল',
    titleEn: 'My Profile',
    descBn: 'নাম ও কন্টাক্ট সেটিংস',
    descEn: 'Personal information',
  },
  {
    id: 'orders',
    icon: ShoppingBag,
    titleBn: 'আমার অর্ডারসমূহ',
    titleEn: 'My Orders',
    descBn: 'অর্ডার হিস্টোরি ও ট্র্যাকিং',
    descEn: 'Track your orders',
  },
  {
    id: 'addresses',
    icon: MapPin,
    titleBn: 'ডেলিভারি ঠিকানা',
    titleEn: 'Delivery Addresses',
    descBn: 'শিপিং লোকেশন বুক',
    descEn: 'Delivery addresses',
  },
  {
    id: 'settings',
    icon: Settings,
    titleBn: 'অ্যাকাউন্ট সেটিংস',
    titleEn: 'Account Settings',
    descBn: 'ভাষা, নিরাপত্তা ও পছন্দ',
    descEn: 'Notifications & security',
  },
];

export function UserProfileModule({ isBn = true }: UserProfileModuleProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  const isStaffOrAdmin = Boolean(user?.role && user.role !== 'customer');
  const roleConfig = user?.role ? RBAC_ROLES_CONFIG[user.role] : null;

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'profile' || tab === 'orders' || tab === 'addresses' || tab === 'settings') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: ProfileTab) => {
    setActiveTab(tabId);
    router.push(`/profile?tab=${tabId}`);
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Layout: Vertical Sidebar on Desktop, Full-width Content on Mobile */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <nav className="md:hidden grid grid-cols-2 sm:grid-cols-4 gap-2 w-full rounded-2xl border border-border bg-background p-2 shadow-xs">
          {TAB_ITEMS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2.5 text-[11px] font-bold transition-colors cursor-pointer ${
                  isActive ? 'bg-primary text-white shadow-xs' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{isBn ? tab.titleBn : tab.titleEn}</span>
              </button>
            );
          })}
        </nav>
        {/* Left Column Sidebar (Visible on Tablet & Desktop, hidden on Mobile) */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 shrink-0 space-y-4 sticky top-24">
          {/* User Quick Info Card */}
          <div className="rounded-3xl border border-border bg-background p-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-sky-400 font-black text-white text-lg shadow-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-foreground truncate">
                  {user?.name || (isBn ? 'গ্রাহক' : 'Customer')}
                </p>
                <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                  {user?.phone || user?.email || ''}
                </p>
                {isStaffOrAdmin && roleConfig && (
                  <span className="inline-flex items-center gap-1 mt-1 rounded-full px-2 py-0.5 text-[9px] font-black border bg-primary/10 text-primary border-primary/20">
                    <ShieldCheck className="h-2.5 w-2.5" />
                    <span>{isBn ? roleConfig.titleBn : roleConfig.titleEn}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Vertical Navigation Tabs */}
          <nav className="rounded-3xl border border-border bg-background p-2.5 shadow-xs space-y-1">
            {TAB_ITEMS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center justify-between rounded-2xl px-3.5 py-3 text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-white font-black shadow-md'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-primary'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-foreground'}`}>
                        {isBn ? tab.titleBn : tab.titleEn}
                      </p>
                      <p className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {isBn ? tab.descBn : tab.descEn}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-muted-foreground/60'}`} />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Column: Active Tab Content (Full width on mobile) */}
        <main className="flex-1 min-w-0 w-full space-y-6">
          <CustomerStaffInvitationBanner isBn={isBn} />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
            >
              {activeTab === 'profile' && <ProfileModule isBn={isBn} />}
              {activeTab === 'orders' && <MyOrdersSection isBn={isBn} />}
              {activeTab === 'addresses' && <AddressesModule isBn={isBn} />}
              {activeTab === 'settings' && (
                <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-6">
                  <div className="pb-4 border-b border-border">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
                      {isBn ? 'অ্যাকাউন্ট সেটিংস' : 'Account Settings'}
                    </p>
                    <h3 className="mt-1 text-lg font-black text-foreground font-serif-title">
                      {isBn ? 'ভাষা, নোটিফিকেশন ও নিরাপত্তা পছন্দ' : 'Language, notifications, and security'}
                    </h3>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => dispatch(setLanguage(isBn ? 'en' : 'bn'))}
                      className="w-full text-left rounded-2xl border border-border bg-background p-4 shadow-xs flex items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{isBn ? 'ভাষা পছন্দ' : 'Language'}</p>
                        <p className="text-[11px] text-muted-foreground">{isBn ? 'বাংলা / English' : 'Bangla / English'}</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(true)}
                      className="w-full text-left rounded-2xl border border-border bg-background p-4 shadow-xs flex items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{isBn ? 'নোটিফিকেশন' : 'Notifications'}</p>
                        <p className="text-[11px] text-muted-foreground">{isBn ? 'অর্ডার ও সাপোর্ট আপডেট' : 'Order & support alerts'}</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => dispatch(openAuthModal('forgot'))}
                      className="w-full text-left rounded-2xl border border-border bg-background p-4 shadow-xs flex items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <LockKeyhole className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{isBn ? 'পাসওয়ার্ড ও সিকিউরিটি' : 'Security'}</p>
                        <p className="text-[11px] text-muted-foreground">{isBn ? 'পাসওয়ার্ড সুরক্ষিত রাখুন' : 'Encrypted credentials'}</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (user?.isVerified) {
                          toast.success(isBn ? 'অ্যাকাউন্ট ভেরিফাইড' : 'Account is verified');
                        } else {
                          handleTabChange('profile');
                          toast.info(isBn ? 'প্রোফাইলে যোগাযোগের তথ্য সম্পূর্ণ করুন' : 'Complete your contact details in Profile');
                        }
                      }}
                      className="w-full text-left rounded-2xl border border-border bg-background p-4 shadow-xs flex items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">{isBn ? 'অ্যাকাউন্ট ভেরিফিকেশন' : 'Verification'}</p>
                        <p className="text-[11px] text-muted-foreground">{isBn ? 'সক্রিয় ও অনুমোদিত' : 'Active & Verified'}</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}
