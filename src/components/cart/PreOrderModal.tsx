'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Home,
  Loader2,
  Minus,
  Plus,
  Truck,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { CartItem } from '@/types/cart';
import { formatBDT, cn } from '@/lib/utils';
import { formatNumber } from '@/utils/cart';
import { useAppDispatch, useAppSelector } from '@/store';
import { closePreOrderModal } from '@/store/slices/cartSlice';
import { OrderService } from '@/services/order.service';
import { settingsService, DynamicDeliveryOption, DynamicPaymentMethod } from '@/services/settings.service';
import { useAddress } from '@/hooks/useAddress';
import { CascadingAddressSelector, AddressCascadeValue } from '@/components/common/CascadingAddressSelector';
import { PaymentBrandIcon } from '@/components/common/PaymentBrandIcon';

interface PreOrderModalProps {
  isOpen?: boolean;
  item?: CartItem | null;
  requestedQuantity?: number;
  availableStock?: number;
  isBn?: boolean;
  onClose?: () => void;
}

type FlowMode = 'combined' | 'separate';
type Step = 'choice' | 'combined' | 'stock' | 'preorder' | 'success';
type SectionKey = 'combined' | 'stock' | 'preorder';

interface AddressDraft {
  mode: 'saved' | 'custom';
  selectedAddressId?: string;
  name: string;
  phone: string;
  cascade: AddressCascadeValue;
}

interface SectionState {
  deliveryCode: string;
  paymentCode: string;
  address: AddressDraft;
}

const orderService = new OrderService();

const defaultCascade: AddressCascadeValue = {
  division: 'Dhaka',
  district: 'Dhaka',
  thana: 'Dhanmondi',
  streetAddress: '',
};

