'use client';

import React, { useState, useEffect } from 'react';
import { useAppSelector } from '@/store';
import { UserRole } from '@/types';
import { RbacTabId, RBAC_MENU_ITEMS } from '@/config/rbac.config';
import { RbacSidebar } from './RbacSidebar';
import { RbacHeader } from './RbacHeader';

// Reuse integrated managers
import { CategoryManager } from './CategoryManager';
import { BrandManager } from './BrandManager';
import { ProfileModule } from './modules/ProfileModule';

export function RbacDashboardLayout() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  // Active Role state (Defaults to logged-in user role or 'admin')
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [activeTab, setActiveTab] = useState<RbacTabId>('inventory_categories');
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
      setActiveTab(allowed[0]?.id || 'inventory_categories');
    }
  };

  const renderActiveModule = () => {
    return (
      <div className="space-y-6">
        <CategoryManager />
        <BrandManager />
      </div>
    );
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
