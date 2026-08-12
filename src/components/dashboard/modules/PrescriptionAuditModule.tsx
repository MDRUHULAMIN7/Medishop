'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Calendar,
  Stethoscope,
  Eye,
  X,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { PrescriptionService, PrescriptionItem } from '@/services/prescription.service';

interface PrescriptionAuditModuleProps {
  isBn?: boolean;
}

export function PrescriptionAuditModule({ isBn = true }: PrescriptionAuditModuleProps) {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [rejectionModalId, setRejectionModalId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Fetch Queue from Backend API
  const { data: rxList = [], isLoading } = useQuery({
    queryKey: ['pharmacist-prescription-queue', selectedStatus],
    queryFn: () => PrescriptionService.getPrescriptionQueue(selectedStatus === 'all' ? undefined : selectedStatus),
  });

  // Review Mutation
  const reviewMutation = useMutation({
    mutationFn: ({ id, status, rejectionReason }: { id: string; status: 'approved' | 'rejected'; rejectionReason?: string }) =>
      PrescriptionService.reviewPrescription(id, status, rejectionReason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pharmacist-prescription-queue'] });
      if (variables.status === 'approved') {
        toast.success(isBn ? 'প্রেসক্রিপশনটি ভেরিফাইড ও অনুমোদন করা হয়েছে!' : 'Prescription verified & approved successfully!');
      } else {
        toast.error(isBn ? 'প্রেসক্রিপশনটি বাতিল করা হয়েছে' : 'Prescription rejected');
      }
      setRejectionModalId(null);
      setRejectionReasonInput('');
    },
    onError: (err: any) => {
      toast.error(err?.message || (isBn ? 'প্রেসক্রিপশন রিভিউ করতে ব্যর্থ হয়েছে' : 'Failed to review prescription'));
    },
  });

  const handleApprove = (id: string) => {
    reviewMutation.mutate({ id, status: 'approved' });
  };

  const handleConfirmReject = () => {
    if (!rejectionModalId) return;
    if (!rejectionReasonInput.trim()) {
      toast.error(isBn ? 'দয়া করে বাতিলের কারণ উল্লেখ করুন' : 'Please provide a rejection reason');
      return;
    }
    reviewMutation.mutate({ id: rejectionModalId, status: 'rejected', rejectionReason: rejectionReasonInput.trim() });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 border border-sky-200">
            <Stethoscope className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-foreground font-serif-title">
              {isBn ? 'ফার্মাসিস্ট প্রেসক্রিপশন অডিট ও ভেরিফিকেশন' : 'Rx Prescription Verification Queue'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isBn
                ? 'পেশেন্টের আপলোডকৃত ডাক্তারের প্রেসক্রিপশন রিভিউ ও ভ্যালিডেশন'
                : 'Review uploaded doctor prescriptions and verify customer orders'}
            </p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-muted/30 p-1">
          {['pending', 'approved', 'rejected', 'all'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize cursor-pointer transition-all ${
                selectedStatus === st
                  ? 'bg-background text-primary shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : rxList.length === 0 ? (
        <div className="rounded-3xl border border-border bg-background p-10 text-center space-y-2">
          <p className="text-sm font-bold text-foreground">
            {isBn ? 'কোনো প্রেসক্রিপশন অডিটে অপেক্ষমাণ নেই' : 'No prescriptions in review queue'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rxList.map((rx: PrescriptionItem) => {
            const isPending = rx.status === 'pending';
            const isApproved = rx.status === 'approved';

            return (
              <div
                key={rx.id || (rx as any)._id}
                className="rounded-3xl border border-border bg-background p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-foreground">
                      <FileText className="h-4 w-4 text-primary" />
                      <span>Rx ID: {rx.id || (rx as any)._id}</span>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border ${
                        isPending
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : isApproved
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5 font-bold text-foreground">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>Customer: {rx.user?.name || 'Customer'} ({rx.user?.phone || 'N/A'})</span>
                    </p>
                    <p className="text-xs font-medium text-foreground bg-muted/30 p-2 rounded-xl">
                      {rx.note || (isBn ? 'কোনো নোট দেওয়া হয়নি' : 'No instructions')}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px]">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Submitted: {new Date(rx.createdAt).toLocaleString()}</span>
                    </p>
                  </div>

                  {/* Image Thumbnails */}
                  {rx.images && rx.images.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      {rx.images.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setPreviewImageUrl(imgUrl)}
                          className="h-14 w-14 rounded-xl border border-border overflow-hidden relative group cursor-pointer shrink-0"
                        >
                          <img src={imgUrl} alt="Rx" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                            <Eye className="h-4 w-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                  {isPending ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setRejectionModalId(rx.id || (rx as any)._id)}
                        disabled={reviewMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>{isBn ? 'বাতিল' : 'Reject'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(rx.id || (rx as any)._id)}
                        disabled={reviewMutation.isPending}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{isBn ? 'অনুমোদন' : 'Approve & Verify'}</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-extrabold text-muted-foreground italic">
                      {isApproved ? 'Verified & Approved' : `Rejected (${rx.rejectionReason || 'Invalid'})`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Modal */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-3xl w-full rounded-3xl bg-background p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h3 className="text-sm font-bold text-foreground">{isBn ? 'প্রেসক্রিপশন ইমেজ প্রিভিউ' : 'Prescription Image Preview'}</h3>
              <button
                type="button"
                onClick={() => setPreviewImageUrl(null)}
                className="rounded-full p-1 hover:bg-muted text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto flex items-center justify-center rounded-2xl bg-muted/20 p-2">
              <img src={previewImageUrl} alt="Rx Full" className="max-w-full h-auto rounded-xl object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectionModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative max-w-md w-full rounded-3xl bg-background p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-foreground">
              {isBn ? 'প্রেসক্রিপশন বাতিলের কারণ লিখুন' : 'Provide Rejection Reason'}
            </h3>
            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder={isBn ? 'যেমন: প্রেসক্রিপশনের মেয়াদের তারিখ বোঝা যাচ্ছে না...' : 'e.g. Image too blurry, or prescription expired...'}
              className="w-full rounded-2xl border border-border bg-background p-3 text-xs focus:border-primary focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalId(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={reviewMutation.isPending}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-50"
              >
                {isBn ? 'কনফার্ম রিজেক্ট' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

