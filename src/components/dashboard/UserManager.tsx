'use client';

import React, { useState } from 'react';
import { Users, Shield, UserCheck, ShieldAlert, UserX } from 'lucide-react';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

interface UserRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: 'SUPER_ADMIN' | 'PHARMACIST' | 'CUSTOMER';
  status: 'ACTIVE' | 'BLOCKED';
  joinedDate: string;
}

export function UserManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'u-1',
      name: 'এডমিন তানভীর আহমেদ',
      phone: '+880 1742-643763',
      email: 'admin@medishop.com.bd',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      joinedDate: '2025-01-10',
    },
    {
      id: 'u-2',
      name: 'ডঃ ফার্মাসিস্ট সাইফুর রহমান',
      phone: '+880 1812-998877',
      email: 'rx@medishop.com.bd',
      role: 'PHARMACIST',
      status: 'ACTIVE',
      joinedDate: '2025-03-15',
    },
    {
      id: 'u-3',
      name: 'মাহমুদুল হাসান',
      phone: '+880 1911-223344',
      email: 'mahmud@gmail.com',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      joinedDate: '2026-02-01',
    },
  ]);

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' }
          : u
      )
    );
    toast.success(isBn ? 'ইউজার স্ট্যাটাস পরিবর্তন করা হয়েছে' : 'User status toggled');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'ইউজার ডিরেক্টরি ও রোল অ্যাসাইনমেন্ট' : 'User Management Directory'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'গ্রাহক, ফার্মাসিস্ট ও এডমিন একাউন্ট রোল নিয়ন্ত্রণ করুন'
              : 'Manage customer accounts, pharmacist roles, and admin access'}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground sm:text-sm">
                    {u.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-primary block">{u.phone}</span>
                    <span className="text-[11px] text-muted-foreground">{u.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'PHARMACIST'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{u.joinedDate}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`rounded-xl border border-border px-3 py-1 text-xs font-bold transition-colors ${
                        u.status === 'ACTIVE'
                          ? 'text-danger hover:bg-danger-light/30'
                          : 'text-success hover:bg-success/20'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Block User' : 'Unblock'}
                    </button>
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
