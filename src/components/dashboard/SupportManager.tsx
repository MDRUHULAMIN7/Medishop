'use client';

import React, { useState } from 'react';
import { Headphones, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

interface TicketItem {
  id: string;
  customerName: string;
  phone: string;
  subject: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  date: string;
}

export function SupportManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [tickets, setTickets] = useState<TicketItem[]>([
    {
      id: 'TKT-401',
      customerName: 'কামরুল ইসলাম',
      phone: '+880 1711-009988',
      subject: 'প্রেসক্রিপশন ওষুধের বিকল্প ব্র্যান্ড পরামর্শ চাই',
      priority: 'HIGH',
      status: 'OPEN',
      date: '2026-08-03 12:10 PM',
    },
    {
      id: 'TKT-400',
      customerName: 'সুমাইয়া সুলতানা',
      phone: '+880 1822-334455',
      subject: 'ডেলিভারি ট্র্যাকিং সমস্যা',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      date: '2026-08-02 05:30 PM',
    },
  ]);

  const handleStatusChange = (id: string, newStatus: any) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    toast.success(isBn ? 'টিকিট স্ট্যাটাস আপডেট হয়েছে' : 'Support ticket status updated');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'কাস্টমার সাপোর্ট ও হেল্পডেস্ক' : 'Support Tickets & Helpdesk'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'গ্রাহকের কল, চ্যাট ও ইনকোয়ারি রেসপন্স ইনবক্স'
              : 'Customer support inquiries, pharmacy advice, and ticket status'}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Customer Info</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-primary">{t.id}</td>
                  <td className="py-3 px-4 font-bold text-foreground">
                    <div>
                      <span>{t.customerName}</span>
                      <span className="block text-[11px] font-normal text-muted-foreground">{t.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground max-w-[220px]">
                    {t.subject}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold ${
                        t.priority === 'HIGH'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        t.status === 'OPEN'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={t.status}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      className="rounded-xl border border-border bg-background px-2.5 py-1 text-xs font-bold text-foreground"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="IN_PROGRESS">IN_PROGRESS</option>
                      <option value="RESOLVED">RESOLVED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
