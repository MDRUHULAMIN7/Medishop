'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatBDT, cn } from '@/lib/utils';
import { orderService } from '@/services/order.service';
import { settingsService, DynamicPaymentMethod } from '@/services/settings.service';
import { PaymentBrandIcon } from '@/components/common/PaymentBrandIcon';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderNumber: string;
  amount: number;
  shipment1Total?: number;
  shipment2Total?: number;
  shipment1PaymentStatus?: string;
  shipment2PaymentStatus?: string;
  isSplitDelivery?: boolean;
  isBn?: boolean;
  isPreOrder?: boolean;
  initialTarget?: 'all' | 'shipment1' | 'shipment2';
  onSuccess?: () => void;
}

const fallbackMethods: DynamicPaymentMethod[] = [
  { id: 'bkash', code: 'bkash', nameBn: 'বিকাশ', nameEn: 'bKash', isActive: true },
  { id: 'nagad', code: 'nagad', nameBn: 'নগদ', nameEn: 'Nagad', isActive: true },
  { id: 'card', code: 'card', nameBn: 'কার্ড / ইন্টারনেট ব্যাংকিং', nameEn: 'Card', isActive: true },
];

function methodCode(method?: DynamicPaymentMethod) {
  return (method?.code || method?.id || '').toLowerCase();
}

