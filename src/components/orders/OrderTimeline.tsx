'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Package, Truck, Navigation, CheckCircle2 } from 'lucide-react';
import { TimelineStep } from '@/types/order';
import { cn } from '@/lib/utils';

interface OrderTimelineProps {
  timeline: TimelineStep[];
  isBn?: boolean;
}

export function OrderTimeline({ timeline, isBn = true }: OrderTimelineProps) {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Clock className="h-4 w-4" />;
      case 1:
        return <CheckCircle2 className="h-4 w-4" />;
      case 2:
        return <Package className="h-4 w-4" />;
      case 3:
        return <Truck className="h-4 w-4" />;
      case 4:
        return <Navigation className="h-4 w-4" />;
      case 5:
        return <Check className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold text-foreground">
        {isBn ? 'অর্ডার ট্র্যাকিং টাইমলাইন' : 'Order Tracking Timeline'}
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
        {timeline.map((step, idx) => {
          return (
            <motion.div
              key={step.status}
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
                  getStepIcon(idx)
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 rounded-2xl border border-border bg-background p-3.5 shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={cn(
                      'text-xs font-bold',
                      step.isCompleted || step.isCurrent
                        ? 'text-foreground'
                        : 'text-muted-foreground'
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
