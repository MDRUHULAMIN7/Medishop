'use client';

import React, { useState } from 'react';
import { CreditCard, CheckCircle2, RefreshCw, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';

interface TransactionItem {
  id: string;
  trxId: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Card' | 'COD';
  status: 'SUCCESS' | 'PENDING' | 'REFUNDED';
  date: string;
}

export function PaymentManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [transactions, setTransactions] = useState<TransactionItem[]>([
    {
      id: 'tx-101',
      trxId: 'BK89012399',
      orderId: 'MS-8901',
      customerName: 'তানভীর আহমেদ',
      amount: 450,
      method: 'bKash',
      status: 'SUCCESS',
      date: '2026-08-03 12:30 PM',
    },
    {
      id: 'tx-102',
      trxId: 'NG77102911',
      orderId: 'MS-8900',
      customerName: 'রাফিয়া সুলতানা',
      amount: 1450,
      method: 'Nagad',
      status: 'SUCCESS',
      date: '2026-08-03 11:45 AM',
    },
    {
      id: 'tx-103',
      trxId: 'COD-PENDING',
      orderId: 'MS-8899',
      customerName: 'মাহমুদুল হাসান',
      amount: 320,
      method: 'COD',
      status: 'PENDING',
      date: '2026-08-03 10:15 AM',
    },
  ]);

  const handleRefund = (trxId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.trxId === trxId ? { ...t, status: 'REFUNDED' } : t))
    );
    toast.success(
      isBn
        ? `লেনদেন ${trxId} এর রিফান্ড প্রসেস সম্পন্ন হয়েছে`
        : `Transaction ${trxId} refund processed successfully`
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'পেমেন্ট গেটওয়ে ও রিফান্ড ম্যানেজমেন্ট' : 'Payment & Transaction Logs'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'বিকাশ, নগদ, রকেট ও অনলাইন পেমেন্ট ট্রানজেকশন নিরীক্ষণ করুন'
              : 'Monitor bKash, Nagad, Rocket, Card transactions and issue refunds'}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Trx ID & Order</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground">
                    <div className="flex flex-col">
                      <span className="font-mono text-primary text-sm">{tx.trxId}</span>
                      <span className="text-[11px] text-muted-foreground">Order: {tx.orderId}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-bold text-foreground">
                    {tx.customerName}
                  </td>

                  <td className="py-3 px-4 font-semibold text-foreground">
                    {tx.method}
                  </td>

                  <td className="py-3 px-4 font-black text-foreground text-sm">
                    {formatBDT(tx.amount)}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        tx.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.status === 'REFUNDED'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {tx.status === 'SUCCESS' && (
                      <button
                        onClick={() => handleRefund(tx.trxId)}
                        className="rounded-xl border border-border px-3 py-1 text-xs font-bold text-danger hover:bg-danger-light/30 transition-colors"
                      >
                        Issue Refund
                      </button>
                    )}
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