export function PreOrderModal({
  isOpen: propIsOpen,
  item: propItem,
  requestedQuantity: propRequestedQuantity,
  availableStock: propAvailableStock,
  isBn: propIsBn,
  onClose: propOnClose,
}: PreOrderModalProps = {}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.ui.language);
  const modalState = useAppSelector((state) => state.cart.preOrderModal);
  const user = useAppSelector((state) => state.auth.user);
  const { addresses, selectedAddressId } = useAddress();

  const isBn = propIsBn !== undefined ? propIsBn : language === 'bn';
  const isOpen = propIsOpen !== undefined ? propIsOpen : modalState.isOpen;
  const item = propItem || modalState.item;
  const initialQty = propRequestedQuantity || modalState.requestedQuantity || 1;
  const availableStock = propAvailableStock !== undefined ? propAvailableStock : modalState.availableStock ?? 0;

  const [quantity, setQuantity] = useState(initialQty);
  const [step, setStep] = useState<Step>('choice');
  const [flowMode, setFlowMode] = useState<FlowMode>('separate');
  const [deliveryOptions, setDeliveryOptions] = useState<DynamicDeliveryOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<DynamicPaymentMethod[]>([]);
  const [sections, setSections] = useState<Record<SectionKey, SectionState>>(() => buildInitialSections('', '', user));
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrders, setCreatedOrders] = useState<any[]>([]);

  const validAvailable = Math.max(0, availableStock);
  const stockQty = Math.min(quantity, validAvailable);
  const preOrderQty = Math.max(0, quantity - validAvailable);
  const isSplitEligible = stockQty > 0 && preOrderQty > 0;
  const unitPrice = item?.sellingPrice || 0;
  const unitMultiplier = (item as any)?.unitMultiplier || (item?.unit === 'box' ? 20 : item?.unit === 'strip' ? 10 : 1);

  const defaultDeliveryCode = deliveryOptions[0]?.code || deliveryOptions[0]?.id || 'inside_dhaka';
  const defaultPaymentCode = paymentMethods[0]?.code || paymentMethods[0]?.id || 'cod';

  useEffect(() => {
    let mounted = true;
    settingsService
      .getPublicSettings()
      .then((settings) => {
        if (!mounted) return;
        const activeDelivery = settings?.shipping?.options?.filter((option) => option.isActive) || [];
        const fallbackDelivery: DynamicDeliveryOption[] = [
          { id: 'inside_dhaka', code: 'inside_dhaka', nameBn: 'ঢাকার ভিতরে', nameEn: 'Inside Dhaka', charge: 60, estimatedDaysBn: '২-৩ কার্যদিবস', estimatedDaysEn: '2-3 working days', isActive: true, isDefault: true },
          { id: 'outside_dhaka', code: 'outside_dhaka', nameBn: 'ঢাকার বাইরে', nameEn: 'Outside Dhaka', charge: 120, estimatedDaysBn: '৩-৫ কার্যদিবস', estimatedDaysEn: '3-5 working days', isActive: true },
        ];
        const nextDelivery = activeDelivery.length ? activeDelivery : fallbackDelivery;
        const activePayments = settings?.payment?.methods?.filter((method) => method.isActive) || [];
        const fallbackPayments: DynamicPaymentMethod[] = [
          { id: 'cod', code: 'cod', nameBn: 'ক্যাশ অন ডেলিভারি', nameEn: 'Cash on Delivery', isActive: true, isDefault: true },
          { id: 'bkash', code: 'bkash', nameBn: 'বিকাশ', nameEn: 'bKash', isActive: true },
          { id: 'nagad', code: 'nagad', nameBn: 'নগদ', nameEn: 'Nagad', isActive: true },
          { id: 'card', code: 'card', nameBn: 'কার্ড / নেট ব্যাংকিং', nameEn: 'Card', isActive: true },
        ];
        const nextPayments = activePayments.length ? activePayments : fallbackPayments;
        const deliveryCode = (nextDelivery.find((option) => option.isDefault) || nextDelivery[0])?.code || nextDelivery[0]?.id;
        const paymentCode = (nextPayments.find((method) => method.isDefault) || nextPayments[0])?.code || nextPayments[0]?.id;
        setDeliveryOptions(nextDelivery);
        setPaymentMethods(nextPayments);
        setSections(buildInitialSections(deliveryCode, paymentCode, user, selectedAddressId || undefined));
      })
      .catch(() => {
        setDeliveryOptions([
          { id: 'inside_dhaka', code: 'inside_dhaka', nameBn: 'ঢাকার ভিতরে', nameEn: 'Inside Dhaka', charge: 60, estimatedDaysBn: '২-৩ কার্যদিবস', estimatedDaysEn: '2-3 working days', isActive: true },
          { id: 'outside_dhaka', code: 'outside_dhaka', nameBn: 'ঢাকার বাইরে', nameEn: 'Outside Dhaka', charge: 120, estimatedDaysBn: '৩-৫ কার্যদিবস', estimatedDaysEn: '3-5 working days', isActive: true },
        ]);
        setPaymentMethods([
          { id: 'cod', code: 'cod', nameBn: 'ক্যাশ অন ডেলিভারি', nameEn: 'Cash on Delivery', isActive: true },
          { id: 'bkash', code: 'bkash', nameBn: 'বিকাশ', nameEn: 'bKash', isActive: true },
          { id: 'nagad', code: 'nagad', nameBn: 'নগদ', nameEn: 'Nagad', isActive: true },
          { id: 'card', code: 'card', nameBn: 'কার্ড / নেট ব্যাংকিং', nameEn: 'Card', isActive: true },
        ]);
        setSections(buildInitialSections('inside_dhaka', 'cod', user, selectedAddressId || undefined));
      });

    return () => {
      mounted = false;
    };
  }, [selectedAddressId, user]);

  useEffect(() => {
    if (!isOpen) return;
    setQuantity(Math.max(1, initialQty));
    setFlowMode(isSplitEligible ? 'separate' : 'combined');
    setStep(isSplitEligible ? 'choice' : 'combined');
    setCreatedOrders([]);
    setNote('');
  }, [isOpen, initialQty, isSplitEligible]);

  const deliveryByCode = useMemo(() => {
    return new Map(deliveryOptions.map((option) => [option.code || option.id, option]));
  }, [deliveryOptions]);

  if (!isOpen || !item) return null;

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      dispatch(closePreOrderModal());
    }
  };

  const updateSection = (key: SectionKey, patch: Partial<SectionState>) => {
    setSections((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const updateAddress = (key: SectionKey, patch: Partial<AddressDraft>) => {
    setSections((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        address: { ...prev[key].address, ...patch },
      },
    }));
  };

  const resolveAddress = (key: SectionKey) => {
    const draft = sections[key].address;
    if (draft.mode === 'saved') {
      const saved = addresses.find((addr) => addr.id === draft.selectedAddressId) || addresses.find((addr) => addr.isDefault) || addresses[0];
      if (saved) {
        return {
          recipientName: saved.fullName || saved.recipientName || user?.name || '',
          phone: saved.phone || user?.phone || '',
          division: saved.division || 'Dhaka',
          district: saved.district || 'Dhaka',
          thana: saved.area || saved.thana || 'Dhanmondi',
          addressLine: saved.streetAddress || saved.addressLine || '',
          postalCode: saved.postalCode,
        };
      }
    }

    if (!draft.name.trim()) throw new Error(isBn ? 'দয়া করে প্রাপকের নাম লিখুন।' : 'Please enter recipient name.');
    if (!draft.phone.trim() || draft.phone.trim().length < 11) throw new Error(isBn ? 'সঠিক ১১ ডিজিটের ফোন নম্বর লিখুন।' : 'Please enter a valid 11 digit phone number.');
    if (!draft.cascade.streetAddress.trim()) throw new Error(isBn ? 'দয়া করে বিস্তারিত ঠিকানা লিখুন।' : 'Please enter the street address.');

    return {
      recipientName: draft.name.trim(),
      phone: draft.phone.trim(),
      division: draft.cascade.division || 'Dhaka',
      district: draft.cascade.district || 'Dhaka',
      thana: draft.cascade.thana || 'Dhanmondi',
      addressLine: draft.cascade.streetAddress.trim(),
    };
  };

  const markPaidIfNeeded = async (order: any, paymentCode: string) => {
    if (!order?.id || paymentCode === 'cod') return order;
    return orderService.updateOrderStatus(order.id, {
      paymentStatus: 'paid',
      shipment1PaymentStatus: 'paid',
      shipment2PaymentStatus: 'paid',
      paidAmount: Number(order.grandTotal || 0),
      note: `Payment completed via ${paymentCode.toUpperCase()}.`,
    });
  };

  const createOrder = async (key: SectionKey, qty: number, availableQty: number, preorderQty: number, fulfillmentType: 'immediate' | 'preorder' | 'mixed') => {
    const section = sections[key];
    const delivery = deliveryByCode.get(section.deliveryCode) || deliveryOptions[0];
    const deliveryCharge = Number(delivery?.charge ?? 60);
    const payload: any = {
      isPreOrder: fulfillmentType !== 'immediate',
      isSplitDelivery: false,
      shipment1DeliveryMethod: section.deliveryCode || defaultDeliveryCode,
      items: [{
        productId: item.productId,
        unit: item.unit || 'pcs',
        unitMultiplier,
        unitPrice,
        totalPrice: unitPrice * qty,
        quantity: qty,
        availableQuantity: availableQty,
        preOrderQuantity: preorderQty,
        fulfillmentType,
      }],
      shippingAddress: resolveAddress(key),
      paymentMethod: section.paymentCode || defaultPaymentCode,
      deliveryCharge,
      note: note.trim() || undefined,
    };
    const response = await orderService.checkout(payload);
    const order = response?.primaryOrder || response;
    return markPaidIfNeeded(order, section.paymentCode);
  };

  const submitCombined = async () => {
    setIsSubmitting(true);
    try {
      const order = await createOrder(
        'combined',
        quantity,
        Math.min(quantity, validAvailable),
        Math.max(0, quantity - validAvailable),
        preOrderQty > 0 ? (stockQty > 0 ? 'mixed' : 'preorder') : 'immediate'
      );
      setCreatedOrders([order]);
      setStep('success');
      toast.success(isBn ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে।' : 'Order placed successfully.');
    } catch (error: any) {
      toast.error(error?.message || (isBn ? 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।' : 'Failed to place order.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitStockOrder = async () => {
    if (stockQty <= 0) {
      setStep('preorder');
      return;
    }
    setIsSubmitting(true);
    try {
      const order = await createOrder('stock', stockQty, stockQty, 0, 'immediate');
      setCreatedOrders((prev) => [...prev, order]);
      setStep('preorder');
      toast.success(isBn ? 'ইন-স্টক পণ্যের অর্ডার সম্পন্ন হয়েছে।' : 'In-stock order placed.');
    } catch (error: any) {
      toast.error(error?.message || (isBn ? 'ইন-স্টক অর্ডার করতে সমস্যা হয়েছে।' : 'Failed to place in-stock order.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPreOrder = async () => {
    if (preOrderQty <= 0) {
      setStep('success');
      return;
    }
    setIsSubmitting(true);
    try {
      const order = await createOrder('preorder', preOrderQty, 0, preOrderQty, 'preorder');
      setCreatedOrders((prev) => [...prev, order]);
      setStep('success');
      toast.success(isBn ? 'প্রি-অর্ডার সফলভাবে সম্পন্ন হয়েছে।' : 'Pre-order placed.');
    } catch (error: any) {
      toast.error(error?.message || (isBn ? 'প্রি-অর্ডার করতে সমস্যা হয়েছে।' : 'Failed to place pre-order.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTitle = isBn
    ? step === 'choice'
      ? 'অর্ডার ধরন বেছে নিন'
      : step === 'stock'
        ? 'ইন-স্টক অর্ডার'
        : step === 'preorder'
          ? 'প্রি-অর্ডার'
          : step === 'success'
            ? 'অর্ডার সম্পন্ন'
            : 'কম্বাইন্ড অর্ডার'
    : step === 'choice'
      ? 'Choose order flow'
      : step === 'stock'
        ? 'In-stock order'
        : step === 'preorder'
          ? 'Pre-order order'
          : step === 'success'
            ? 'Order complete'
            : 'Combined order';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.72 }} exit={{ opacity: 0 }} onClick={handleClose} className="fixed inset-0 bg-slate-950 backdrop-blur-xs" />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wide text-primary">
                {isBn ? 'প্রি-অর্ডার চেকআউট' : 'Pre-order checkout'}
              </p>
              <h3 className="truncate text-lg font-black text-foreground">{currentTitle}</h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="border-b border-border px-5 py-3">
            <ProductSummary item={item} quantity={quantity} setQuantity={setQuantity} stockQty={stockQty} preOrderQty={preOrderQty} unitPrice={unitPrice} isBn={isBn} />
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.18 }}>
                {step === 'choice' && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <FlowCard
                        selected={flowMode === 'combined'}
                        icon={<Truck className="h-5 w-5" />}
                        title={isBn ? 'একত্রে অর্ডার করুন' : 'Order together'}
                        description={isBn ? 'একটি অর্ডার, একটি ঠিকানা, একটি ডেলিভারি চার্জ এবং একবারে পেমেন্ট।' : 'One order, one address, one delivery option, one payment status.'}
                        total={unitPrice * quantity + Number((deliveryByCode.get(sections.combined.deliveryCode) || deliveryOptions[0])?.charge ?? 60)}
                        onClick={() => setFlowMode('combined')}
                      />
                      <FlowCard
                        selected={flowMode === 'separate'}
                        icon={<Truck className="h-5 w-5" />}
                        title={isBn ? 'আলাদাভাবে অর্ডার করুন' : 'Order separately'}
                        description={isBn ? 'দুটি অর্ডার: স্টকের পণ্য আগে ডেলিভারি এবং প্রি-অর্ডারের পণ্য পরে পাঠানো হবে।' : 'Two orders: stock first and pre-order later. Each order gets own address, delivery and payment.'}
                        total={unitPrice * quantity + Number((deliveryByCode.get(sections.stock.deliveryCode) || deliveryOptions[0])?.charge ?? 60) + Number((deliveryByCode.get(sections.preorder.deliveryCode) || deliveryOptions[0])?.charge ?? 60)}
                        onClick={() => setFlowMode('separate')}
                      />
                    </div>
                    <FooterActions primaryLabel={isBn ? 'পরবর্তী ধাপ' : 'Continue'} onPrimary={() => setStep(flowMode === 'separate' ? 'stock' : 'combined')} />
                  </div>
                )}

                {step === 'combined' && (
                  <ConfigStep
                    isBn={isBn}
                    title={isBn ? 'কম্বাইন্ড অর্ডার সেটআপ' : 'Combined order setup'}
                    subtitle={isBn ? 'ইন-স্টক ও প্রি-অর্ডার একসাথে একটি অর্ডারে সম্পন্ন হবে।' : 'Stock and pre-order quantity will stay under one order.'}
                    section={sections.combined}
                    sectionKey="combined"
                    addresses={addresses}
                    deliveryOptions={deliveryOptions}
                    paymentMethods={paymentMethods}
                    deliveryByCode={deliveryByCode}
                    itemsTotal={unitPrice * quantity}
                    qtyLabel={`${formatNumber(quantity, isBn ? 'bn' : 'en')} ${item.unit}`}
                    note={note}
                    setNote={setNote}
                    isSubmitting={isSubmitting}
                    onBack={() => (isSplitEligible ? setStep('choice') : handleClose())}
                    onSubmit={submitCombined}
                    updateSection={updateSection}
                    updateAddress={updateAddress}
                  />
                )}

                {step === 'stock' && (
                  <ConfigStep
                    isBn={isBn}
                    title={isBn ? 'ইন-স্টক অর্ডার সেটআপ' : 'In-stock order setup'}
                    subtitle={isBn ? `${formatNumber(stockQty, 'bn')} ${item.unit} এখনই ডেলিভারি হবে।` : `${stockQty} ${item.unit} can ship now.`}
                    section={sections.stock}
                    sectionKey="stock"
                    addresses={addresses}
                    deliveryOptions={deliveryOptions}
                    paymentMethods={paymentMethods}
                    deliveryByCode={deliveryByCode}
                    itemsTotal={unitPrice * stockQty}
                    qtyLabel={`${formatNumber(stockQty, isBn ? 'bn' : 'en')} ${item.unit}`}
                    note={note}
                    setNote={setNote}
                    isSubmitting={isSubmitting}
                    onBack={() => setStep('choice')}
                    onSubmit={submitStockOrder}
                    updateSection={updateSection}
                    updateAddress={updateAddress}
                  />
                )}

                {step === 'preorder' && (
                  <ConfigStep
                    isBn={isBn}
                    title={isBn ? 'প্রি-অর্ডার সেটআপ' : 'Pre-order setup'}
                    subtitle={isBn ? `${formatNumber(preOrderQty, 'bn')} ${item.unit} স্টক আসার পর ডেলিভারি হবে।` : `${preOrderQty} ${item.unit} will be delivered later.`}
                    section={sections.preorder}
                    sectionKey="preorder"
                    addresses={addresses}
                    deliveryOptions={deliveryOptions}
                    paymentMethods={paymentMethods}
                    deliveryByCode={deliveryByCode}
                    itemsTotal={unitPrice * preOrderQty}
                    qtyLabel={`${formatNumber(preOrderQty, isBn ? 'bn' : 'en')} ${item.unit}`}
                    note={note}
                    setNote={setNote}
                    isSubmitting={isSubmitting}
                    onBack={() => setStep('stock')}
                    onSubmit={submitPreOrder}
                    updateSection={updateSection}
                    updateAddress={updateAddress}
                  />
                )}

                {step === 'success' && (
                  <SuccessStep
                    isBn={isBn}
                    orders={createdOrders}
                    onClose={handleClose}
                    onTrack={() => {
                      handleClose();
                      router.push('/dashboard/orders');
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function buildInitialSections(deliveryCode: string, paymentCode: string, user?: any, selectedAddressId?: string): Record<SectionKey, SectionState> {
  const baseAddress: AddressDraft = {
    mode: selectedAddressId ? 'saved' : 'custom',
    selectedAddressId,
    name: user?.name || '',
    phone: user?.phone || '',
    cascade: defaultCascade,
  };
  const base = { deliveryCode: deliveryCode || 'inside_dhaka', paymentCode: paymentCode || 'cod' };
  return {
    combined: { ...base, address: { ...baseAddress } },
    stock: { ...base, address: { ...baseAddress } },
    preorder: { ...base, address: { ...baseAddress } },
  };
}

function ProductSummary({
  item,
  quantity,
  setQuantity,
  stockQty,
  preOrderQty,
  unitPrice,
  isBn,
}: {
  item: CartItem;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  stockQty: number;
  preOrderQty: number;
  unitPrice: number;
  isBn: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/40">
          <Image src={item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300'} alt={item.nameEn} fill className="object-contain p-1" />
        </div>
        <div className="min-w-0">
          <h4 className="truncate text-sm font-black text-foreground">{isBn ? item.nameBn || item.nameEn : item.nameEn}</h4>
          <p className="text-xs font-semibold text-muted-foreground">{formatBDT(unitPrice)} / {item.unit}</p>
          <p className="mt-1 text-[11px] font-bold text-muted-foreground">
            {isBn
              ? `স্টক: ${formatNumber(stockQty, 'bn')} | প্রি-অর্ডার: ${formatNumber(preOrderQty, 'bn')}`
              : `Stock ${formatNumber(stockQty, 'en')} | Pre-order ${formatNumber(preOrderQty, 'en')}`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="flex items-center gap-1 rounded-xl border border-border bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
            className="h-8 w-16 rounded-lg border border-border bg-background text-center text-xs font-black text-foreground outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-background text-foreground hover:bg-muted cursor-pointer transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold text-muted-foreground">{isBn ? 'আইটেম মোট' : 'Items total'}</p>
          <p className="text-sm font-black text-primary">{formatBDT(unitPrice * quantity)}</p>
        </div>
      </div>
    </div>
  );
}

function FlowCard({
  selected,
  icon,
  title,
  description,
  total,
  onClick,
}: {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  total: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'min-h-36 rounded-2xl border p-4 text-left transition-all cursor-pointer',
        selected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-background hover:bg-muted/50'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', selected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}>
          {icon}
        </span>
        {selected && <Check className="h-5 w-5 text-primary" />}
      </div>
      <h4 className="mt-4 text-sm font-black text-foreground">{title}</h4>
      <p className="mt-1 min-h-12 text-xs font-semibold leading-5 text-muted-foreground">{description}</p>
      <p className="mt-3 text-sm font-black text-primary">{formatBDT(total)}</p>
    </button>
  );
}

function ConfigStep({
  title,
  subtitle,
  section,
  sectionKey,
  addresses,
  deliveryOptions,
  paymentMethods,
  deliveryByCode,
  itemsTotal,
  qtyLabel,
  note,
  setNote,
  isSubmitting,
  onBack,
  onSubmit,
  updateSection,
  updateAddress,
  isBn = true,
}: {
  title: string;
  subtitle: string;
  section: SectionState;
  sectionKey: SectionKey;
  addresses: any[];
  deliveryOptions: DynamicDeliveryOption[];
  paymentMethods: DynamicPaymentMethod[];
  deliveryByCode: Map<string, DynamicDeliveryOption>;
  itemsTotal: number;
  qtyLabel: string;
  note: string;
  setNote: (value: string) => void;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
  updateSection: (key: SectionKey, patch: Partial<SectionState>) => void;
  updateAddress: (key: SectionKey, patch: Partial<AddressDraft>) => void;
  isBn?: boolean;
}) {
  const delivery = deliveryByCode.get(section.deliveryCode) || deliveryOptions[0];
  const deliveryCharge = Number(delivery?.charge ?? 60);
  const grandTotal = itemsTotal + deliveryCharge;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-black text-foreground">{title}</h4>
        <p className="text-xs font-semibold text-muted-foreground">{subtitle}</p>
      </div>

      <Panel title={isBn ? 'ডেলিভারি ঠিকানা' : 'Delivery address'}>
        {addresses.length > 0 && (
          <div className="mb-3 flex gap-2 rounded-xl border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => updateAddress(sectionKey, { mode: 'saved' })}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-xs font-black cursor-pointer transition-colors',
                section.address.mode === 'saved' ? 'bg-background text-primary shadow-2xs' : 'text-muted-foreground'
              )}
            >
              {isBn ? 'সংরক্ষিত ঠিকানা' : 'Saved'}
            </button>
            <button
              type="button"
              onClick={() => updateAddress(sectionKey, { mode: 'custom' })}
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-xs font-black cursor-pointer transition-colors',
                section.address.mode === 'custom' ? 'bg-background text-primary shadow-2xs' : 'text-muted-foreground'
              )}
            >
              {isBn ? 'নতুন ঠিকানা' : 'New address'}
            </button>
          </div>
        )}

        {section.address.mode === 'saved' && addresses.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {addresses.map((address) => {
              const selected = section.address.selectedAddressId === address.id || (!section.address.selectedAddressId && address.isDefault);
              return (
                <button
                  type="button"
                  key={address.id}
                  onClick={() => updateAddress(sectionKey, { selectedAddressId: address.id })}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all cursor-pointer',
                    selected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-background hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {address.label?.toLowerCase().includes('office') ? (
                      <Building2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Home className="h-4 w-4 text-primary" />
                    )}
                    <span className="truncate text-xs font-black text-foreground">{address.label || address.fullName || 'Address'}</span>
                  </div>
                  <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
                    {address.streetAddress || address.addressLine}, {address.area || address.thana}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={section.address.name}
                onChange={(event) => updateAddress(sectionKey, { name: event.target.value })}
                placeholder={isBn ? 'প্রাপকের নাম' : 'Recipient name'}
                className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"
              />
              <input
                value={section.address.phone}
                onChange={(event) => updateAddress(sectionKey, { phone: event.target.value })}
                placeholder="01XXXXXXXXX"
                className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"
              />
            </div>
            <CascadingAddressSelector value={section.address.cascade} onChange={(cascade) => updateAddress(sectionKey, { cascade })} isBn={isBn} />
          </div>
        )}
      </Panel>

      <Panel title={isBn ? 'ডেলিভারি মেথড' : 'Delivery option'}>
        <div className="grid gap-2 sm:grid-cols-3">
          {deliveryOptions.map((option) => {
            const code = option.code || option.id;
            const selected = section.deliveryCode === code;
            return (
              <button
                type="button"
                key={code}
                onClick={() => updateSection(sectionKey, { deliveryCode: code })}
                className={cn(
                  'rounded-xl border p-3 text-left transition-all cursor-pointer',
                  selected ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-background hover:bg-muted/50'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-black text-foreground">{isBn ? option.nameBn || option.nameEn : option.nameEn}</span>
                  {selected && <Check className="h-4 w-4 text-primary" />}
                </div>
                <p className="mt-2 text-sm font-black text-primary">{formatBDT(Number(option.charge || 0))}</p>
                <p className="mt-1 text-[11px] font-semibold text-muted-foreground">{isBn ? option.estimatedDaysBn || option.estimatedDaysEn : option.estimatedDaysEn}</p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title={isBn ? 'পেমেন্ট পদ্ধতি' : 'Payment method'}>
        {/* Compact, clean, 4-column payment cards matching the design */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {paymentMethods.map((method) => {
            const code = (method.code || method.id || '').toLowerCase();
            const selected = (section.paymentCode || '').toLowerCase() === code;
            return (
              <button
                type="button"
                key={code}
                onClick={() => updateSection(sectionKey, { paymentCode: code })}
                className={cn(
                  'relative flex h-[100px] sm:h-[110px] w-full flex-col items-center justify-center rounded-2xl border p-2 text-center transition-all cursor-pointer select-none',
                  selected
                    ? 'border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-200/60 dark:ring-indigo-800/40 shadow-xs'
                    : 'border-border bg-background hover:bg-muted/40 hover:border-border/80'
                )}
              >
                {/* Radio selection indicator */}
                <div className="absolute left-2.5 top-2.5">
                  <div
                    className={cn(
                      'flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full transition-all',
                      selected
                        ? 'border-2 border-indigo-600 bg-indigo-600'
                        : 'border-2 border-muted-foreground/30 bg-background'
                    )}
                  >
                    {selected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <div className="flex h-full w-full items-center justify-center pt-1">
                  <PaymentBrandIcon code={code} isBn={isBn} />
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 text-[11px] font-semibold text-muted-foreground">
          {isBn
            ? 'পছন্দসই পেমেন্ট মাধ্যম সিলেক্ট করে প্রি-অর্ডার সম্পন্ন করুন।'
            : 'Select your preferred payment method to confirm pre-order.'}
        </p>
      </Panel>

      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder={isBn ? 'অতিরিক্ত নোট (ঐচ্ছিক)' : 'Order note (optional)'}
        className="min-h-20 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary"
      />

      <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>{isBn ? 'পরিমাণ' : 'Quantity'}</span>
          <span className="font-bold text-foreground">{qtyLabel}</span>
        </div>
        <div className="mt-2 flex justify-between text-muted-foreground">
          <span>{isBn ? 'আইটেম মোট' : 'Items total'}</span>
          <span className="font-bold text-foreground">{formatBDT(itemsTotal)}</span>
        </div>
        <div className="mt-2 flex justify-between text-muted-foreground">
          <span>{isBn ? 'ডেলিভারি চার্জ' : 'Delivery charge'}</span>
          <span className="font-bold text-foreground">{formatBDT(deliveryCharge)}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-black text-foreground">
          <span>{isBn ? 'মোট প্রদেয়' : 'Payable'}</span>
          <span className="text-primary">{formatBDT(grandTotal)}</span>
        </div>
      </div>

      <FooterActions
        primaryLabel={isSubmitting ? (isBn ? 'অর্ডার হচ্ছে...' : 'Processing...') : (isBn ? 'অর্ডার নিশ্চিত করুন' : 'Confirm order')}
        secondaryLabel={isBn ? 'পেছনে' : 'Back'}
        onSecondary={onBack}
        onPrimary={onSubmit}
        disabled={isSubmitting}
      />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h5 className="text-xs font-black uppercase tracking-wide text-foreground">{title}</h5>
      <div className="rounded-2xl border border-border bg-card p-3">{children}</div>
    </section>
  );
}

function FooterActions({
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  disabled,
}: {
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      {onSecondary && (
        <button
          type="button"
          onClick={onSecondary}
          className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-xs font-black text-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{secondaryLabel || 'Back'}</span>
        </button>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={onPrimary}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-white shadow-md hover:bg-primary-dark active:scale-95 disabled:opacity-60 cursor-pointer transition-all"
      >
        <span>{primaryLabel}</span>
        {disabled ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : <ArrowRight className="h-4 w-4 shrink-0" />}
      </button>
    </div>
  );
}

function SuccessStep({ orders, onClose, onTrack, isBn = true }: { orders: any[]; onClose: () => void; onTrack: () => void; isBn?: boolean }) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <div>
        <h4 className="text-xl font-black text-foreground">
          {isBn ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে' : 'Order placed successfully'}
        </h4>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {isBn
            ? orders.length > 1
              ? 'দুটি আলাদা অর্ডারের ট্র্যাকিং প্রস্তুত।'
              : 'আপনার অর্ডার ট্র্যাকিংয়ের জন্য প্রস্তুত।'
            : orders.length > 1
              ? 'Two separate orders are ready for tracking.'
              : 'Your order is ready for tracking.'}
        </p>
      </div>

      <div className="grid gap-2 text-left">
        {orders.map((order, index) => (
          <div key={order?.id || index} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black text-foreground">
                  {order?.isPreOrder
                    ? isBn
                      ? 'প্রি-অর্ডার চালান'
                      : 'Pre-order order'
                    : isBn
                      ? 'ইন-স্টক চালান'
                      : 'In-stock order'}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-muted-foreground">#{order?.orderNumber || order?.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-primary">{formatBDT(Number(order?.grandTotal || 0))}</p>
                <p className="text-[11px] font-bold capitalize text-muted-foreground">{order?.paymentStatus || 'pending'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border px-5 py-3 text-xs font-black text-foreground hover:bg-muted cursor-pointer transition-colors"
        >
          {isBn ? 'বন্ধ করুন' : 'Close'}
        </button>
        <button
          type="button"
          onClick={onTrack}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-black text-white shadow-md hover:bg-primary-dark cursor-pointer transition-all"
        >
          {isBn ? 'অর্ডার ট্র্যাক করুন' : 'Track orders'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
