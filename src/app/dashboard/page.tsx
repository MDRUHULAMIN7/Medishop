'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';
import { RBAC_ROLES_CONFIG } from '@/config/rbac.config';

export default function DashboardIndexPage() {
  const router = useRouter();
  const reduxUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const role = reduxUser?.role || 'customer';
    if (role === 'customer') {
      router.replace('/profile');
      return;
    }
    const targetRoute = RBAC_ROLES_CONFIG[role]?.route || '/dashboard/admin';
    router.replace(targetRoute);
  }, [reduxUser, router]);

  return (
    <div className="flex h-64 items-center justify-center text-xs font-bold text-muted-foreground">
      Redirecting to role dashboard...
    </div>
  );
}
