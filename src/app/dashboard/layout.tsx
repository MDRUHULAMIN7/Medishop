'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { UserRole } from '@/types';
import { RBAC_ROLES_CONFIG, RbacTabId } from '@/config/rbac.config';
import { RbacSidebar } from '@/components/dashboard/RbacSidebar';
import { RbacHeader } from '@/components/dashboard/RbacHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  // Determine current active role from pathname or reduxUser
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [activeTab, setActiveTab] = useState<RbacTabId>('admin_analytics');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync role with sub-route
  useEffect(() => {
    if (pathname?.includes('/dashboard/admin')) {
      setCurrentRole('admin');
    } else if (pathname?.includes('/dashboard/pharmacist')) {
      setCurrentRole('pharmacist');
    } else if (pathname?.includes('/dashboard/sales')) {
      setCurrentRole('sales_staff');
    } else if (pathname?.includes('/dashboard/inventory')) {
      setCurrentRole('inventory_manager');
    } else if (pathname?.includes('/dashboard/customer')) {
      setCurrentRole('customer');
    } else if (reduxUser?.role) {
      setCurrentRole(reduxUser.role);
    }
  }, [pathname, reduxUser]);

  // Role Switcher Navigation Handler
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
