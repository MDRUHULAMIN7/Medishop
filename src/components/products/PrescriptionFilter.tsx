'use client';

import React from 'react';
import { PrescriptionFilterValue } from '@/types/product';
import { useAppSelector } from '@/store';

interface PrescriptionFilterProps {
  value: PrescriptionFilterValue;
  onChange: (value: PrescriptionFilterValue) => void;
}

export function PrescriptionFilter({
  value,
  onChange,
}: PrescriptionFilterProps) {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const OPTIONS: { value: PrescriptionFilterValue; labelBn: string; labelEn: string }[] = [
    { value: 'all', labelBn: 'সকল ওষুধ', labelEn: 'All Medicines' },
    { value: 'required', labelBn: 'প্রেসক্রিপশন আবশ্যক (Rx)', labelEn: 'Prescription Required (Rx)' },
    { value: 'otc', labelBn: 'ওটিসি / প্রেসক্রিপশন ছাড়া (OTC)', labelEn: 'OTC / Over The Counter' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {isBn ? 'প্রেসক্রিপশন ধরন' : 'Prescription Status'}
      </h4>
      <div className="flex flex-col gap-1.5">
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-xs cursor-pointer select-none py-1 px-1 rounded-lg hover:bg-muted/40"
          >
            <input
              type="radio"
              name="prescriptionReq"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="text-primary border-border focus:ring-primary"
            />
            <span className="font-medium text-foreground">
              {isBn ? opt.labelBn : opt.labelEn}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
