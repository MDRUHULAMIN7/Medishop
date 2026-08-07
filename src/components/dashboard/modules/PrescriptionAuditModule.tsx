'use client';

import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  Calendar,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import { toast } from 'sonner';

interface PrescriptionAuditModuleProps {
  isBn?: boolean;
}

interface PendingRx {
  id: string;
  patientName: string;
  phone: string;
  rxTitle: string;
  doctorName: string;
  uploadDate: string;
  fileUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_RX_QUEUE: PendingRx[] = [
  {
    id: 'rx-201',
    patientName: 'Kazi Nazmul',
    phone: '01711223344',
    rxTitle: 'Diabetic & Hypertension Routine Prescription',
    doctorName: 'Prof. Dr. M. A. Karim (Cardiologist)',
    uploadDate: '2026-08-06 14:30',
    fileUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
    status: 'PENDING',
  },
  {
    id: 'rx-202',
    patientName: 'Sultana Begum',
    phone: '01899887766',
    rxTitle: 'Antibiotic Therapy Schedule',
    doctorName: 'Dr. Rehana Parvin (Medicine Specialist)',
    uploadDate: '2026-08-06 16:15',
    fileUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop',
    status: 'PENDING',
  },
];

export function PrescriptionAuditModule({ isBn = true }: PrescriptionAuditModuleProps) {
  const [rxList, setRxList] = useState<PendingRx[]>(INITIAL_RX_QUEUE);

  const handleApprove = (id: string) => {
    setRxList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'APPROVED' } : item))
    );
    toast.success(
      isBn
        ? 'প্রেসক্রিপশনটি ভেরিফাইড ও অনুমোদন করা হয়েছে!'
        : 'Prescription verified and approved successfully!'
    );
  };

  const handleReject = (id: string) => {
    setRxList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'REJECTED' } : item))
    );
    toast.error(
      isBn ? 'প্রেসক্রিপশনটি রিজেক্ট করা হয়েছে' : 'Prescription rejected'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xs">
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
                ? 'পেশেন্টের আপলোডকৃত ডাক্তারের প্রেসক্রিপশন রিভিউ, ওটিসি ডোজ ভ্যালিডেশন ও ডিজিটাল সিগনেচার'
                : 'Review uploaded doctor prescriptions, check OTC dosage compliance and digitally sign orders'}
            </p>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rxList.map((rx) => {
          const isPending = rx.status === 'PENDING';
          const isApproved = rx.status === 'APPROVED';

          return (
            <div
              key={rx.id}
              className="rounded-3xl border border-border bg-background p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-foreground">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{rx.rxTitle}</span>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-black border ${
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

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 font-bold text-foreground">
                    <User className="h-3.5 w-3.5 text-primary" />
                    <span>Patient: {rx.patientName} ({rx.phone})</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-medium">
                    <Stethoscope className="h-3.5 w-3.5 text-sky-600" />
                    <span>Doctor: {rx.doctorName}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Uploaded: {rx.uploadDate}</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                {isPending ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReject(rx.id)}
                      className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>{isBn ? 'বাতিল (Reject)' : 'Reject'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(rx.id)}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{isBn ? 'অনুমোদন (Approve)' : 'Approve & Verify'}</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-extrabold text-muted-foreground italic">
                    {isApproved ? 'Verified by Pharmacist' : 'Rejected by Pharmacist'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
