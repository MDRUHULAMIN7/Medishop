'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Eye, CreditCard, ArrowRight, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { Order } from '@/types/order';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatBDT } from '@/lib/utils';
import { PaymentModal } from './PaymentModal';

interface CustomerOrdersTableProps {
  orders: Order[];
  isBn?: boolean;
  onRefresh?: () => void;
}

export function CustomerOrdersTable({
  orders,
  isBn = true,
  onRefresh,
}: CustomerOrdersTableProps) {
  const [selectedPayOrder, setSelectedPayOrder] = useState<Order | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/40 font-extrabold uppercase tracking-wider text-muted-foreground">
              <th className="py-3.5 px-4">{isBn ? 'অর্ডার নম্বর ও তারিখ' : 'Order Number & Date'}</th>
              <th className="py-3.5 px-4">{isBn ? 'পণ্য সমুহ' : 'Items Summary'}</th>
              <th className="py-3.5 px-4">{isBn ? 'সর্বমোট প্রদেয়' : 'Grand Total'}</th>
              <th className="py-3.5 px-4">{isBn ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}</th>
              <th className="py-3.5 px-4">{isBn ? 'অর্ডার স্ট্যাটাস' : 'Order Status'}</th>
              <th className="py-3.5 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const totalAmount = Number(order.summary?.grandTotal || order.grandTotal || 0);
              const itemsCount = order.items?.length || 0;
              const firstItemName = order.items?.[0] ? (isBn ? order.items[0].nameBn : order.items[0].nameEn) : 'Medicine';

              const isPendingPayment = order.paymentStatus === 'pending' && order.orderStatus !== 'cancelled';

              return (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  {/* Order # & Date */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-primary sm:text-sm">
                        #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                        <Calendar className="h-3 w-3" />
                        <span>{formattedDate}</span>
                      </span>
                    </div>
                  </td>

                  {/* Items Summary */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col max-w-[200px]">
                      <span className="font-bold text-foreground truncate">
                        {firstItemName}
                      </span>
                      <span className="text-[11px] text-muted-foreground font-medium">
                        {itemsCount > 1
                          ? isBn
                            ? `এবং আরও ${itemsCount - 1} টি ওষুধ`
                            : `& ${itemsCount - 1} more items`
                          : isBn
                          ? '১ টি ওষুধ'
                          : '1 item'}
                      </span>
                    </div>
                  </td>

                  {/* Grand Total */}
                  <td className="py-3.5 px-4">
                    <span className="font-black text-foreground text-sm">
                      {formatBDT(totalAmount)}
                    </span>
                  </td>

                  {/* Payment Status & Pay Now Button */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-lg bg-muted border border-border/80 px-2 py-0.5 text-[10px] font-black uppercase text-muted-foreground shadow-2xs">
                        {order.paymentMethod?.id || 'COD'}
                      </span>

                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-black uppercase ${
                          order.paymentStatus === 'paid'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {order.paymentStatus || 'PENDING'}
                      </span>

                      {isPendingPayment && (
                        <button
                          type="button"
                          onClick={() => setSelectedPayOrder(order)}
                          className="inline-flex h-7 items-center gap-1 rounded-xl bg-emerald-600 px-2.5 text-[11px] font-black text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer animate-pulse"
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>{isBn ? 'পেমেন্ট করুন' : 'Pay Now'}</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Order Status */}
                  <td className="py-3.5 px-4">
                    <OrderStatusBadge status={order.orderStatus} isBn={isBn} />
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/orders/${order.id}`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground hover:bg-muted transition-colors shadow-2xs"
                    >
                      <Eye className="h-3.5 w-3.5 text-primary" />
                      <span>{isBn ? 'বিস্তারিত & ট্র্যাকিং' : 'View & Track'}</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Modal Popup */}
      {selectedPayOrder && (
        <PaymentModal
          isOpen={!!selectedPayOrder}
          onClose={() => setSelectedPayOrder(null)}
          orderId={selectedPayOrder.id}
          orderNumber={selectedPayOrder.orderNumber}
          amount={Number(selectedPayOrder.summary?.grandTotal || selectedPayOrder.grandTotal || 0)}
          isBn={isBn}
          onSuccess={() => {
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}
