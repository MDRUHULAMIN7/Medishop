'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser } from '@/store/slices/authSlice';
import { staffInvitationService, StaffInvitation } from '@/services/staffInvitation.service';
import { Sparkles, ShieldCheck, CheckCircle2, X, Loader2, ArrowRight, Store } from 'lucide-react';
import { toast } from 'sonner';

import { setAccessToken } from '@/lib/apiClient';

interface CustomerStaffInvitationBannerProps {
  isBn?: boolean;
}

export function CustomerStaffInvitationBanner({ isBn = true }: CustomerStaffInvitationBannerProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const fetchMyInvitations = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await staffInvitationService.getMyInvitations();
      setInvitations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch pending staff invitations:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchMyInvitations();
  }, [fetchMyInvitations]);

  const handleAccept = async (invitation: StaffInvitation) => {
    try {
      setRespondingId(invitation._id);
      const res = await staffInvitationService.acceptInvitation(invitation._id);

      if (res.accessToken) {
        setAccessToken(res.accessToken);
      }

      if (res.user) {
        dispatch(setUser(res.user));
      }

      toast.success(
        isBn
          ? `অভিনন্দন! আপনি সফলভাবে "${invitation.targetRole.replace(/_/g, ' ')}" পদে যোগদান করেছেন।`
          : `Congratulations! You have accepted the invitation as "${invitation.targetRole}".`
      );

      // Target route based on accepted role
      if (invitation.targetRole === 'sales_staff') {
        router.push('/dashboard/sales');
      } else if (invitation.targetRole === 'inventory_manager') {
        router.push('/dashboard/inventory');
      } else if (invitation.targetRole === 'pharmacist' || invitation.targetRole === 'pharmacist_verifier') {
        router.push('/dashboard/pharmacist');
      } else {
        router.push('/dashboard/admin');
      }
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'ইনভাইটেশন গ্রহণ করা যায়নি' : 'Failed to accept invitation'));
      setRespondingId(null);
    }
  };

  const handleDecline = async (invitationId: string) => {
    try {
      setRespondingId(invitationId);
      await staffInvitationService.declineInvitation(invitationId);
      toast.info(isBn ? 'ইনভাইটেশন প্রত্যাখ্যান করা হয়েছে' : 'Invitation declined');
      setInvitations((prev) => prev.filter((i) => i._id !== invitationId));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to decline invitation');
    } finally {
      setRespondingId(null);
    }
  };

  if (invitations.length === 0) return null;

  return (
    <div className="space-y-3">
      {invitations.map((inv) => (
        <div
          key={inv._id}
          className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 p-5 shadow-lg backdrop-blur-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
                  {isBn ? 'স্টাফ প্রমোশন অফার' : 'Staff Promotion Offer'}
                </span>
                <span className="text-[11px] text-muted-foreground font-semibold">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-base font-black text-foreground font-serif-title mt-1">
                {isBn
                  ? `এডমিন আপনাকে "${inv.targetRole === 'sales_staff' ? 'সেলস স্টাফ' : inv.targetRole.replace(/_/g, ' ')}" পদে যোগদানের আমন্ত্রণ পাঠিয়েছেন!`
                  : `Admin has invited you to join the team as "${inv.targetRole.replace(/_/g, ' ')}"!`}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {inv.notes || (isBn ? 'আমন্ত্রণ গ্রহণ করে অবিলম্বে সেলস টার্মিনাল ও কাউন্টার ড্যাশবোর্ডে প্রবেশ করুন।' : 'Accept this invitation to access staff POS counter portal.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={respondingId === inv._id}
              onClick={() => handleDecline(inv._id)}
              className="rounded-2xl border border-border bg-background/80 hover:bg-muted px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              {isBn ? 'প্রত্যাখ্যান করুন' : 'Decline'}
            </button>

            <button
              type="button"
              disabled={respondingId === inv._id}
              onClick={() => handleAccept(inv)}
              className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {respondingId === inv._id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>{isBn ? 'স্বীকৃতি দিন ও ড্যাশবোর্ডে প্রবেশ করুন' : 'Accept & Enter Portal'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
