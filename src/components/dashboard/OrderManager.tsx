'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  RefreshCw,
  Eye,
  X,
  FileText,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ChevronDown,
  PackageCheck,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { orderService } from '@/services/order.service';
import { toast } from 'sonner';

interface StatusOption {
  value: string;
  label: string;
  badgeClass: string;
}

function CustomStatusSelect({
  options,
  value,
  onChange,
  disabled = false,
}: {
  options: StatusOption[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const current = options.find((o) => o.value.toLowerCase() === (value || '').toLowerCase()) || options[0];

  return (
    <div className="relative inline-block w-full">
      <select
        disabled={disabled}
        value={current.value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border px-3 py-1.5 pr-8 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 ${current.badgeClass}`}
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-background text-foreground font-semibold py-1"
          >
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground/60">
        <ChevronDown className="h-3.5 w-3.5" />
      </div>
    </div>
  );
}

interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  dosageForm: string;
  unitType: string;
  unit?: string;
  unitMultiplier?: number;
  image: string;
  unitPrice: number;
  discountPrice?: number;
  effectiveUnitPrice: number;
  quantity: number;
  availableQuantity?: number;
  preOrderQuantity?: number;
  fulfillmentType?: string;
  totalPrice: number;
  requiresPrescription: boolean;
}

interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    createdAt?: string;
  };
  items: OrderItem[];
  shippingAddress: {
    recipientName: string;
    fullName?: string;
    phone: string;
    division?: string;
    district: string;
    thana: string;
    addressLine: string;
    streetAddress?: string;
    area?: string;
    postalCode?: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipment1Status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipment2Status?: 'pending' | 'sourcing' | 'ready_to_ship' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipment1PaymentStatus?: 'pending' | 'paid' | 'failed';
  shipment2PaymentStatus?: 'pending' | 'paid' | 'failed';
  shipment1Total?: number;
  shipment2Total?: number;
  shipment1DeliveryCharge?: number;
  shipment2DeliveryCharge?: number;
  paidAmount?: number;
  subtotal: number;
  discountTotal: number;
  couponCode?: string;
  couponDiscount: number;
  deliveryCharge: number;
  grandTotal: number;
  isPreOrder?: boolean;
  isSplitDelivery?: boolean;
  shipment1DeliveryMethod?: string;
  shipment2DeliveryMethod?: string;
  shipment1DeliveryMethodDetails?: {
    id?: string;
    code?: string;
    nameBn?: string;
    nameEn?: string;
    charge?: number;
    estimatedDeliveryBn?: string;
    estimatedDeliveryEn?: string;
  } | null;
  shipment2DeliveryMethodDetails?: {
    id?: string;
    code?: string;
    nameBn?: string;
    nameEn?: string;
    charge?: number;
    estimatedDeliveryBn?: string;
    estimatedDeliveryEn?: string;
  } | null;
  deliveryMethod?: {
    id?: string;
    code?: string;
    nameBn?: string;
    nameEn?: string;
    charge?: number;
    estimatedDeliveryBn?: string;
    estimatedDeliveryEn?: string;
  } | null;
  estimatedDeliveryDate?: string;
  prescriptionId?: string | null;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

const PAYMENT_STATUS_OPTIONS: StatusOption[] = [
  { value: 'pending', label: 'PENDING', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'partially_paid', label: 'PARTIAL PAID', badgeClass: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'paid', label: 'PAID', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { value: 'failed', label: 'FAILED', badgeClass: 'bg-rose-100 text-rose-800 border-rose-300' },
  { value: 'refunded', label: 'REFUNDED', badgeClass: 'bg-purple-100 text-purple-800 border-purple-300' },
];

const ORDER_STATUS_OPTIONS: StatusOption[] = [
  { value: 'pending', label: 'PENDING', badgeClass: 'bg-amber-50 text-amber-800 border-amber-300' },
  { value: 'processing', label: 'PROCESSING', badgeClass: 'bg-blue-50 text-blue-800 border-blue-300' },
  { value: 'shipped', label: 'SHIPPED', badgeClass: 'bg-sky-50 text-sky-800 border-sky-300' },
  { value: 'delivered', label: 'DELIVERED', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { value: 'cancelled', label: 'CANCELLED', badgeClass: 'bg-rose-50 text-rose-800 border-rose-300' },
];

const PREORDER_STATUS_OPTIONS: StatusOption[] = [
  { value: 'pending', label: 'PENDING', badgeClass: 'bg-amber-50 text-amber-800 border-amber-300' },
  { value: 'sourcing', label: 'SOURCING', badgeClass: 'bg-purple-50 text-purple-800 border-purple-300' },
  { value: 'ready_to_ship', label: 'READY TO SHIP', badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
  { value: 'processing', label: 'PROCESSING', badgeClass: 'bg-blue-50 text-blue-800 border-blue-300' },
  { value: 'shipped', label: 'SHIPPED', badgeClass: 'bg-sky-50 text-sky-800 border-sky-300' },
  { value: 'delivered', label: 'DELIVERED', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  { value: 'cancelled', label: 'CANCELLED', badgeClass: 'bg-rose-50 text-rose-800 border-rose-300' },
];

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
          ? `অর্ডার #${updated?.orderNumber || id} এর স্ট্যাটাস '${newOrderStatus}' করা হয়েছে`
          : `Order #${updated?.orderNumber || id} status updated to '${newOrderStatus}'`
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

  // Independent Shipment Status Updates
  const handleUpdateShipmentStatus = async (
    id: string,
    shipment: 'shipment1' | 'shipment2',
    newStatus: string
  ) => {
    setUpdatingId(id);
    try {
      const payload =
        shipment === 'shipment1'
          ? { shipment1Status: newStatus as any }
          : { shipment2Status: newStatus as any };

      const updated = await orderService.updateOrderStatus(id, payload);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                ...(shipment === 'shipment1'
                  ? { shipment1Status: newStatus as any }
                  : { shipment2Status: newStatus as any }),
              }
            : o
        )
      );

      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                ...(shipment === 'shipment1'
                  ? { shipment1Status: newStatus as any }
                  : { shipment2Status: newStatus as any }),
              }
            : null
        );
      }

      toast.success(
        isBn
          ? `${shipment === 'shipment1' ? '১ম চালান' : '২য় চালান'} এর স্ট্যাটাস '${newStatus}' করা হয়েছে`
          : `${shipment === 'shipment1' ? 'Shipment 1' : 'Shipment 2'} status updated to '${newStatus}'`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update shipment status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Independent Shipment Payment Status Updates
  const handleUpdateShipmentPaymentStatus = async (
    id: string,
    shipment: 'shipment1' | 'shipment2',
    newPaymentStatus: string
  ) => {
    setUpdatingId(id);
    try {
      const payload =
        shipment === 'shipment1'
          ? { shipment1PaymentStatus: newPaymentStatus as any }
          : { shipment2PaymentStatus: newPaymentStatus as any };

      const updated = await orderService.updateOrderStatus(id, payload);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                ...(shipment === 'shipment1'
                  ? { shipment1PaymentStatus: newPaymentStatus as any }
                  : { shipment2PaymentStatus: newPaymentStatus as any }),
                paymentStatus: updated?.paymentStatus || o.paymentStatus,
              }
            : o
        )
      );

      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                ...(shipment === 'shipment1'
                  ? { shipment1PaymentStatus: newPaymentStatus as any }
                  : { shipment2PaymentStatus: newPaymentStatus as any }),
                paymentStatus: updated?.paymentStatus || prev.paymentStatus,
              }
            : null
        );
      }

      toast.success(
        isBn
          ? `${shipment === 'shipment1' ? '১ম চালান' : '২য় চালান'} এর পেমেন্ট '${newPaymentStatus}' করা হয়েছে`
          : `${shipment === 'shipment1' ? 'Shipment 1' : 'Shipment 2'} payment updated to '${newPaymentStatus}'`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update shipment payment status');
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
    const matchEmail = o.user?.email?.toLowerCase().includes(q);
    const matchDistrict = o.shippingAddress?.district?.toLowerCase().includes(q);

    return matchOrderNum || matchName || matchPhone || matchEmail || matchDistrict;
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

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
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
          className="h-10 rounded-2xl border border-border bg-background px-4 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
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
          className="h-10 rounded-2xl border border-border bg-background px-4 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
        >
          <option value="ALL">{isBn ? 'সকল পেমেন্ট স্ট্যাটাস' : 'All Payment Statuses'}</option>
          <option value="pending">PENDING</option>
          <option value="partially_paid">PARTIALLY PAID</option>
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
              <tr className="border-b border-border bg-muted/40 font-extrabold uppercase tracking-wider text-muted-foreground">
                <th className="py-3.5 px-4">Order Number & Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Amount & Payment</th>
                <th className="py-3.5 px-4">Order Lifecycles</th>
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
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {order.isPreOrder && (
                            <span className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5 text-[9px] font-black text-primary">
                              Pre-Order
                            </span>
                          )}
                          {order.isSplitDelivery && (
                            <span className="inline-flex items-center gap-1 rounded bg-blue-50 border border-blue-200 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                              Split (২ চালান)
                            </span>
                          )}
                          {order.prescriptionId && (
                            <span className="inline-flex items-center gap-1 rounded bg-purple-100 px-1.5 py-0.5 text-[9px] font-extrabold text-purple-800">
                              <FileText className="h-2.5 w-2.5" />
                              <span>Prescription</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-foreground sm:text-sm">
                          {order.shippingAddress?.recipientName || order.user?.name || 'Customer'}
                        </span>
                        <span className="text-[11px] font-bold text-sky-600">
                          {order.shippingAddress?.phone || order.user?.phone || 'N/A'}
                        </span>
                      </div>
                    </td>

                    {/* Amount & Payment */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-foreground text-sm flex h-8 items-center">
                          {formatBDT(order.grandTotal)}
                        </span>
                        <div className="w-[130px]">
                          <CustomStatusSelect
                            options={PAYMENT_STATUS_OPTIONS}
                            value={order.paymentStatus}
                            onChange={(val) => handleUpdatePaymentStatus(order.id, val)}
                            disabled={updatingId === order.id}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Order Lifecycles */}
                    <td className="py-3.5 px-4">
                      {order.isSplitDelivery ? (
                        <div className="flex flex-col gap-1.5 w-[150px]">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-extrabold text-emerald-700 shrink-0">১ম:</span>
                            <div className="flex-1">
                              <CustomStatusSelect
                                options={ORDER_STATUS_OPTIONS}
                                value={order.shipment1Status || order.orderStatus}
                                onChange={(val) => handleUpdateShipmentStatus(order.id, 'shipment1', val)}
                                disabled={updatingId === order.id}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-extrabold text-primary shrink-0">২য়:</span>
                            <div className="flex-1">
                              <CustomStatusSelect
                                options={PREORDER_STATUS_OPTIONS}
                                value={order.shipment2Status || 'pending'}
                                onChange={(val) => handleUpdateShipmentStatus(order.id, 'shipment2', val)}
                                disabled={updatingId === order.id}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-[140px]">
                          <CustomStatusSelect
                            options={order.isPreOrder ? PREORDER_STATUS_OPTIONS : ORDER_STATUS_OPTIONS}
                            value={order.orderStatus}
                            onChange={(val) => handleUpdateOrderStatus(order.id, val)}
                            disabled={updatingId === order.id}
                          />
                        </div>
                      )}
                    </td>

                    {/* Actions button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:bg-muted transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        <span>{isBn ? 'ডিটেইলস' : 'View Details'}</span>
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
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border p-6 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Order Management
                    </span>
                    {selectedOrder.isPreOrder && (
                      <span className="rounded bg-primary/10 border border-primary/20 px-1.5 py-0.2 text-[9px] font-black text-primary">
                        Pre-Order
                      </span>
                    )}
                    {selectedOrder.isSplitDelivery && (
                      <span className="rounded bg-blue-50 border border-blue-200 px-1.5 py-0.2 text-[9px] font-bold text-blue-700">
                        ২ চালানে স্প্লিট ডেলিভারি
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-foreground">
                    #{selectedOrder.orderNumber}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-border p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4 space-y-6">
                {/* Independent Dual Shipment Controls for Split Orders */}
                {selectedOrder.isSplitDelivery ? (
                  <div className="space-y-4">
                    <span className="text-xs font-extrabold text-foreground uppercase tracking-wider block">
                      চালানভিত্তিক স্বাধীন নিয়ন্ত্রণ (Independent Shipment Controls)
                    </span>

                    {/* Shipment 1 (In-Stock) Control Panel */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3 dark:bg-emerald-950/20">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <PackageCheck className="h-4 w-4 text-emerald-700" />
                          <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                            📦 ১ম চালান (ইন-স্টক পণ্য) - ৳{selectedOrder.shipment1Total || Math.round(selectedOrder.grandTotal / 2)}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-emerald-700">
                          {selectedOrder.shipment1DeliveryMethod || '২৪ ঘণ্টায় এক্সপ্রেস ডেলিভারি'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-foreground block mb-1">
                            ১ম চালানের ডেলিভারি স্ট্যাটাস:
                          </label>
                          <CustomStatusSelect
                            options={ORDER_STATUS_OPTIONS}
                            value={selectedOrder.shipment1Status || selectedOrder.orderStatus}
                            onChange={(val) => handleUpdateShipmentStatus(selectedOrder.id, 'shipment1', val)}
                            disabled={updatingId === selectedOrder.id}
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-foreground block mb-1">
                            ১ম চালানের পেমেন্ট স্ট্যাটাস:
                          </label>
                          <CustomStatusSelect
                            options={PAYMENT_STATUS_OPTIONS.filter((o) => o.value !== 'partially_paid')}
                            value={selectedOrder.shipment1PaymentStatus || selectedOrder.paymentStatus}
                            onChange={(val) => handleUpdateShipmentPaymentStatus(selectedOrder.id, 'shipment1', val)}
                            disabled={updatingId === selectedOrder.id}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipment 2 (Pre-Order) Control Panel */}
                    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="font-bold text-xs text-foreground">
                            ⚡ ২য় চালান (প্রি-অর্ডার পণ্য) - ৳{selectedOrder.shipment2Total || Math.round(selectedOrder.grandTotal / 2)}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-primary">
                          {selectedOrder.shipment2DeliveryMethod || '৩-৫ দিনে ডেলিভারি'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-foreground block mb-1">
                            ২য় চালানের প্রি-অর্ডার লাইফসাইকেল:
                          </label>
                          <CustomStatusSelect
                            options={PREORDER_STATUS_OPTIONS}
                            value={selectedOrder.shipment2Status || 'pending'}
                            onChange={(val) => handleUpdateShipmentStatus(selectedOrder.id, 'shipment2', val)}
                            disabled={updatingId === selectedOrder.id}
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-foreground block mb-1">
                            ২য় চালানের পেমেন্ট স্ট্যাটাস:
                          </label>
                          <CustomStatusSelect
                            options={PAYMENT_STATUS_OPTIONS.filter((o) => o.value !== 'partially_paid')}
                            value={selectedOrder.shipment2PaymentStatus || selectedOrder.paymentStatus}
                            onChange={(val) => handleUpdateShipmentPaymentStatus(selectedOrder.id, 'shipment2', val)}
                            disabled={updatingId === selectedOrder.id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Single Order Status Control */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border bg-muted/20 p-4">
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">
                        অর্ডার স্ট্যাটাস (Order Status):
                      </label>
                      <CustomStatusSelect
                        options={selectedOrder.isPreOrder ? PREORDER_STATUS_OPTIONS : ORDER_STATUS_OPTIONS}
                        value={selectedOrder.orderStatus}
                        onChange={(val) => handleUpdateOrderStatus(selectedOrder.id, val)}
                        disabled={updatingId === selectedOrder.id}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-foreground block mb-1.5">
                        পেমেন্ট স্ট্যাটাস (Payment Status):
                      </label>
                      <CustomStatusSelect
                        options={PAYMENT_STATUS_OPTIONS}
                        value={selectedOrder.paymentStatus}
                        onChange={(val) => handleUpdatePaymentStatus(selectedOrder.id, val)}
                        disabled={updatingId === selectedOrder.id}
                      />
                    </div>
                  </div>
                )}

                {/* Customer Registration & Shipping Address Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border bg-muted/20 p-4 text-xs">
                  {/* Customer Account Info */}
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-foreground flex items-center gap-1.5 text-xs">
                      <User className="h-4 w-4 text-primary" />
                      Customer Registration Info
                    </span>
                    <p className="font-bold text-foreground">
                      {selectedOrder.shippingAddress?.recipientName || selectedOrder.user?.name || 'Customer'}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                      <span>{selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'N/A'}</span>
                    </p>
                    {selectedOrder.user?.email && (
                      <p className="text-muted-foreground flex items-center gap-1.5 truncate">
                        <Mail className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{selectedOrder.user.email}</span>
                      </p>
                    )}
                    {selectedOrder.user?.id && (
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>Reg ID: {selectedOrder.user.id}</span>
                      </p>
                    )}
                  </div>

                  {/* Shipping Address Info */}
                  <div className="space-y-1.5">
                    <span className="font-extrabold text-foreground flex items-center gap-1.5 text-xs">
                      <MapPin className="h-4 w-4 text-rose-600" />
                      Shipping Address
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
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {item.unit || item.unitType || item.dosageForm} • {item.quantity} {item.unit || item.unitType || ''} × {formatBDT(item.effectiveUnitPrice)}
                            </p>
                            {Boolean(item.preOrderQuantity && item.preOrderQuantity > 0) && (
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                {item.availableQuantity !== undefined && item.availableQuantity > 0 && (
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">
                                    স্টকে: {item.availableQuantity} {item.unit || ''}
                                  </span>
                                )}
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary border border-primary/20">
                                  Pre-Order: +{item.preOrderQuantity} {item.unit || ''}
                                </span>
                              </div>
                            )}
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
