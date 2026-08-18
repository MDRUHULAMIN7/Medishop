'use client';

import React, { useState } from 'react';
import { useAppSelector } from '@/store';
import { OrderManager } from '@/components/dashboard/OrderManager';
import { CustomerStaffInvitationBanner } from '@/components/dashboard/CustomerStaffInvitationBanner';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { PackageCheck, FileText, Trash2, FileUp } from 'lucide-react';

export default function CustomerDashboardPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const { prescriptions, deletePrescription } = usePrescriptions();
  const [tab, setTab] = useState<'orders' | 'prescriptions'>('orders');

  return (
    <div className="space-y-6">
      {/* Staff Promotion Invitation Banner */}
      <CustomerStaffInvitationBanner isBn={isBn} />

      {/* Tab bar */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setTab('orders')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            tab === 'orders'
              ? 'bg-primary text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <PackageCheck className="h-4 w-4" />
          <span>{isBn ? 'আমার অর্ডারস' : 'My Orders'}</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('prescriptions')}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold cursor-pointer transition-all ${
            tab === 'prescriptions'
              ? 'bg-primary text-white shadow-md'
              : 'bg-background border border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>{isBn ? 'আমার প্রেসক্রিপশন সমূহ' : 'My Prescriptions'}</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black">
            {prescriptions.length}
          </span>
        </button>
      </div>

      {tab === 'orders' ? (
        <OrderManager />
      ) : (
        <div className="rounded-3xl border border-border bg-background p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="text-base font-bold text-foreground font-serif-title">
              {isBn ? 'আপনার আপলোড করা প্রেসক্রিপশন ফাইলস' : 'Your Uploaded Prescription Files'}
            </h3>
          </div>

          {prescriptions.length === 0 ? (
            <div className="text-center py-12 text-xs font-bold text-muted-foreground">
              {isBn ? 'কোনো প্রেসক্রিপশন সংরক্ষিত নেই' : 'No prescriptions uploaded yet'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">{rx.title}</h4>
                        <p className="text-[11px] text-muted-foreground">{rx.doctorName}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deletePrescription(rx.id)}
                      className="text-muted-foreground hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
