'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/store';
import { UserRole } from '@/types';
import { RBAC_ROLES_CONFIG, RbacTabId } from '@/config/rbac.config';
import { RbacSidebar } from '@/components/dashboard/RbacSidebar';
import { RbacHeader } from '@/components/dashboard/RbacHeader';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
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

  // Sync role & active tab with current URL sub-route & search params
  useEffect(() => {
    setActiveTab(urlTab);
    if (pathname?.includes('/dashboard/admin') || pathname?.includes('/dashboard/inventory')) {
      setCurrentRole(reduxUser?.role || 'admin');
    } else if (pathname?.includes('/dashboard/customer')) {
      setCurrentRole('customer');
    } else if (reduxUser?.role) {
      setCurrentRole(reduxUser.role);
    }
  }, [pathname, urlTab, reduxUser]);

  // RBAC Guard Protection: Enforce strict role-based access control
  useEffect(() => {
    if (!isInitialized) return;

    // 1. Authentication check
    if (!isAuthenticated || !reduxUser) {
      toast.error(isBn ? 'ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন।' : 'Please log in to access dashboard.');
      router.replace('/profile');
      return;
    }

    const userRole = reduxUser.role || 'customer';

    // 2. Strict Customer Role Block - Customers have no dashboard
    if (userRole === 'customer') {
      toast.error(
        isBn
          ? 'কাস্টমার একাউন্টের জন্য ড্যাশবোর্ড প্রযোজ্য নয়। আপনার প্রোফাইল পেজে রিডাইরেক্ট করা হচ্ছে।'
          : 'Customer accounts do not have access to the staff dashboard.'
      );
      router.replace('/profile');
      return;
    }

    // 3. Strict Admin Route Protection
    if (pathname?.includes('/dashboard/admin') && !['admin', 'super_admin'].includes(userRole)) {
      toast.error(
        isBn ? 'এই এডমিন পেজে প্রবেশের অনুমতি নেই।' : 'Access denied. You do not have Admin permissions.'
      );
      const safeRoute = RBAC_ROLES_CONFIG[userRole]?.route || '/profile';
      router.replace(safeRoute);
    }
  }, [pathname, reduxUser, isAuthenticated, isInitialized, isBn, router]);

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
