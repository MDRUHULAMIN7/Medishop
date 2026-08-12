'use client';

import React, { useMemo } from 'react';
import {
  getDivisions,
  getDistrictsByDivision,
  getThanasByDistrict,
} from '@/data/bangladeshLocations';
import { CustomSelect } from '@/components/ui/CustomSelect';

export interface AddressCascadeValue {
  division: string;
  district: string;
  thana: string;
  streetAddress: string;
}

interface CascadingAddressSelectorProps {
  value: AddressCascadeValue;
  onChange: (newValue: AddressCascadeValue) => void;
  isBn?: boolean;
}

export function CascadingAddressSelector({
  value,
  onChange,
  isBn = true,
}: CascadingAddressSelectorProps) {
  const divisions = useMemo(() => getDivisions(), []);
  const currentDivision = value.division || divisions[0] || 'Dhaka';

  const districts = useMemo(() => {
    return getDistrictsByDivision(currentDivision);
  }, [currentDivision]);

  const currentDistrict = value.district && districts.includes(value.district)
    ? value.district
    : districts[0] || '';

  const thanas = useMemo(() => {
    return getThanasByDistrict(currentDivision, currentDistrict);
  }, [currentDivision, currentDistrict]);

  const currentThana = value.thana && thanas.includes(value.thana)
    ? value.thana
    : thanas[0] || '';

  const handleDivisionChange = (newDivision: string) => {
    const newDistricts = getDistrictsByDivision(newDivision);
    const newDistrict = newDistricts[0] || '';
    const newThanas = getThanasByDistrict(newDivision, newDistrict);
    const newThana = newThanas[0] || '';

    onChange({
      ...value,
      division: newDivision,
      district: newDistrict,
      thana: newThana,
    });
  };

  const handleDistrictChange = (newDistrict: string) => {
    const newThanas = getThanasByDistrict(currentDivision, newDistrict);
    const newThana = newThanas[0] || '';

    onChange({
      ...value,
      district: newDistrict,
      thana: newThana,
    });
  };

  const handleThanaChange = (newThana: string) => {
    onChange({
      ...value,
      thana: newThana,
    });
  };

  const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      streetAddress: e.target.value,
    });
  };

  return (
    <div className="space-y-4">
      {/* Division, District, Thana Cascading Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Division Dropdown */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            {isBn ? 'বিভাগ (Division) *' : 'Division *'}
          </label>
          <CustomSelect
            value={currentDivision}
            onChange={handleDivisionChange}
            options={divisions.map((div) => ({ value: div, label: div }))}
          />
        </div>

        {/* District Dropdown */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            {isBn ? 'জেলা (District) *' : 'District *'}
          </label>
          <CustomSelect
            value={currentDistrict}
            onChange={handleDistrictChange}
            options={districts.map((dist) => ({ value: dist, label: dist }))}
          />
        </div>

        {/* Thana Dropdown */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-1">
            {isBn ? 'থানা (Thana / Upazila) *' : 'Thana / Upazila *'}
          </label>
          <CustomSelect
            value={currentThana}
            onChange={handleThanaChange}
            options={thanas.map((th) => ({ value: th, label: th }))}
          />
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-xs font-bold text-foreground mb-1">
          {isBn ? 'পূর্ণাঙ্গ বাসা/রোড/এলাকার ঠিকানা *' : 'Street Address (House/Road/Area) *'}
        </label>
        <input
          type="text"
          required
          value={value.streetAddress || ''}
          onChange={handleStreetAddressChange}
          placeholder={isBn ? 'যেমন: বাসা ৪২, রোড ১০/এ, সেক্টর ৪' : 'e.g. House 42, Road 10/A, Sector 4'}
          className="h-10 w-full rounded-2xl border border-border bg-background px-3.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
    </div>
  );
}
