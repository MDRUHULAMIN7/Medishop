'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { UserRole } from '@/types';
import { RbacTabId, RBAC_MENU_ITEMS } from '@/config/rbac.config';
import { RbacSidebar } from './RbacSidebar';
import { RbacHeader } from './RbacHeader';

// Import Tab Modules
import { AdminUserManagerModule } from './modules/AdminUserManagerModule';
import { PrescriptionAuditModule } from './modules/PrescriptionAuditModule';
import { PosSalesModule } from './modules/PosSalesModule';
import { InventoryProductsModule } from './modules/InventoryProductsModule';
import { AdminAnalyticsModule } from './modules/AdminAnalyticsModule';

// Reuse existing managers
import { OrderManager } from './OrderManager';
import { CategoryManager } from './CategoryManager';
import { BrandManager } from './BrandManager';
import { PaymentManager } from './PaymentManager';

export function RbacDashboardLayout() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  // Active Role state (Defaults to logged-in user role or 'customer')
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<RbacTabId>('admin_analytics');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync currentRole when reduxUser updates
  useEffect(() => {
    if (reduxUser?.role) {
      setCurrentRole(reduxUser.role);
    }
  }, [reduxUser]);

  // Handle Role Switch
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // Ensure activeTab is permitted for new role
    const allowed = RBAC_MENU_ITEMS.filter((item) => item.roles.includes(newRole));
    if (!allowed.some((item) => item.id === activeTab)) {
      setActiveTab(allowed[0]?.id || 'admin_analytics');
    }
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'admin_analytics':
        return <AdminAnalyticsModule isBn={isBn} />;
      case 'admin_users':
        return <AdminUserManagerModule isBn={isBn} />;
      case 'admin_coupons':
        return <PaymentManager />;
      case 'prescriptions_audit':
        return <PrescriptionAuditModule isBn={isBn} />;
      case 'pos_sales':
        return <PosSalesModule isBn={isBn} />;
      case 'inventory_products':
        return <InventoryProductsModule isBn={isBn} />;
      case 'inventory_categories':
        return (
          <div className="space-y-6">
            <CategoryManager />
            <BrandManager />
          </div>
        );
      case 'inventory_low_stock':
        return <InventoryProductsModule isBn={isBn} />;
      case 'orders_customer':
        return <OrderManager />;
      case 'prescriptions_customer':
        return <PrescriptionAuditModule isBn={isBn} />;
      default:
        return <AdminAnalyticsModule isBn={isBn} />;
    }
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
        {/* Header with Role Switcher */}
        <RbacHeader
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onSelectTab={setActiveTab}
          isBn={isBn}
        />

        {/* Dynamic Tab Module */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}
