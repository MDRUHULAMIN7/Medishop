'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  X,
  User,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { prescriptionService, PrescriptionItem } from '@/services/prescription.service';
import { toast } from 'sonner';
import { exportRowsToExcel } from '@/lib/excelExport';
import { ExportExcelButton } from '@/components/dashboard/ExportExcelButton';

export function PrescriptionQueue() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [queue, setQueue] = useState<PrescriptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');

  const [selectedRx, setSelectedRx] = useState<PrescriptionItem | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewing, setReviewing] = useState(false);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const filter = statusFilter === 'all' ? undefined : statusFilter;
      const data = await prescriptionService.getPrescriptionQueue(filter);
      const list = Array.isArray(data) ? data : [];
      setQueue(list);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load prescription queue');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !rejectionReason.trim()) {
      toast.error(isBn ? 'বাতিল করার কারণ উল্লেখ করুন' : 'Please provide a rejection reason');
      return;
    }

    setReviewing(true);
    try {
      await prescriptionService.reviewPrescription(id, {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason.trim() : undefined,
      });

      toast.success(
        status === 'approved'
          ? isBn
            ? 'প্রেসক্রিপশন সফলভাবে ভেরিফাই ও অ্যাপ্রুভ করা হয়েছে!'
            : 'Prescription approved successfully!'
          : isBn
          ? 'প্রেসক্রিপশন বাতিল করা হয়েছে'
          : 'Prescription rejected'
      );

      setSelectedRx(null);
      setRejectionReason('');
      fetchQueue();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to review prescription');
    } finally {
      setReviewing(false);
    }
  };

  const handleExport = () => {
    exportRowsToExcel({ filename: `medishop-prescriptions-${new Date().toISOString().slice(0, 10)}`, sheets: [{ name: 'Prescriptions', rows: queue.map((prescription) => ({ Customer: prescription.user?.name || '', Phone: prescription.user?.phone || '', Status: prescription.status, Date: new Date(prescription.createdAt), 'Rejection Reason': prescription.rejectionReason || '' })) }] });
    toast.success('Prescriptions exported to Excel');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
            <FileText className="h-3.5 w-3.5" />
            <span>{isBn ? 'ফার্মাসিস্ট ভেরিফিকেশন প্যানেল' : 'Registered Pharmacist Queue'}</span>
          </span>
          <h2 className="text-xl font-extrabold text-foreground mt-1">
            {isBn ? 'প্রেসক্রিপশন ভেরিফিকেশন কিউ' : 'Prescription Review Queue'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'গ্রাহকদের আপলোডকৃত প্রেসক্রিপশন নিরীক্ষা করুন, ভ্যালিডিটি যাচাই করে অনুমোদন দিন'
              : 'Review customer uploaded prescriptions, verify validity, and update order statuses.'}
          </p>
        </div>

        <div className="flex items-center gap-3"><ExportExcelButton onClick={handleExport} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="pending">PENDING ({isBn ? 'রিভিউ বাকি' : 'Pending'})</option>
            <option value="approved">APPROVED ({isBn ? 'অনুমোদিত' : 'Approved'})</option>
            <option value="rejected">REJECTED ({isBn ? 'বাতিল' : 'Rejected'})</option>
            <option value="all">ALL ({isBn ? 'সকল' : 'All'})</option>
          </select>

        </div>
      </div>

      {/* Queue Grid View */}
      {loading ? (
        <div className="flex justify-center items-center py-16 text-xs text-muted-foreground gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <span>{isBn ? 'প্রেসক্রিপশন লোড হচ্ছে...' : 'Loading prescription queue...'}</span>
        </div>
      ) : queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-3xl bg-background text-muted-foreground">
          <FileText className="h-12 w-12 text-muted-foreground/30 mb-2" />
          <p className="text-sm font-bold text-foreground">
            {isBn ? 'কোনো পেন্ডিং প্রেসক্রিপশন নেই' : 'No prescriptions in this queue'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {isBn ? 'সব আপলোডকৃত প্রেসক্রিপশন ভেরিফাই সম্পন্ন করা হয়েছে' : 'All uploaded prescriptions have been reviewed.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {queue.map((rx) => (
            <div
              key={rx.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-background p-4 shadow-2xs hover:border-primary/40 transition-all space-y-3"
            >
              {/* Rx Thumbnail */}
              <div
                onClick={() => setPreviewImage(rx.images[0])}
                className="relative h-44 w-full overflow-hidden rounded-xl bg-muted/40 border border-border cursor-pointer group"
              >
                <img
                  src={rx.images[0]}
                  alt="Prescription"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5">
                  <Eye className="h-4 w-4" />
                  <span>{isBn ? 'ফুলভিউ দেখুন' : 'Click to View'}</span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {rx.user?.name || 'Customer'}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                      rx.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rx.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800 animate-pulse'
                    }`}
                  >
                    {rx.status}
                  </span>
                </div>

                <p className="text-muted-foreground text-[11px] flex items-center gap-1">
                  <Phone className="h-3 w-3 text-sky-600" />
                  {rx.user?.phone || 'No phone'}
                </p>

                <p className="text-muted-foreground text-[10px] flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(rx.createdAt).toLocaleString(isBn ? 'bn-BD' : 'en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedRx(rx)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <Eye className="h-3.5 w-3.5 text-primary" />
                  <span>{isBn ? 'রিভিউ করুন' : 'Review Rx'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Review Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-xs font-bold text-primary uppercase">Prescription Verification</span>
                <h3 className="text-lg font-extrabold text-foreground">
                  Submitted by {selectedRx.user?.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRx(null)}
                className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-72 rounded-2xl border border-border overflow-hidden bg-black/90 flex items-center justify-center">
                <img
                  src={selectedRx.images[0]}
                  alt="Prescription"
                  className="max-h-full max-w-full object-contain cursor-pointer"
                  onClick={() => setPreviewImage(selectedRx.images[0])}
                />
              </div>

              <div className="space-y-4 text-xs">
                <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                  <p className="font-bold text-foreground">Patient Information:</p>
                  <p><span className="text-muted-foreground">Name:</span> {selectedRx.user?.name}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedRx.user?.phone}</p>
                  <p><span className="text-muted-foreground">Submitted At:</span> {new Date(selectedRx.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Rejection Reason (Required only if rejecting):
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="E.g., Doctor signature missing, prescription expired, or unreadable image..."
                    className="w-full rounded-2xl border border-border bg-background p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    disabled={reviewing}
                    onClick={() => handleReview(selectedRx.id, 'rejected')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>{isBn ? 'বাতিল করুন' : 'Reject Rx'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={reviewing}
                    onClick={() => handleReview(selectedRx.id, 'approved')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isBn ? 'অনুমোদন দিন' : 'Approve Rx'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High-Res Image Preview Lightbox */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={previewImage}
              alt="Prescription High Res"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
