'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
  Eye,
  RefreshCw,
  X,
  CreditCard,
  User,
  Phone,
  Calendar,
  Check,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';
import { orderService } from '@/services/order.service';

interface OrderItem {
  productId: string;
  name: string;
  dosageForm: string;
  unitType: string;
  image: string;
  unitPrice: number;
  effectiveUnitPrice: number;
  quantity: number;
  totalPrice: number;
  requiresPrescription: boolean;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: {
    recipientName: string;
    phone: string;
    division?: string;
    district: string;
    thana: string;
    addressLine: string;
    postalCode?: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discountTotal: number;
  couponCode?: string;
  couponDiscount: number;
  deliveryCharge: number;
  grandTotal: number;
  prescriptionId?: string | null;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function OrderManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Selected Order Modal
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let queryStr = '';
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') {
        params.append('orderStatus', statusFilter.toLowerCase());
      }
      if (paymentFilter !== 'ALL') {
        params.append('paymentStatus', paymentFilter.toLowerCase());
      }
      queryStr = params.toString();

      const res = await orderService.getAllOrders(queryStr);
      const dataList = Array.isArray(res) ? res : res?.data || res?.orders || [];
      setOrders(dataList);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      toast.error(err?.message || 'Failed to load customer orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateOrderStatus = async (id: string, newOrderStatus: string) => {
    setUpdatingId(id);
    try {
      const updated = await orderService.updateOrderStatus(id, {
        orderStatus: newOrderStatus as any,
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, orderStatus: newOrderStatus as any } : o))
      );

      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newOrderStatus as any } : null));
      }

      toast.success(
        isBn
          ? `অর্ডার #${updated.orderNumber || id} এর স্ট্যাটাস '${newOrderStatus}' করা হয়েছে`
          : `Order #${updated.orderNumber || id} status updated to '${newOrderStatus}'`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdatePaymentStatus = async (id: string, newPaymentStatus: string) => {
    setUpdatingId(id);
    try {
      const updated = await orderService.updateOrderStatus(id, {
        paymentStatus: newPaymentStatus as any,
      });

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, paymentStatus: newPaymentStatus as any } : o))
      );

      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus: newPaymentStatus as any } : null));
      }

      toast.success(
        isBn
          ? `অর্ডার পেমেন্ট স্ট্যাটাস '${newPaymentStatus}' আপডেট হয়েছে`
          : `Payment status updated to '${newPaymentStatus}'`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;

    const matchOrderNum = o.orderNumber?.toLowerCase().includes(q);
    const matchName = o.shippingAddress?.recipientName?.toLowerCase().includes(q);
    const matchPhone = o.shippingAddress?.phone?.includes(q);
    const matchDistrict = o.shippingAddress?.district?.toLowerCase().includes(q);

    return matchOrderNum || matchName || matchPhone || matchDistrict;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground font-serif-title">
            {isBn ? 'অর্ডার ও ডেলিভারি ম্যানেজমেন্ট' : 'Order & Logistics Manager'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'গ্রাহকদের সকল অনলাইন অর্ডার ট্র্যাক করুন, পেমেন্ট স্ট্যাটাস ও লাইফসাইকেল আপডেট করুন'
              : 'Track all customer online orders, advance lifecycle status, and verify payments.'}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{isBn ? 'রিফ্রেশ করুন' : 'Refresh Feed'}</span>
        </button>
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
                ? 'অর্ডার নম্বর, গ্রাহকের নাম বা ফোন নম্বর খুঁজুন...'
                : 'Search by Order #, Customer Name, or Phone...'
            }
            className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="ALL">{isBn ? 'সকল অর্ডার স্ট্যাটাস' : 'All Order Statuses'}</option>
          <option value="pending">PENDING</option>
          <option value="processing">PROCESSING</option>
          <option value="shipped">SHIPPED</option>
          <option value="delivered">DELIVERED</option>
          <option value="cancelled">CANCELLED</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-primary focus:outline-none cursor-pointer"
        >
          <option value="ALL">{isBn ? 'সকল পেমেন্ট স্ট্যাটাস' : 'All Payment Statuses'}</option>
          <option value="pending">PENDING</option>
          <option value="paid">PAID</option>
          <option value="failed">FAILED</option>
          <option value="refunded">REFUNDED</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3.5 px-4">Order Number & Date</th>
                <th className="py-3.5 px-4">Customer & Address</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Order Lifecycle</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                      <span>{isBn ? 'অর্ডার লোড হচ্ছে...' : 'Loading customer orders...'}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground font-semibold">
                    {isBn ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No orders found matching your criteria'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-primary sm:text-sm">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'N/A'}
                          </span>
                        </span>
                        {order.prescriptionId && (
                          <span className="mt-1 inline-flex items-center gap-1 w-fit rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-extrabold text-purple-800">
                            <FileText className="h-2.5 w-2.5" />
                            <span>Prescription Attached</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground sm:text-sm">
                          {order.shippingAddress?.recipientName || 'N/A'}
                        </span>
                        <span className="text-[11px] font-semibold text-primary">
                          {order.shippingAddress?.phone || 'N/A'}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-[220px] flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>
                            {order.shippingAddress?.addressLine}, {order.shippingAddress?.thana},{' '}
                            {order.shippingAddress?.district}
                          </span>
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-black text-foreground text-sm">
                          {formatBDT(order.grandTotal)}
                        </span>
                        <span className="text-[11px] font-medium text-muted-foreground uppercase">
                          {order.paymentMethod}
                        </span>
                        <div className="mt-1 flex items-center gap-1">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase cursor-pointer border-none outline-none ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.paymentStatus === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : order.paymentStatus === 'refunded'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            <option value="pending">PENDING</option>
                            <option value="paid">PAID</option>
                            <option value="failed">FAILED</option>
                            <option value="refunded">REFUNDED</option>
                          </select>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`rounded-xl border border-border px-3 py-1 text-xs font-black uppercase cursor-pointer transition-colors ${
                          order.orderStatus === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : order.orderStatus === 'processing'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : order.orderStatus === 'shipped'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : order.orderStatus === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="pending">PENDING</option>
                        <option value="processing">PROCESSING</option>
                        <option value="shipped">SHIPPED</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        <span>{isBn ? 'ডিটেইলস' : 'View'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Order Details
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
                  #{selectedOrder.orderNumber}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Recipient & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border bg-muted/20 p-4 text-xs">
              <div className="space-y-1">
                <span className="font-extrabold text-foreground flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary" />
                  {selectedOrder.shippingAddress?.recipientName}
                </span>
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-sky-600" />
                  {selectedOrder.shippingAddress?.phone}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-extrabold text-foreground flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-rose-600" />
                  Shipping Location
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedOrder.shippingAddress?.addressLine}, {selectedOrder.shippingAddress?.thana},{' '}
                  {selectedOrder.shippingAddress?.district},{' '}
                  {selectedOrder.shippingAddress?.division}
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                Order Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-background">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 text-xs">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 object-cover rounded-lg border border-border"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg border border-border bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          MED
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-foreground">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.dosageForm} • Qty: {item.quantity} × {formatBDT(item.effectiveUnitPrice)}
                        </p>
                      </div>
                    </div>
                    <span className="font-black text-foreground">
                      {formatBDT(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Breakdown */}
            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">{formatBDT(selectedOrder.subtotal)}</span>
              </div>

              {selectedOrder.couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount ({selectedOrder.couponCode})</span>
                  <span>-{formatBDT(selectedOrder.couponDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span className="font-bold text-foreground">{formatBDT(selectedOrder.deliveryCharge)}</span>
              </div>

              <div className="pt-2 border-t border-border flex justify-between items-baseline text-sm">
                <span className="font-extrabold text-foreground">Grand Total</span>
                <span className="font-black text-primary text-base">
                  {formatBDT(selectedOrder.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
