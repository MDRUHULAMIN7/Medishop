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
  Clock,
  Send,
  Loader2,
  Search,
  UserPlus,
  Trash2,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { adminService, AdminUserListItem } from '@/services/admin.service';
import { staffInvitationService, StaffInvitation, SearchedCustomer } from '@/services/staffInvitation.service';
import { toast } from 'sonner';

export function StaffManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [staffList, setStaffList] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Invitations state
  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(false);

  // Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteIdentifier, setInviteIdentifier] = useState('');
  const [inviteRole, setInviteRole] = useState('sales_staff');
  const [inviteNotes, setInviteNotes] = useState('');
  const [submittingInvite, setSubmittingInvite] = useState(false);

  // Customer Autocomplete inside modal
  const [searchedUsers, setSearchedUsers] = useState<SearchedCustomer[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<SearchedCustomer | null>(null);

  const fetchStaffAndInvitations = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, invitesRes] = await Promise.all([
        adminService.listUsers(),
        staffInvitationService.getSentInvitations().catch(() => []),
      ]);

      const staffOnly = (usersRes.users || []).filter((u) => u.role !== 'customer');
      setStaffList(staffOnly);
      setInvitations(invitesRes || []);
    } catch (err: any) {
      console.error('Failed to load staff list:', err);
      toast.error(err?.message || (isBn ? 'স্টাফ তালিকা লোড করা যায়নি' : 'Failed to load staff directory'));
    } finally {
      setLoading(false);
    }
  }, [isBn]);

  useEffect(() => {
    fetchStaffAndInvitations();
  }, [fetchStaffAndInvitations]);

  // Autocomplete customer search in invite modal
  useEffect(() => {
    if (!inviteIdentifier.trim() || selectedCustomer) {
      setSearchedUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchingUsers(true);
        const res = await staffInvitationService.searchCustomers(inviteIdentifier.trim());
        setSearchedUsers(res || []);
      } catch (err) {
        console.error('Customer search error:', err);
      } finally {
        setSearchingUsers(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [inviteIdentifier, selectedCustomer]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = selectedCustomer ? selectedCustomer._id : inviteIdentifier.trim();

    if (!identifier) {
      toast.error(isBn ? 'অনুগ্রহ করে গ্রাহকের ফোন বা ইমেইল প্রদান করুন' : 'Please provide customer phone or email');
      return;
    }

    try {
      setSubmittingInvite(true);
      const res = await staffInvitationService.sendInvitation({
        identifier,
        targetRole: inviteRole,
        notes: inviteNotes.trim() || undefined,
      });

      toast.success(
        isBn
          ? `"${res.recipientName || identifier}" কে ${inviteRole.replace(/_/g, ' ')} পদে ইনভাইট পাঠানো হয়েছে!`
          : `Staff invitation sent to "${res.recipientName || identifier}" for role ${inviteRole}!`
      );

      setShowInviteModal(false);
      setInviteIdentifier('');
      setSelectedCustomer(null);
      setInviteNotes('');
      fetchStaffAndInvitations();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ইনভাইট পাঠাতে ব্যর্থ হয়েছে' : 'Failed to send invitation'));
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleCancelInvite = async (invitationId: string) => {
    try {
      await staffInvitationService.cancelInvitation(invitationId);
      toast.success(isBn ? 'ইনভাইটেশন বাতিল করা হয়েছে' : 'Invitation cancelled');
      fetchStaffAndInvitations();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to cancel invitation');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      await adminService.updateUserStatus(id, newStatus);
      toast.success(isBn ? 'স্টাফ স্ট্যাটাস পরিবর্তন করা হয়েছে' : 'Staff status updated');
      fetchStaffAndInvitations();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  const pendingInvitations = invitations.filter((i) => i.status === 'pending');

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-500/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isBn ? 'স্টাফ ও পারমিশন কন্ট্রোল' : 'Role-Based Access Control (RBAC)'}</span>
          </span>
          <h2 className="text-xl font-black text-foreground font-serif-title mt-1.5">
            {isBn ? 'ফার্মেসি স্টাফ ও অ্যাক্সেস রোলস' : 'Staff Accounts & Staff Promotion'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'সেলস স্টাফ, ফার্মাসিস্ট ও ইনভেন্টরি ম্যানেজারদের অ্যাকাউন্ট পরিচালনা ও সাধারণ গ্রাহককে স্টাফ পদে প্রমোশন দিন'
              : 'Manage pharmacy staff accounts, assign specific roles, or promote customers to sales staff.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCustomer(null);
              setInviteIdentifier('');
              setShowInviteModal(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-primary-dark transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isBn ? 'গ্রাহককে স্টাফ ইনভাইট দিন' : 'Invite / Promote Customer'}</span>
          </button>

          <button
            type="button"
            onClick={fetchStaffAndInvitations}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{isBn ? 'রিফ্রেশ' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Pending Invitations Section (If any) */}
      {pendingInvitations.length > 0 && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-amber-900 flex items-center gap-2 uppercase tracking-wider">
              <Clock className="h-4 w-4 text-amber-700" />
              <span>{isBn ? 'অপেক্ষমাণ স্টাফ ইনভাইটেশনসমূহ' : 'Pending Staff Promotion Requests'}</span>
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] text-amber-900 font-bold">
                {pendingInvitations.length}
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingInvitations.map((inv) => (
              <div
                key={inv._id}
                className="flex items-center justify-between p-3 rounded-2xl border border-amber-200 bg-white shadow-2xs text-xs"
              >
                <div>
                  <p className="font-extrabold text-foreground">{inv.recipientName || inv.recipient?.name || 'Customer'}</p>
                  <p className="text-[11px] text-muted-foreground">{inv.recipientPhone || inv.recipientEmail || inv.recipient?.email}</p>
                  <span className="inline-block mt-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-black text-indigo-700 border border-indigo-200 uppercase">
                    Role: {inv.targetRole.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
                    Pending
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCancelInvite(inv._id)}
                    className="p-1.5 rounded-xl text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                    title={isBn ? 'ইনভাইট বাতিল করুন' : 'Cancel invitation'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff List Table */}
      <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-xs">
        <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <h3 className="text-sm font-black text-foreground font-serif-title">
            {isBn ? 'সক্রিয় ফার্মেসি স্টাফ অ্যাকাউন্টস' : 'Active Staff Team Members'}
          </h3>
          <span className="text-xs font-bold text-muted-foreground">
            {staffList.length} {isBn ? 'জন সদস্য' : 'members'}
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3.5 px-4">Staff Name & Email</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4">Account Status</th>
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
                    {isBn ? 'কোনো স্টাফ অ্যাকাউন্ট নিবন্ধিত নেই।' : 'No staff accounts found.'}
                  </td>
                </tr>
              ) : (
                staffList.map((st) => (
                  <tr key={st.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-sm">{st.name}</span>
                        <span className="text-[11px] text-muted-foreground">{st.email || st.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary uppercase">
                        {st.role.replace(/_/g, ' ')}
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

      {/* Staff Promotion / Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <h3 className="text-base font-black text-foreground font-serif-title">
                  {isBn ? 'গ্রাহককে স্টাফ পদে প্রমোশন / ইনভাইট দিন' : 'Invite / Promote to Staff'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-3.5 text-xs">
              {/* Customer Search / Input */}
              <div className="space-y-1 relative">
                <label className="block font-bold text-muted-foreground">
                  {isBn ? 'গ্রাহকের ফোন নম্বর বা ইমেইল খুঁজুন:' : 'Search Customer by Phone / Email:'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={selectedCustomer ? `${selectedCustomer.name} (${selectedCustomer.phone || selectedCustomer.email})` : inviteIdentifier}
                    onChange={(e) => {
                      setSelectedCustomer(null);
                      setInviteIdentifier(e.target.value);
                    }}
                    required
                    placeholder="e.g. 01712345678 or user@gmail.com"
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-3 text-xs font-semibold text-foreground focus:border-primary focus:outline-hidden"
                  />
                  {searchingUsers && (
                    <Loader2 className="absolute right-3 top-2.5 h-3.5 w-3.5 animate-spin text-primary" />
                  )}
                </div>

                {/* Autocomplete dropdown */}
                {searchedUsers.length > 0 && !selectedCustomer && (
                  <div className="absolute z-10 w-full mt-1 rounded-2xl border border-border bg-background p-2 shadow-xl max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                    {searchedUsers.map((u) => (
                      <div
                        key={u._id}
                        onClick={() => {
                          setSelectedCustomer(u);
                          setSearchedUsers([]);
                        }}
                        className="p-2 rounded-xl hover:bg-muted/40 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground">{u.phone || u.email}</p>
                        </div>
                        <span className="text-[10px] font-black text-primary capitalize">{u.role}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-bold mb-1 text-muted-foreground">
                  {isBn ? 'স্টাফ পদবী / রোল নির্বাচন করুন:' : 'Assign Staff Role:'}
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background p-3 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
                >
                  <option value="sales_staff">Sales Staff (POS Counter Terminal)</option>
                  <option value="inventory_manager">Inventory Manager (Batches & FEFO)</option>
                  <option value="pharmacist">Pharmacist (Clinical & POS)</option>
                  <option value="pharmacist_verifier">Pharmacist Verifier (Rx Queue)</option>
                  <option value="order_manager">Order Manager (Order Status)</option>
                  <option value="marketing_editor">Marketing Editor (Coupons & Banners)</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block font-bold mb-1 text-muted-foreground">
                  {isBn ? 'অভ্যন্তরীণ নোট (ঐচ্ছিক):' : 'Internal Department Note (Optional):'}
                </label>
                <input
                  type="text"
                  value={inviteNotes}
                  onChange={(e) => setInviteNotes(e.target.value)}
                  placeholder={isBn ? 'যেমন: মেইন ব্রাঞ্চ কাউন্টার শিফট' : 'e.g. Assigned to Main Store counter'}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-xl border border-border px-4 py-2 font-bold text-muted-foreground hover:bg-muted"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submittingInvite}
                  className="rounded-xl bg-primary px-5 py-2 font-extrabold text-white shadow-xs hover:bg-primary-dark cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submittingInvite && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isBn ? 'ইনভাইট পাঠান' : 'Send Invite'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
