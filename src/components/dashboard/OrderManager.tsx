'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Copy,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';

interface OrderRecord {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  address: string;
  itemsCount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  orderStatus: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export function OrderManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [orders, setOrders] = useState<OrderRecord[]>([
    {
      id: 'MS-8901',
      trackingCode: 'BD-EXP-2026-8901',
      customerName: 'তানভীর আহমেদ',
      customerPhone: '+880 1712-345678',
      address: 'House 12, Road 4, Sector 7, Uttara, Dhaka',
      itemsCount: 3,
      totalAmount: 450,
      paymentMethod: 'bKash Online',
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      createdAt: '2026-08-03 12:30 PM',
    },
    {
      id: 'MS-8900',
      trackingCode: 'BD-EXP-2026-8900',
      customerName: 'রাফিয়া সুলতানা',
      customerPhone: '+880 1819-876543',
      address: 'Block A, Mirpur 10, Dhaka',
      itemsCount: 1,
      totalAmount: 1450,
      paymentMethod: 'Nagad Gateway',
      paymentStatus: 'PAID',
      orderStatus: 'SHIPPED',
      createdAt: '2026-08-03 11:45 AM',
    },
    {
      id: 'MS-8899',
      trackingCode: 'BD-EXP-2026-8899',
      customerName: 'মাহমুদুল হাসান',
      customerPhone: '+880 1911-223344',
      address: 'Kalyanpur Main Road, Dhaka',
      itemsCount: 2,
      totalAmount: 320,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'UNPAID',
      orderStatus: 'PENDING',
      createdAt: '2026-08-03 10:15 AM',
    },
    {
      id: 'MS-8898',
      trackingCode: 'BD-EXP-2026-8898',
      customerName: 'সাবরিনা ইয়াছমিন',
      customerPhone: '+880 1678-990011',
      address: 'Dhanmondi 32, Dhaka',
      itemsCount: 4,
      totalAmount: 1890,
      paymentMethod: 'Visa Card',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      createdAt: '2026-08-02 04:20 PM',
    },
  ]);

  const handleUpdateOrderStatus = (id: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o))
    );
    toast.success(
      isBn
        ? `অর্ডার ${id} স্ট্যাটাস পরিবর্তন করা হয়েছে: ${newStatus}`
        : `Order ${id} status updated to ${newStatus}`
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus =
      statusFilter === 'ALL' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'অর্ডার প্রসেসিং ও ডেলিভারি ট্র্যাকিং' : 'Order & Logistics Manager'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'অর্ডার প্রসেসিং, ট্র্যাকিং কোড এসাইন এবং স্ট্যাটাস আপডেট করুন'
              : 'Process customer orders, update tracking codes, and manage fulfillment'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isBn
                ? 'অর্ডার ID, ট্র্যাকিং কোড বা গ্রাহকের ফোন নম্বর...'
                : 'Search by Order ID, Tracking Code or Phone Number...'
            }
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
        >
          <option value="ALL">{isBn ? 'সব স্ট্যাটাস' : 'All Statuses'}</option>
          <option value="PENDING">PENDING</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Order ID & Tracking</th>
                <th className="py-3 px-4">Customer & Address</th>
                <th className="py-3 px-4">Amount & Payment</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4 text-right">Update Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-primary sm:text-sm">
                        {order.id}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Truck className="h-3 w-3 text-sky-600" />
                        <span>{order.trackingCode}</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {order.createdAt}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground sm:text-sm">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] font-semibold text-primary">
                        {order.customerPhone}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate max-w-[200px] flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{order.address}</span>
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-black text-foreground text-sm">
                        {formatBDT(order.totalAmount)}
                      </span>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`inline-block mt-1 w-fit rounded-full px-2 py-0.2 text-[9px] font-extrabold ${
                          order.paymentStatus === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-extrabold ${
                        order.orderStatus === 'PENDING'
                          ? 'bg-amber-100 text-amber-800'
                          : order.orderStatus === 'PROCESSING'
                          ? 'bg-blue-100 text-blue-800'
                          : order.orderStatus === 'SHIPPED'
                          ? 'bg-sky-100 text-sky-800'
                          : order.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleUpdateOrderStatus(order.id, e.target.value)
                      }
                      className="rounded-xl border border-border bg-background px-2.5 py-1 text-xs font-bold text-foreground focus:border-primary"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
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
