'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle2, ShieldCheck, RefreshCw, Smartphone } from 'lucide-react';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';
import { orderService } from '@/services/order.service';
import { settingsService, DynamicPaymentMethod } from '@/services/settings.service';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  amount: number;
  isBn?: boolean;
  onSuccess?: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
  isBn = true,
  onSuccess,
}: PaymentModalProps) {
  const [activeMethods, setActiveMethods] = useState<DynamicPaymentMethod[]>([
    { id: 'bkash', code: 'bkash', nameBn: 'বিকাশ (bKash)', nameEn: 'bKash', isActive: true },
    { id: 'nagad', code: 'nagad', nameBn: 'নগদ (Nagad)', nameEn: 'Nagad', isActive: true },
    { id: 'card', code: 'card', nameBn: 'কার্ড (Card)', nameEn: 'Card', isActive: true },
  ]);

  const [selectedCode, setSelectedCode] = useState<string>('bkash');
  const [phoneOrCard, setPhoneOrCard] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadActiveMethods() {
      try {
        const publicSettings = await settingsService.getPublicSettings();
        if (publicSettings?.payment?.methods && publicSettings.payment.methods.length > 0) {
          const activeOnly = publicSettings.payment.methods.filter((m) => m.isActive);
          if (activeOnly.length > 0) {
            setActiveMethods(activeOnly);
            setSelectedCode(activeOnly[0].code);
          }
        }
      } catch (err) {
        console.error('Failed to load active payment methods:', err);
      }
    }
    if (isOpen) {
      loadActiveMethods();
    }
  }, [isOpen]);

  const currentMethod = activeMethods.find((m) => m.code === selectedCode) || activeMethods[0];

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      await orderService.updateOrderStatus(orderId, {
        paymentStatus: 'paid',
        note: `Paid via ${selectedCode.toUpperCase()} (${phoneOrCard || 'Instant Checkout'})`,
      });

      toast.success(
        isBn
          ? `অর্ডার #${orderNumber} এর প্রদেয় ৳${amount} পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!`
          : `Payment of ৳${amount} for Order #${orderNumber} completed successfully!`
      );

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

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

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  {isBn ? 'ইনস্ট্যান্ট পেমেন্ট গেটওয়ে' : 'Instant Payment Gateway'}
                </span>
                <h3 className="text-lg font-extrabold text-foreground">
                  {isBn ? `অর্ডার #${orderNumber} এর পেমেন্ট` : `Pay Order #${orderNumber}`}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Total Amount Badge */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  {isBn ? 'সর্বমোট প্রদেয় পরিমাণ' : 'Total Payable Amount'}
                </p>
                <p className="text-2xl font-black text-primary font-serif-title mt-0.5">
                  {formatBDT(amount)}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>

            {/* Active Payment Methods Selector Form */}
            <form onSubmit={handlePayNow} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">
                  {isBn ? 'সক্রিয় পেমেন্ট মেথড নির্বাচন করুন:' : 'Select Active Payment Method:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {activeMethods.map((m) => (
                    <button
                      key={m.id || m.code}
                      type="button"
                      onClick={() => setSelectedCode(m.code)}
                      className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-xs font-bold transition-all cursor-pointer ${
                        selectedCode === m.code
                          ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/30 shadow-xs'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <Smartphone className="h-5 w-5 mb-1 text-primary" />
                      <span className="truncate max-w-full">{isBn ? m.nameBn : m.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {currentMethod && currentMethod.accountNumber && (
                <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 text-xs text-sky-900 font-medium">
                  <p className="font-bold">{currentMethod.accountNumber}</p>
                  {currentMethod.instructionsBn && (
                    <p className="text-[11px] text-sky-700 mt-0.5">{currentMethod.instructionsBn}</p>
                  )}
                </div>
              )}

              {/* Number / Account Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">
                  {selectedCode === 'card'
                    ? isBn
                      ? 'কার্ড নম্বর (ডেমো)'
                      : 'Card Number'
                    : isBn
                    ? `${selectedCode.toUpperCase()} অ্যাকাউন্ট নম্বর`
                    : `${selectedCode.toUpperCase()} Account Number`}
                </label>
                <input
                  type="text"
                  required
                  value={phoneOrCard}
                  onChange={(e) => setPhoneOrCard(e.target.value)}
                  placeholder={
                    selectedCode === 'card'
                      ? '4321 •••• •••• 8888'
                      : '017XXXXXXXX'
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3.5 text-xs font-bold text-foreground focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-xs font-black text-white shadow-md hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{isBn ? 'পেমেন্ট প্রসেস হচ্ছে...' : 'Processing Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>
                        {isBn
                          ? `৳${amount} পেমেন্ট নিশ্চিত করুন`
                          : `Confirm ৳${amount} Payment`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
