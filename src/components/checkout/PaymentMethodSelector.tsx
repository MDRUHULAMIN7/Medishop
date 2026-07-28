'use client';

import React from 'react';
import { Banknote, Smartphone, CreditCard, Check, Info } from 'lucide-react';
import { PaymentMethod, PaymentMethodId } from '@/types/checkout';
import { cn } from '@/lib/utils';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedId: PaymentMethodId;
  onSelect: (id: PaymentMethodId) => void;
  isBn?: boolean;
}

export function PaymentMethodSelector({
  methods,
  selectedId,
  onSelect,
  isBn = true,
}: PaymentMethodSelectorProps) {
  const getIcon = (id: PaymentMethodId) => {
    switch (id) {
      case 'cod':
        return <Banknote className="h-5 w-5 text-emerald-600" />;
      case 'card':
        return <CreditCard className="h-5 w-5 text-sky-600" />;
      default:
        return <Smartphone className="h-5 w-5 text-rose-600" />;
    }
  };

  const selectedMethod = methods.find((m) => m.id === selectedId);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground">
        {isBn ? 'পেমেন্ট পদ্ধতি নির্বাচন করুন' : 'Select Payment Method'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {methods.map((method) => {
          const isSelected = method.id === selectedId;

          return (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={cn(
                'relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-border bg-background hover:border-primary/40 hover:shadow-xs'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60">
                  {getIcon(method.id)}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-foreground">
                    {isBn ? method.nameBn : method.nameEn}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {isBn ? method.descriptionBn : method.descriptionEn}
                  </p>
                </div>
              </div>

              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all',
                  isSelected
                    ? 'border-primary bg-primary text-white'
                    : 'border-muted-foreground/30 bg-background'
                )}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Instruction Banner */}
      {selectedMethod && (
        <div className="rounded-xl bg-muted/40 p-3.5 border border-border flex items-start gap-2.5">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-foreground">
              {isBn ? selectedMethod.nameBn : selectedMethod.nameEn}
            </p>
            <p className="text-muted-foreground mt-0.5">
              {isBn ? selectedMethod.descriptionBn : selectedMethod.descriptionEn}
            </p>
            {(selectedMethod.instructionsEn || selectedMethod.instructionsBn) && (
              <p className="mt-1 font-mono font-bold text-primary">
                {isBn ? selectedMethod.instructionsBn : selectedMethod.instructionsEn}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
