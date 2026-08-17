'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Globe,
  LogOut,
  User as UserIcon,
  Home,
  ChevronDown,
  ShieldCheck,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setLanguage } from '@/store/slices/uiSlice';
import { UserRole } from '@/types';
import { RBAC_ROLES_CONFIG } from '@/config/rbac.config';
import { RbacTabId } from '@/config/rbac.config';
import { useAuth } from '@/hooks/useAuth';
import { notificationService } from '@/services/notification.service';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { playNotificationSound } from '@/utils/sound';
import { getAccessToken } from '@/lib/apiClient';
import { toast } from 'sonner';
import io, { Socket } from 'socket.io-client';

interface RbacHeaderProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onToggleMobileSidebar: () => void;
  onSelectTab?: (tab: RbacTabId) => void;
  isBn?: boolean;
}

export function RbacHeader({
  currentRole,
  onToggleMobileSidebar,
  onSelectTab,
  isBn = true,
}: RbacHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { logout: executeLogout } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const activeRoleConfig = RBAC_ROLES_CONFIG[currentRole] || RBAC_ROLES_CONFIG.customer;

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    setMounted(true);
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Real-time socket connection for live chat and notifications
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const token = getAccessToken();
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

    const socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join:admins');
    });

    // Handle incoming live chat message from any customer
    socket.on('chat:new_message', (msg: any) => {
      if (msg && msg.senderRole === 'customer') {
        playNotificationSound();
        setUnreadCount((prev) => prev + 1);

        toast.info(
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <MessageSquare className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{isBn ? `নতুন চ্যাট মেসেজ: ${msg.senderName}` : `New Live Message: ${msg.senderName}`}</span>
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {msg.message}
            </p>
          </div>,
          {
            duration: 7000,
            action: onSelectTab
              ? {
                  label: isBn ? 'চ্যাটে যান' : 'Open Chat',
                  onClick: () => onSelectTab('support' as RbacTabId),
                }
              : undefined,
          }
        );
      }
    });

    // Handle generic live notification
    socket.on('notification:received', (payload: any) => {
      playNotificationSound();
      setUnreadCount((prev) => prev + 1);
      const notif = payload?.notification || payload;
      if (notif?.type !== 'live_chat_message') {
        toast.info(notif?.title || 'New Notification', {
          description: notif?.message,
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user?.id, isBn, onSelectTab]);

  const toggleLanguage = () => {
    dispatch(setLanguage(isBn ? 'en' : 'bn'));
  };

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await executeLogout();
  };

  const avatarChar = mounted && user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur-md shrink-0">
        {/* Left: Mobile Menu Toggle & Role Badge Banner */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-muted/30 text-foreground hover:bg-muted cursor-pointer"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <span className="font-extrabold text-foreground bg-muted/40 px-3 py-1.5 rounded-xl border border-border flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>{isBn ? activeRoleConfig.titleBn : activeRoleConfig.titleEn}</span>
            </span>
          </div>
        </div>

        {/* Right: Notifications, Language Switcher & User Profile Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Notifications Bell with Badge */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/30 text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <Bell className="h-4 w-4 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white shadow-xs animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 text-xs font-bold text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <Globe className="h-4 w-4 text-primary" />
            <span>{isBn ? 'EN' : 'বাং'}</span>
          </button>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 rounded-full border border-border p-1 hover:bg-muted/40 transition-all cursor-pointer"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-black text-white overflow-hidden">
                {mounted && user?.avatar ? (
                  <Image src={user.avatar} alt="Avatar" width={32} height={32} className="h-full w-full object-cover" />
                ) : (
                  <span suppressHydrationWarning>{avatarChar}</span>
                )}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mr-1 hidden sm:inline" />
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background p-2 shadow-2xl ring-1 ring-black/5 z-50">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-extrabold text-foreground truncate" suppressHydrationWarning>
                    {mounted && user?.name ? user.name : 'User Profile'}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate" suppressHydrationWarning>
                    {mounted ? user?.email || user?.phone || '' : ''}
                  </p>
                </div>

                <div className="py-1 space-y-1">
                  {/* Store Homepage Link */}
                  <Link
                    href="/"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    <Home className="h-4 w-4 text-primary" />
                    <span>{isBn ? 'হোমপেজ' : 'Store Homepage'}</span>
                  </Link>

                  {/* My Profile Link */}
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-primary" />
                    <span>{isBn ? 'মাই প্রোফাইল' : 'My Profile'}</span>
                  </Link>
                </div>

                <div className="border-t border-border pt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{isBn ? 'লগআউট' : 'Sign Out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNotificationsUpdated={fetchUnreadCount}
      />
    </>
  );
}
