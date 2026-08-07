'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { UserRole } from '@/types';
import { RBAC_ROLES_CONFIG, RbacTabId } from '@/config/rbac.config';
import { RbacSidebar } from '@/components/dashboard/RbacSidebar';
import { RbacHeader } from '@/components/dashboard/RbacHeader';
import { toast } from 'sonner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<RbacTabId>('admin_analytics');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync role & active tab with current URL sub-route
  useEffect(() => {
    if (pathname?.includes('/dashboard/admin')) {
      setCurrentRole('admin');
      setActiveTab('admin_analytics');
    } else if (pathname?.includes('/dashboard/pharmacist')) {
      setCurrentRole('pharmacist');
      setActiveTab('prescriptions_audit');
    } else if (pathname?.includes('/dashboard/sales')) {
      setCurrentRole('sales_staff');
      setActiveTab('pos_sales');
    } else if (pathname?.includes('/dashboard/inventory')) {
      setCurrentRole('inventory_manager');
      if (pathname.includes('tab=categories')) {
        setActiveTab('inventory_categories');
      } else {
        setActiveTab('inventory_products');
      }
    } else if (pathname?.includes('/dashboard/customer')) {
      setCurrentRole('customer');
      setActiveTab('orders_customer');
    } else if (reduxUser?.role) {
      setCurrentRole(reduxUser.role);
    }
  }, [pathname, reduxUser]);

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

    // 2. Strict Role Route Protection
    if (pathname?.includes('/dashboard/admin') && userRole !== 'admin') {
      toast.error(
        isBn ? 'এই এডমিন পেজে প্রবেশের অনুমতি নেই।' : 'Access denied. You do not have Admin permissions.'
      );
      const safeRoute = RBAC_ROLES_CONFIG[userRole]?.route || '/dashboard/customer';
      router.replace(safeRoute);
    } else if (
      pathname?.includes('/dashboard/inventory') &&
      !['admin', 'inventory_manager'].includes(userRole)
    ) {
      toast.error(
        isBn
          ? 'ইনভেন্টরি সেকশনে প্রবেশের অনুমতি নেই।'
          : 'Access denied. You do not have Inventory Manager permissions.'
      );
      const safeRoute = RBAC_ROLES_CONFIG[userRole]?.route || '/dashboard/customer';
      router.replace(safeRoute);
    } else if (
      pathname?.includes('/dashboard/pharmacist') &&
      !['admin', 'pharmacist'].includes(userRole)
    ) {
      toast.error(
        isBn
          ? 'প্রেসক্রিপশন অডিট সেকশনে প্রবেশের অনুমতি নেই।'
          : 'Access denied. You do not have Pharmacist permissions.'
      );
      const safeRoute = RBAC_ROLES_CONFIG[userRole]?.route || '/dashboard/customer';
      router.replace(safeRoute);
    } else if (
      pathname?.includes('/dashboard/sales') &&
      !['admin', 'sales_staff', 'pharmacist'].includes(userRole)
    ) {
      toast.error(
        isBn
          ? 'ক্যাশ কাউন্টার POS সেকশনে প্রবেশের অনুমতি নেই।'
          : 'Access denied. You do not have Sales Staff permissions.'
      );
      const safeRoute = RBAC_ROLES_CONFIG[userRole]?.route || '/dashboard/customer';
      router.replace(safeRoute);
    }
  }, [pathname, reduxUser, isAuthenticated, isInitialized, isBn, router]);

  // Role Switcher Tester Handler
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const targetRoute = RBAC_ROLES_CONFIG[newRole]?.route || '/dashboard/customer';
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
