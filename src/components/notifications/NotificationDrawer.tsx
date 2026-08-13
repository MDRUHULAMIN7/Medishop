'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  PackageCheck,
  FileText,
  AlertCircle,
  X,
  Loader2,
  Clock,
} from 'lucide-react';
import { notificationService, NotificationItem } from '@/services/notification.service';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationsUpdated?: () => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  onNotificationsUpdated,
}: NotificationDrawerProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isBn = language === 'bn';

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await notificationService.getMyNotifications(1, 20);
      setNotifications(data.notifications);
      setUnreadCount(data.meta.unreadCount);
    } catch (err: any) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      if (onNotificationsUpdated) onNotificationsUpdated();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      if (onNotificationsUpdated) onNotificationsUpdated();
      toast.success(isBn ? 'সব নোটিফিকেশন পড়া হয়েছে' : 'All notifications marked as read');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark all as read');
    }
  };

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'order_created':
      case 'order_status_updated':
        return <PackageCheck className="h-4 w-4 text-emerald-600" />;
      case 'prescription_submitted':
      case 'prescription_approved':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'prescription_rejected':
        return <AlertCircle className="h-4 w-4 text-rose-600" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div className="relative w-full max-w-md bg-background h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isBn ? 'নোটিফিকেশন' : 'Notifications'}
              </h3>
              {unreadCount > 0 && (
                <span className="text-xs font-semibold text-primary">
                  {unreadCount} {isBn ? 'টি নতুন বার্তা' : 'unread messages'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-1 rounded-xl bg-muted px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-primary hover:text-white transition-colors"
                title={isBn ? 'সব পড়া হয়েছে হিসেবে চিহ্নিত করুন' : 'Mark all as read'}
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>{isBn ? 'সব ক্লিয়ার' : 'Mark all read'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex h-48 items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span>{isBn ? 'নোটিফিকেশন লোড হচ্ছে...' : 'Loading notifications...'}</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6 text-muted-foreground">
              <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-bold text-foreground">
                {isBn ? 'কোনো নোটিফিকেশন নেই' : 'No notifications yet'}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {isBn
                  ? 'আপনার অর্ডার ও আপলোডকৃত প্রেসক্রিপশনের আপডেট এখানে দেখা যাবে'
                  : 'Order updates and prescription approval status will appear here.'}
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                className={`group relative flex gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                  item.isRead
                    ? 'border-border bg-background hover:bg-muted/30'
                    : 'border-primary/30 bg-primary/5 hover:bg-primary/10 shadow-2xs'
                }`}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background border border-border shadow-xs">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-foreground truncate">
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleString(isBn ? 'bn-BD' : 'en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {item.data?.orderId && (
                      <Link
                        href={`/orders/${item.data.orderId}`}
                        onClick={onClose}
                        className="font-bold text-primary hover:underline"
                      >
                        {isBn ? 'অর্ডার দেখুন →' : 'View Order →'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
