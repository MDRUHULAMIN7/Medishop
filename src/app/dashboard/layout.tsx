'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { UserRole } from '@/types';
import { RBAC_ROLES_CONFIG, RbacTabId } from '@/config/rbac.config';
import { RbacSidebar } from '@/components/dashboard/RbacSidebar';
import { RbacHeader } from '@/components/dashboard/RbacHeader';
import { openAuthModal } from '@/store/slices/authSlice';
import { toast } from 'sonner';
import { Loader2, ShieldAlert, Lock, LogIn } from 'lucide-react';

const ROLE_ALLOWED_TABS: Record<UserRole, RbacTabId[]> = {
  admin: [
    'overview', 'products', 'categories', 'brands', 'inventory', 'ledger',
    'pos_sales', 'prescriptions', 'orders', 'chat', 'users',
    'coupons', 'banners', 'reviews', 'reports', 'staff', 'settings'
  ],
  super_admin: [
    'overview', 'products', 'categories', 'brands', 'inventory', 'ledger',
    'pos_sales', 'prescriptions', 'orders', 'chat', 'users',
    'coupons', 'banners', 'reviews', 'reports', 'staff', 'settings'
  ],
  pharmacist: [
    'overview', 'prescriptions', 'pos_sales', 'products', 'categories',
    'brands', 'inventory', 'orders', 'chat'
  ],
  pharmacist_verifier: [
    'overview', 'prescriptions', 'orders', 'chat'
  ],
  sales_staff: [
    'overview', 'pos_sales', 'orders', 'chat', 'products', 'users'
  ],
  order_manager: [
    'overview', 'orders', 'chat', 'users', 'prescriptions', 'pos_sales'
  ],
  inventory_manager: [
    'overview', 'products', 'categories', 'brands', 'inventory', 'ledger', 'reports'
  ],
  marketing_editor: [
    'overview', 'coupons', 'banners', 'reviews'
  ],
  customer: [],
};

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const urlTab = (searchParams?.get('tab') || 'overview') as RbacTabId;
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<RbacTabId>(urlTab);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const userRole = reduxUser?.role || 'customer';

  // Sync role & active tab with current URL sub-route & search params
  useEffect(() => {
    setActiveTab(urlTab);
    if (reduxUser?.role) {
      setCurrentRole(reduxUser.role);
    }
  }, [urlTab, reduxUser]);

  // RBAC Guard Protection: Enforce strict role-based access control
  useEffect(() => {
    if (!isInitialized) return;

    // 1. Authentication check
    if (!isAuthenticated || !reduxUser) {
      router.replace('/login');
      return;
    }

    // 2. Strict Customer Role Block - Customers have NO dashboard
    if (userRole === 'customer') {
      toast.error(
        isBn
          ? 'কাস্টমার একাউন্টের জন্য ড্যাশবোর্ড প্রযোজ্য নয়।'
          : 'Customer accounts do not have access to the staff dashboard.'
      );
      router.replace('/profile');
      return;
    }

    // 3. Strict sub-route routing per staff role
    if (userRole === 'sales_staff' && !pathname?.startsWith('/dashboard/sales')) {
      router.replace('/dashboard/sales');
      return;
    }

    if (
      (userRole === 'pharmacist' || userRole === 'pharmacist_verifier') &&
      !pathname?.startsWith('/dashboard/pharmacist')
    ) {
      router.replace('/dashboard/pharmacist');
      return;
    }

    if (userRole === 'inventory_manager' && !pathname?.startsWith('/dashboard/inventory')) {
      router.replace('/dashboard/inventory');
      return;
    }

    // 4. Admin subroute protection for order_manager / marketing_editor tabs
    if (pathname?.startsWith('/dashboard/admin')) {
      if (!['admin', 'super_admin', 'order_manager', 'marketing_editor'].includes(userRole)) {
        const safeRoute = RBAC_ROLES_CONFIG[userRole]?.route || '/profile';
        router.replace(safeRoute);
        return;
      }

      // Check tab permissions for order_manager and marketing_editor
      const allowedTabs = ROLE_ALLOWED_TABS[userRole] || [];
      if (!['admin', 'super_admin'].includes(userRole) && !allowedTabs.includes(urlTab)) {
        const fallbackTab = allowedTabs[0] || 'overview';
        router.replace(`/dashboard/admin?tab=${fallbackTab}`);
      }
    }
  }, [pathname, urlTab, userRole, reduxUser, isAuthenticated, isInitialized, isBn, router, dispatch]);

  // Handle unauthorized or loading guard states (NEVER render children to unauthorized users)
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-xs font-bold text-muted-foreground">
            {isBn ? 'অথেনটিকেশন লোড হচ্ছে...' : 'Loading authentication...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !reduxUser) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/20 p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 text-center shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-foreground font-serif-title">
            {isBn ? 'লগইন আবশ্যক' : 'Staff Login Required'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'ড্যাশবোর্ডে প্রবেশ করতে অনুমোদিত অ্যাকাউন্ট দিয়ে লগইন করুন।'
              : 'Please log in with an authorized account to access the dashboard.'}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => dispatch(openAuthModal('signin'))}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-primary px-6 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{isBn ? 'সাইন ইন করুন' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'customer') {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/20 p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-background p-8 text-center shadow-xl space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black text-foreground font-serif-title">
            {isBn ? 'অননুমোদিত অ্যাক্সেস' : 'Access Restricted'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'কাস্টমার একাউন্টের জন্য ড্যাশবোর্ড প্রযোজ্য নয়। আপনার প্রোফাইলে নেওয়া হচ্ছে...'
              : 'Customer accounts cannot access the staff management portal. Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  // Check subroute authorization
  if (userRole === 'sales_staff' && !pathname?.startsWith('/dashboard/sales')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (
    (userRole === 'pharmacist' || userRole === 'pharmacist_verifier') &&
    !pathname?.startsWith('/dashboard/pharmacist')
  ) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userRole === 'inventory_manager' && !pathname?.startsWith('/dashboard/inventory')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (
    pathname?.startsWith('/dashboard/admin') &&
    !['admin', 'super_admin', 'order_manager', 'marketing_editor'].includes(userRole)
  ) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Role Switcher Tester Handler
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const targetRoute = RBAC_ROLES_CONFIG[newRole]?.route || '/profile';
    router.push(targetRoute);
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/20 text-foreground">
      {/* 1. Responsive Role-Aware Sidebar */}
      <RbacSidebar
        currentRole={currentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isBn={isBn}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar Header */}
        <RbacHeader
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onSelectTab={setActiveTab}
          isBn={isBn}
        />

        {/* Dynamic Nested Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}
