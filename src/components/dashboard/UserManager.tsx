'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Users, Shield, UserCheck, ShieldAlert, UserX, RefreshCw } from 'lucide-react';
import { useAppSelector } from '@/store';
import { adminService, AdminUserListItem } from '@/services/admin.service';
import { DataTable, Column } from './DataTable';
import { toast } from 'sonner';

export function UserManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '15');
      if (search.trim()) params.append('search', search.trim());

      const res = await adminService.listUsers(params.toString());
      setUsers(res.users);
      setTotalCount(res.total);
    } catch (err: any) {
      console.error('Failed to load user directory:', err);
      toast.error(err?.message || 'Failed to fetch registered users');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await adminService.updateUserStatus(id, newStatus);
      toast.success(
        newStatus === 'blocked'
          ? isBn
            ? 'ইউজার অ্যাকাউন্ট সফলভাবে ব্লক করা হয়েছে'
            : 'User account blocked successfully'
          : isBn
          ? 'ইউজার অ্যাকাউন্ট আনব্লক করা হয়েছে'
          : 'User account unblocked successfully'
      );
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update user status');
    }
  };

  const columns: Column<AdminUserListItem>[] = [
    {
      key: 'name',
      headerBn: 'ইউজার নাম',
      headerEn: 'User Name',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground sm:text-sm">{row.name}</span>
          <span className="text-[10px] text-muted-foreground font-mono">ID: #{row.id.slice(-6)}</span>
        </div>
      ),
    },
    {
      key: 'phone',
      headerBn: 'যোগাযোগের তথ্য',
      headerEn: 'Contact Details',
      render: (row) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-primary">{row.phone || 'No phone'}</span>
          <span className="text-[11px] text-muted-foreground">{row.email || 'No email'}</span>
        </div>
      ),
    },
    {
      key: 'role',
      headerBn: 'অ্যাসাইনকৃত রোল',
      headerEn: 'Assigned Role',
      render: (row) => (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
            row.role === 'admin' || row.role === 'super_admin'
              ? 'bg-purple-100 text-purple-800'
              : row.role === 'pharmacist' || row.role === 'pharmacist_verifier'
              ? 'bg-sky-100 text-sky-800'
              : row.role === 'inventory_manager'
              ? 'bg-indigo-100 text-indigo-800'
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: 'status',
      headerBn: 'স্ট্যাটাস',
      headerEn: 'Status',
      render: (row) => (
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
            row.status === 'active'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: 'createdAt',
      headerBn: 'নিবন্ধনের তারিখ',
      headerEn: 'Joined Date',
      render: (row) => (
        <span className="text-muted-foreground font-medium">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'N/A'}
        </span>
      ),
    },
    {
      key: 'action',
      headerBn: 'অ্যাকশন',
      headerEn: 'Action',
      render: (row) => (
        <div className="text-right">
          <button
            type="button"
            onClick={() => handleToggleStatus(row.id, row.status)}
            className={`rounded-xl border border-border px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
              row.status === 'active'
                ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {row.status === 'active' ? (isBn ? 'ব্লক করুন' : 'Block User') : (isBn ? 'আনব্লক' : 'Unblock')}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 border border-indigo-200">
            <Users className="h-3.5 w-3.5" />
            <span>{isBn ? 'লাইব ডাটাবেজ কাস্টমার তালিকা' : 'Live User Directory'}</span>
          </span>
          <h2 className="text-xl font-extrabold text-foreground mt-1">
            {isBn ? 'ইউজার ডিরেক্টরি ও একাউন্ট স্ট্যাটাস' : 'User Management Directory'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'নিবন্ধিত গ্রাহকদের তথ্য দেখুন এবং প্রয়োজন অনুযায়ী অ্যাকাউন্ট সচল/ব্লক করুন'
              : 'View live registered accounts and control active/blocked status.'}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{isBn ? 'রিফ্রেশ ডাটা' : 'Refresh Users'}</span>
        </button>
      </div>

      {/* Server Paginated DataTable */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        mode="server"
        currentPage={page}
        pageSize={15}
        totalCount={totalCount}
        onPageChange={(p) => setPage(p)}
        onSearchChange={(q) => {
          setSearch(q);
          setPage(1);
        }}
        searchPlaceholderBn="কাস্টমারের নাম, ফোন বা ইমেইল খুঁজুন..."
        searchPlaceholderEn="Search user name, phone, or email..."
      />
    </div>
  );
}
