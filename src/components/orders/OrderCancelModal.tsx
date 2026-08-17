'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';
import { orderService } from '@/services/order.service';

interface OrderCancelModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: string;
  amount: number;
  currentStatus: string;
  isBn?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CANCELLATION_REASONS_BN = [
  'ভুলবশত অর্ডার করা হয়েছে',
  'ডেলিভারি ঠিকানা বা ফোন নম্বর পরিবর্তন করতে চাই',
  'পেমেন্ট বা কুপন কোড সংক্রান্ত সমস্যা',
  'অন্যত্র কম দামে পেয়েছি',
  'অন্যান্য কারণ',
];

const CANCELLATION_REASONS_EN = [
  'Order placed by mistake',
  'Need to change delivery address or phone',
  'Payment or coupon code issue',
  'Found better price elsewhere',
  'Other reason',
];

export function OrderCancelModal({
  isOpen,
  orderId,
  orderNumber,
  amount,
  currentStatus,
  isBn = true,
  onClose,
  onSuccess,
}: OrderCancelModalProps) {
  const [reason, setReason] = useState(CANCELLATION_REASONS_BN[0]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isCancellable = ['pending', 'confirmed', 'processing'].includes(currentStatus.toLowerCase());

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCancellable) {
      toast.error(
        isBn
          ? 'এই অর্ডারটি শিপড হয়ে গেছে, তাই বাতিল করা সম্ভব নয়।'
          : 'Order has already been shipped and cannot be cancelled.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const fullReason = note.trim() ? `${reason} (${note.trim()})` : reason;
      await orderService.updateOrderStatus(orderId, {
        orderStatus: 'cancelled',
        note: `Customer Cancelled: ${fullReason}`,
      });

      toast.success(
        isBn
          ? `অর্ডার #${orderNumber} সফলভাবে বাতিল করা হয়েছে!`
          : `Order #${orderNumber} cancelled successfully!`
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'অর্ডার বাতিল করতে সমস্যা হয়েছে' : 'Failed to cancel order'));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-xs cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground">
                    {isBn ? `অর্ডার #${orderNumber} বাতিল` : `Cancel Order #${orderNumber}`}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {isBn ? 'অর্ডার বাতিলের কারণ নিশ্চিত করুন' : 'Confirm cancellation reason'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border p-1.5 text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Total Value */}
            <div className="rounded-2xl border border-border bg-muted/20 p-3.5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-semibold">
                {isBn ? 'অর্ডারের মোট মূল্য:' : 'Order Total:'}
              </span>
              <span className="text-lg font-black text-rose-600">
                {formatBDT(amount)}
              </span>
            </div>

            {/* Non-cancellable Warning */}
            {!isCancellable ? (
              <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 p-4 text-xs text-rose-800 dark:text-rose-200 space-y-1">
                <p className="font-bold">
                  {isBn ? 'অর্ডারটি আর বাতিল করা যাবে না' : 'Cannot Cancel Order'}
                </p>
                <p className="text-[11px] opacity-90">
                  {isBn
                    ? `বর্তমান স্ট্যাটাস "${currentStatus}"। ডেলিভারি শুরু হওয়ার পর অর্ডার বাতিল করা সম্ভব নয়। সাহায্যের জন্য সাপোর্ট হটলাইনে কল দিন।`
                    : `Current status is "${currentStatus}". Shipped orders cannot be cancelled online. Please call customer support.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleCancelOrder} className="space-y-4 text-xs">
                {/* Cancellation Reason Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground block">
                    {isBn ? 'বাতিল করার প্রধান কারণ *' : 'Reason for Cancellation *'}
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs font-bold text-foreground focus:border-rose-500 focus:outline-hidden"
                  >
                    {(isBn ? CANCELLATION_REASONS_BN : CANCELLATION_REASONS_EN).map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Note */}
                <div className="space-y-1.5">
                  <label className="font-bold text-foreground block">
                    {isBn ? 'অতিরিক্ত মন্তব্য (ঐচ্ছিক)' : 'Additional Details (Optional)'}
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={isBn ? 'বিস্তারিত লিখুন...' : 'Type details...'}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-rose-500 focus:outline-hidden"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-muted cursor-pointer"
                  >
                    {isBn ? 'না, ফেরত যান' : 'Go Back'}
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-50 cursor-pointer transition-all"
                  >
                    {submitting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <span>{isBn ? 'হ্যাঁ, অর্ডার বাতিল করুন' : 'Confirm Cancellation'}</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
