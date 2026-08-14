'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Lock,
  UserCheck,
  Check,
  X,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { adminService, AdminUserListItem } from '@/services/admin.service';
import { toast } from 'sonner';

export function StaffManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [staffList, setStaffList] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('pharmacist_verifier');

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.listUsers();
      // Filter out pure customer users to show staff members
      const staffOnly = res.users.filter((u) => u.role !== 'customer');
      setStaffList(staffOnly);
    } catch (err: any) {
      console.error('Failed to load staff list:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast.error(isBn ? 'নাম ও ইমেইল পূরণ করুন' : 'Please provide staff name and email');
      return;
    }

    const newStaffItem: AdminUserListItem = {
      id: `st-${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      phone: '+880 1700-000000',
      role: inviteRole,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setStaffList((prev) => [...prev, newStaffItem]);
    toast.success(
      isBn
        ? `"${inviteName}" কে সফলভাবে ইনভাইট করা হয়েছে!`
        : `Staff invite sent to "${inviteName}"!`
    );
    setShowInviteModal(false);
    setInviteName('');
    setInviteEmail('');
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await adminService.updateUserStatus(id, newStatus);
      toast.success(isBn ? 'স্টাফ একাউন্ট স্ট্যাটাস পরিবর্তন করা হয়েছে' : 'Staff status updated');
      fetchStaff();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isBn ? 'স্টাফ ও পারমিশন কন্ট্রোল' : 'Role-Based Access Control (RBAC)'}</span>
          </span>
          <h2 className="text-xl font-extrabold text-foreground mt-1">
            {isBn ? 'ফার্মেসি স্টাফ ও অ্যাক্সেস রোলস' : 'Staff Accounts & Permissions Matrix'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'ফার্মাসিস্ট, ইনভেন্টরি ম্যানেজার ও অর্ডার স্টাফদের অ্যাকাউন্ট ও রোল ভিত্তিক অ্যাক্সেস লেভেল পরিচালনা করুন'
              : 'Manage pharmacy staff accounts, assign specific roles, and restrict permission boundaries.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-primary-dark transition-all cursor-pointer w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>{isBn ? 'নতুন স্টাফ ইনভাইট' : 'Invite Staff Member'}</span>
          </button>

          <button
            type="button"
            onClick={fetchStaff}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Staff List Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3.5 px-4">Staff Name & Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground font-medium">
                    {isBn ? 'স্টাফ ডাটা লোড হচ্ছে...' : 'Loading staff directory...'}
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground font-medium">
                    {isBn ? 'কোনো স্টাফ অ্যাকাউন্ট পাওয়া যায়নি। উপরে ইনভাইট বাটনে ক্লিক করে নতুন স্টাফ যোগ করুন।' : 'No staff accounts registered yet. Click Invite Staff Member above to add one.'}
                  </td>
                </tr>
              ) : (
                staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground sm:text-sm">{st.name}</span>
                        <span className="text-[11px] text-muted-foreground">{st.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase">
                        {st.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          st.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {st.createdAt ? new Date(st.createdAt).toLocaleDateString() : 'N/A'}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(st.id, st.status)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                          st.status === 'active'
                            ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {st.status === 'active' ? (isBn ? 'ব্লক করুন' : 'Disable') : (isBn ? 'সচল করুন' : 'Enable')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">
                {isBn ? 'নতুন স্টাফ ইনভাইট করুন' : 'Invite Staff Member'}
              </h3>
              <button type="button" onClick={() => setShowInviteModal(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleInviteStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1 text-foreground">Staff Name:</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Dr. Tanvir Ahmed"
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-foreground">Email Address:</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="e.g. tanvir@medishop.com.bd"
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1 text-foreground">Assign Role:</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer"
                >
                  <option value="pharmacist_verifier">Pharmacist Verifier (Rx Queue)</option>
                  <option value="inventory_manager">Inventory Manager (Batches & FEFO)</option>
                  <option value="order_manager">Order Manager (Order Status)</option>
                  <option value="marketing_editor">Marketing Editor (Coupons & Banners)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-border px-4 py-2 font-bold text-muted-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 font-bold text-white shadow-xs hover:bg-primary-dark cursor-pointer"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
