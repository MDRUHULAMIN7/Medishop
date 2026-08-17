'use client';

import { motion } from 'framer-motion';
import { Check, Clock, Package, Truck, CheckCircle2, Search, Sparkles } from 'lucide-react';
import { TimelineStep, OrderStatus, PreOrderStatus } from '@/types/order';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
  timeline?: TimelineStep[];
  status?: OrderStatus | PreOrderStatus;
  isPreOrder?: boolean;
  isBn?: boolean;
}

export function OrderTimeline({ timeline, status, isPreOrder = false, isBn = true }: OrderTimelineProps) {
  // If timeline steps are explicitly provided, use them
  if (timeline && timeline.length > 0) {
    return (
      <div className="space-y-4">
        <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {timeline.map((step, idx) => {
            return (
              <motion.div
                key={step.status + idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="relative flex items-start gap-3.5"
              >
                {/* Step Circle Marker */}
                <div
                  className={cn(
                    'absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                    step.isCompleted
                      ? 'border-primary bg-primary text-white shadow-xs'
                      : step.isCurrent
                      ? 'border-primary bg-background text-primary ring-4 ring-primary/20'
                      : 'border-border bg-background text-muted-foreground/40'
                  )}
                >
                  {step.isCompleted ? (
                    <Check className="h-3 w-3 stroke-[3]" />
                  ) : (
                    <Clock className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 rounded-2xl border border-border bg-background p-3.5 shadow-2xs">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={cn(
                        'text-xs font-bold',
                        step.isCompleted || step.isCurrent ? 'text-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {isBn ? step.titleBn : step.titleEn}
                    </h4>

                    {step.timestamp && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {step.timestamp}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {isBn ? step.descriptionBn : step.descriptionEn}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Pre-Order Specialized 5-Step Lifecycle Timeline
  if (isPreOrder) {
    const currentStatus = (status as PreOrderStatus) || 'pending';
    const preOrderSteps = [
      {
        key: 'pending',
        titleBn: 'প্রি-অর্ডার গৃহীত হয়েছে',
        titleEn: 'Pre-Order Placed',
        descBn: 'আপনার প্রি-অর্ডারটি সফলভাবে রেকর্ড করা হয়েছে।',
        descEn: 'Your pre-order has been placed and received.',
        icon: <Clock className="h-3.5 w-3.5" />,
      },
      {
        key: 'sourcing',
        titleBn: 'ওষুধ সোর্সিং/সংগ্রহ চলছে',
        titleEn: 'Sourcing Medicine',
        descBn: 'আমাদের ফার্মাসিস্ট টিম ভেরিফাইড প্রস্তুতকারকের কাছ থেকে ওষুধ সংগ্রহ করছে।',
        descEn: 'Our pharmacy team is actively procuring from verified manufacturers.',
        icon: <Search className="h-3.5 w-3.5" />,
      },
      {
        key: 'ready_to_ship',
        titleBn: 'শিপমেন্টের জন্য প্রস্তুত',
        titleEn: 'Ready for Shipment',
        descBn: 'ওষুধ ইনভেন্টরিতে এসে পৌঁছেছে এবং কোয়ালিটি চেক সম্পন্ন হয়েছে।',
        descEn: 'Medicines received in stock & quality inspection completed.',
        icon: <Sparkles className="h-3.5 w-3.5" />,
      },
      {
        key: 'shipped',
        titleBn: 'কুরিয়ারে হস্তান্তর ও ডেলিভারি শুরু',
        titleEn: 'Handed to Courier (In Transit)',
        descBn: 'পার্সেলটি আপনার ঠিকানায় ডেলিভারির উদ্দেশ্যে পাঠানো হয়েছে।',
        descEn: 'Package has been dispatched and is on its way.',
        icon: <Truck className="h-3.5 w-3.5" />,
      },
      {
        key: 'delivered',
        titleBn: 'সফলভাবে ডেলিভারি সম্পন্ন',
        titleEn: 'Successfully Delivered',
        descBn: 'গ্রাহকের নিকট ওষুধ পৌঁছে দেওয়া হয়েছে।',
        descEn: 'The order has been safely delivered to the customer.',
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      },
    ];

    const statusWeights: Record<string, number> = {
      pending: 0,
      processing: 1,
      sourcing: 1,
      ready_to_ship: 2,
      shipped: 3,
      delivered: 4,
      cancelled: -1,
    };

    const currentWeight = statusWeights[currentStatus] ?? 0;

    return (
      <div className="space-y-4">
        <div className="relative pl-6 space-y-3.5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {preOrderSteps.map((step, idx) => {
            const isCompleted = currentWeight > idx;
            const isCurrent = currentWeight === idx;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative flex items-start gap-3"
              >
                <div
                  className={cn(
                    'absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                    isCompleted
                      ? 'border-primary bg-primary text-white shadow-xs'
                      : isCurrent
                      ? 'border-primary bg-background text-primary ring-4 ring-primary/20 shadow-xs'
                      : 'border-border bg-background text-muted-foreground/40'
                  )}
                >
                  {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : step.icon}
                </div>

                <div
                  className={cn(
                    'flex-1 rounded-2xl border p-3 shadow-2xs transition-all',
                    isCurrent
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-border bg-background'
                  )}
                >
                  <h4
                    className={cn(
                      'text-xs font-bold',
                      isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {isBn ? step.titleBn : step.titleEn}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                    {isBn ? step.descBn : step.descEn}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // Standard In-Stock 4-Step Lifecycle Timeline
  const currentStatus = (status as OrderStatus) || 'pending';
  const standardSteps = [
    {
      key: 'pending',
      titleBn: 'অর্ডার গৃহীত হয়েছে',
      titleEn: 'Order Placed',
      descBn: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।',
      descEn: 'Your order has been received.',
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    {
      key: 'processing',
      titleBn: 'ফার্মাসিস্ট ভেরিফিকেশন ও প্যাকিং',
      titleEn: 'Processing & Packing',
      descBn: 'রেজিস্টার্ড ফার্মাসিস্ট দ্বারা ওষুধ যাচাই ও প্যাকেজিং সম্পন্ন হচ্ছে।',
      descEn: 'Prescription verified and medicine packed securely.',
      icon: <Package className="h-3.5 w-3.5" />,
    },
    {
      key: 'shipped',
      titleBn: 'ডেলিভারিতে বের হয়েছে (২৪ ঘণ্টা)',
      titleEn: 'Out for Delivery (24 Hours)',
      descBn: 'রাইডার পণ্য নিয়ে আপনার ঠিকানার উদ্দেশ্যে রওনা হয়েছে।',
      descEn: 'Delivery rider is on the way to your address.',
      icon: <Truck className="h-3.5 w-3.5" />,
    },
    {
      key: 'delivered',
      titleBn: 'সফলভাবে ডেলিভারি সম্পন্ন',
      titleEn: 'Successfully Delivered',
      descBn: 'পণ্যটি আপনার কাছে সফলভাবে পৌঁছে দেওয়া হয়েছে।',
      descEn: 'The order has been safely delivered.',
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
  ];

  const statusWeights: Record<string, number> = {
    pending: 0,
    placed: 0,
    processing: 1,
    confirmed: 1,
    packed: 1,
    shipped: 2,
    out_for_delivery: 2,
    delivered: 3,
    cancelled: -1,
  };

  const currentWeight = statusWeights[currentStatus] ?? 0;

  return (
    <div className="space-y-4">
      <div className="relative pl-6 space-y-3.5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {standardSteps.map((step, idx) => {
          const isCompleted = currentWeight > idx;
          const isCurrent = currentWeight === idx;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative flex items-start gap-3"
            >
              <div
                className={cn(
                  'absolute -left-6 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all',
                  isCompleted
                    ? 'border-primary bg-primary text-white shadow-xs'
                    : isCurrent
                    ? 'border-primary bg-background text-primary ring-4 ring-primary/20 shadow-xs'
                    : 'border-border bg-background text-muted-foreground/40'
                )}
              >
                {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : step.icon}
              </div>

              <div
                className={cn(
                  'flex-1 rounded-2xl border p-3 shadow-2xs transition-all',
                  isCurrent ? 'border-primary/40 bg-primary/5' : 'border-border bg-background'
                )}
              >
                <h4
                  className={cn(
                    'text-xs font-bold',
                    isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {isBn ? step.titleBn : step.titleEn}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  {isBn ? step.descBn : step.descEn}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