export function PaymentModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  amount,
  shipment1Total = 0,
  shipment2Total = 0,
  shipment1PaymentStatus = 'pending',
  shipment2PaymentStatus = 'pending',
  isSplitDelivery = false,
  isBn = true,
  isPreOrder = false,
  initialTarget = 'all',
  onSuccess,
}: PaymentModalProps) {
  const [activeMethods, setActiveMethods] = useState<DynamicPaymentMethod[]>(fallbackMethods);
  const [targetShipment, setTargetShipment] = useState<'all' | 'shipment1' | 'shipment2'>(
    initialTarget || (isSplitDelivery ? (shipment1PaymentStatus === 'paid' ? 'shipment2' : 'all') : 'all')
  );
  const [selectedCode, setSelectedCode] = useState<string>('bkash');
  const [phoneOrCard, setPhoneOrCard] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadActiveMethods() {
      try {
        const publicSettings = await settingsService.getPublicSettings();
        const activeOnly = publicSettings?.payment?.methods?.filter((method) => method.isActive) || [];
        const nextMethods = activeOnly.length > 0 ? activeOnly : fallbackMethods;
        setActiveMethods(nextMethods);
        setSelectedCode(methodCode(nextMethods[0]) || 'bkash');
      } catch (err) {
        console.error('Failed to load active payment methods:', err);
        setActiveMethods(fallbackMethods);
        setSelectedCode('bkash');
      }
    }

    if (!isOpen) return;
    loadActiveMethods();

    if (initialTarget) {
      setTargetShipment(initialTarget);
    } else if (isSplitDelivery) {
      if (shipment1PaymentStatus === 'paid' && shipment2PaymentStatus !== 'paid') {
        setTargetShipment('shipment2');
      } else if (shipment2PaymentStatus === 'paid' && shipment1PaymentStatus !== 'paid') {
        setTargetShipment('shipment1');
      } else {
        setTargetShipment('all');
      }
    } else {
      setTargetShipment('all');
    }
  }, [isOpen, initialTarget, isSplitDelivery, shipment1PaymentStatus, shipment2PaymentStatus]);

  const currentMethod = activeMethods.find((method) => methodCode(method) === selectedCode) || activeMethods[0];
  const payableAmount =
    targetShipment === 'shipment1'
      ? shipment1Total || Math.round(amount / 2)
      : targetShipment === 'shipment2'
        ? shipment2Total || Math.round(amount / 2)
        : amount;

  const payableLabel =
    targetShipment === 'shipment1'
      ? isBn ? 'চালান ১ এর প্রদেয় টাকা' : 'Shipment 1 payable'
      : targetShipment === 'shipment2'
        ? isBn ? 'চালান ২ এর প্রদেয় টাকা' : 'Shipment 2 payable'
        : isPreOrder
          ? isBn ? 'প্রি-অর্ডার প্রদেয় টাকা' : 'Pre-order payable'
          : isBn ? 'মোট প্রদেয় টাকা' : 'Total payable';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatePayload: any = {
        targetShipment,
        paymentStatus: 'paid',
        paidAmount: payableAmount,
        note: `Paid ${formatBDT(payableAmount)} via ${selectedCode.toUpperCase()} (${phoneOrCard || 'Direct Pay'}).`,
      };

      if (targetShipment === 'shipment1') {
        updatePayload.shipment1PaymentStatus = 'paid';
      } else if (targetShipment === 'shipment2') {
        updatePayload.shipment2PaymentStatus = 'paid';
      } else {
        updatePayload.shipment1PaymentStatus = 'paid';
        updatePayload.shipment2PaymentStatus = 'paid';
      }

      await orderService.updateOrderStatus(orderId, updatePayload);
      toast.success(isBn ? `অর্ডার #${orderNumber}-এর পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।` : `Payment completed for Order #${orderNumber}.`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || (isBn ? 'পেমেন্ট সম্পন্ন হতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'Payment processing failed. Please try again.'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 cursor-pointer bg-black backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-normal text-blue-600">
                  {isSplitDelivery
                    ? (isBn ? 'স্প্লিট পেমেন্ট গেটওয়ে' : 'Split Payment Gateway')
                    : (isBn ? 'ইনস্ট্যান্ট পেমেন্ট গেটওয়ে' : 'Instant Payment Gateway')}
                </span>
                <h3 className="truncate text-lg font-extrabold text-foreground">
                  {isBn ? `অর্ডার #${orderNumber} এর পেমেন্ট` : `Pay Order #${orderNumber}`}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-5 custom-scrollbar">
              {isSplitDelivery && (
                <div className="space-y-2 rounded-2xl border border-blue-200 bg-blue-50/50 p-3.5">
                  <span className="block text-xs font-bold text-foreground">
                    {isBn ? 'কোন চালানের পেমেন্ট করতে চান বেছে নিন:' : 'Choose what you want to pay for:'}
                  </span>
                  <div className="space-y-2">
                    <ShipmentButton
                      selected={targetShipment === 'all'}
                      title={isBn ? 'সম্পূর্ণ অর্ডার' : 'Full Order'}
                      description={isBn ? 'ইন-স্টক এবং প্রি-অর্ডারের মোট মূল্য' : 'Total for in-stock and pre-order items'}
                      amount={amount}
                      onClick={() => setTargetShipment('all')}
                    />
                    <ShipmentButton
                      selected={targetShipment === 'shipment1'}
                      title={isBn ? 'চালান ১: ইন-স্টক পণ্য' : 'Shipment 1: In-stock'}
                      description={isBn ? '২৪ ঘণ্টার মধ্যে ডেলিভারি' : 'Delivery within 24 hours'}
                      amount={shipment1Total || Math.round(amount / 2)}
                      icon={<PackageCheck className="h-4 w-4 text-emerald-600" />}
                      disabled={shipment1PaymentStatus === 'paid'}
                      paid={shipment1PaymentStatus === 'paid'}
                      onClick={() => setTargetShipment('shipment1')}
                    />
                    <ShipmentButton
                      selected={targetShipment === 'shipment2'}
                      title={isBn ? 'চালান ২: প্রি-অর্ডার পণ্য' : 'Shipment 2: Pre-order'}
                      description={isBn ? '৩-৫ কার্যদিবসে ডেলিভারি' : 'Delivery in 3-5 working days'}
                      amount={shipment2Total || Math.round(amount / 2)}
                      icon={<Clock className="h-4 w-4 text-blue-600" />}
                      disabled={shipment2PaymentStatus === 'paid'}
                      paid={shipment2PaymentStatus === 'paid'}
                      onClick={() => setTargetShipment('shipment2')}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/50 p-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{payableLabel}</p>
                  <p className="mt-1 text-2xl font-black text-blue-600">{formatBDT(payableAmount)}</p>
                </div>
                <ShieldCheck className="h-7 w-7 text-blue-600" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">
                    {isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                    {activeMethods.map((method) => {
                      const code = methodCode(method);
                      const isSelected = selectedCode === code;
                      return (
                        <button
                          key={method.id || method.code}
                          type="button"
                          onClick={() => setSelectedCode(code)}
                          className={cn(
                            'relative flex h-[100px] sm:h-[110px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border p-2 text-center transition-all select-none',
                            isSelected
                              ? 'border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-xs ring-2 ring-indigo-200/60 dark:ring-indigo-800/40'
                              : 'border-border bg-background hover:border-border/80 hover:bg-muted/40'
                          )}
                        >
                          <span
                            className={cn(
                              'absolute left-2.5 top-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full transition-all',
                              isSelected
                                ? 'border-2 border-indigo-600 bg-indigo-600 text-white'
                                : 'border-2 border-muted-foreground/30 bg-background'
                            )}
                          >
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </span>
                          <div className="flex h-full w-full items-center justify-center pt-1">
                            <PaymentBrandIcon code={code} logo={method.logo} isBn={isBn} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {currentMethod?.accountNumber && (
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-xs font-medium text-sky-900">
                    <p className="font-bold">{currentMethod.accountNumber}</p>
                    {currentMethod.instructionsEn || currentMethod.instructionsBn ? (
                      <p className="mt-0.5 text-[11px] text-sky-700">
                        {isBn ? currentMethod.instructionsBn || currentMethod.instructionsEn : currentMethod.instructionsEn || currentMethod.instructionsBn}
                      </p>
                    ) : null}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {selectedCode === 'card'
                      ? (isBn ? 'কার্ড নম্বর' : 'Card Number')
                      : `${selectedCode.toUpperCase()} ${isBn ? 'অ্যাকাউন্ট নম্বর' : 'Account Number'}`}
                  </label>
                  <input
                    type="text"
                    required
                    value={phoneOrCard}
                    onChange={(event) => setPhoneOrCard(event.target.value)}
                    placeholder={selectedCode === 'card' ? '4321 .... .... 8888' : '017XXXXXXXX'}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3.5 text-xs font-bold text-foreground focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-blue-600 text-xs font-black text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{isBn ? 'পেমেন্ট সম্পন্ন হচ্ছে...' : 'Processing Payment...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      <span>{isBn ? `${formatBDT(payableAmount)} পেমেন্ট নিশ্চিত করুন` : `Confirm ${formatBDT(payableAmount)} Payment`}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ShipmentButton({
  selected,
  title,
  description,
  amount,
  onClick,
  icon,
  disabled,
  paid,
}: {
  selected: boolean;
  title: string;
  description: string;
  amount: number;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  paid?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-left text-xs transition-all disabled:cursor-not-allowed disabled:opacity-60',
        selected ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100' : 'border-border bg-background hover:bg-muted'
      )}
    >
      <div className="flex min-w-0 items-start gap-2">
        {icon}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-extrabold text-foreground">{title}</p>
            {paid && (
              <span className="flex items-center gap-0.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-800">
                <CheckCircle2 className="h-2.5 w-2.5" /> Paid
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <span className="shrink-0 text-sm font-black text-blue-600">{formatBDT(amount)}</span>
    </button>
  );
}
