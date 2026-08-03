import React, { useState, useEffect } from 'react';
import {
  Settings,
  Palette,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Lock,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import {
  HOTLINE_NUMBER,
  PHONE_SECONDARY,
  COMPANY_EMAIL_PRIMARY,
  COMPANY_ADDRESS_BN,
} from '@/lib/constants';
import { toast } from 'sonner';

export function SettingsManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [siteName, setSiteName] = useState('mediShop');
  const [hotline, setHotline] = useState(HOTLINE_NUMBER);
  const [secondaryPhone, setSecondaryPhone] = useState(PHONE_SECONDARY);
  const [email, setEmail] = useState(COMPANY_EMAIL_PRIMARY);
  const [address, setAddress] = useState(COMPANY_ADDRESS_BN);
  const [primaryColor, setPrimaryColor] = useState('#1D4ED8');
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  const themeColors = [
    { name: 'Royal Blue (Default)', hex: '#1D4ED8' },
    { name: 'Medical Emerald', hex: '#059669' },
    { name: 'Healthcare Purple', hex: '#7C3AED' },
    { name: 'Pharmacy Rose', hex: '#E11D48' },
  ];

  // Initialize saved theme color from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem('medishop_theme_primary');
    if (saved) {
      setPrimaryColor(saved);
      document.documentElement.style.setProperty('--color-primary', saved);
      document.documentElement.style.setProperty('--color-ring', saved);
    }
  }, []);

  const handleApplyColor = (hex: string, name: string) => {
    setPrimaryColor(hex);
    document.documentElement.style.setProperty('--color-primary', hex);
    document.documentElement.style.setProperty('--color-ring', hex);
    localStorage.setItem('medishop_theme_primary', hex);
    toast.success(
      isBn
        ? `সাইটের প্রাইমারি থিম কালার ডাইনামিক্যালি পরিবর্তিত হয়েছে (${name})`
        : `Theme primary color dynamically updated to ${name} across website!`
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('medishop_theme_primary', primaryColor);
    toast.success(
      isBn
        ? 'সাইট ব্র্যান্ডিং ও সেটিংস সফলভাবে সংরক্ষিত হয়েছে!'
        : 'Site branding & settings saved successfully!'
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'সাইট ব্র্যান্ডিং, কন্টাক্ট ও থিম সেটিংস' : 'Site Branding & Theme Control'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'ওয়েবসাইটের নাম, সরাসরি হেল্পলাইন নম্বর, অফিস ঠিকানা ও থিম কালার নিয়ন্ত্রণ করুন'
              : 'Configure site title, hotline phone numbers, office location and primary theme'}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all active:scale-95 shrink-0"
        >
          <Save className="h-4 w-4" />
          <span>{isBn ? 'সেটিংস সংরক্ষণ করুন' : 'Save Settings'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Section 1: Branding & Contact Info */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-2xs">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span>{isBn ? 'ব্র্যান্ডিং ও কন্টাক্ট ইনফরমেশন' : 'Branding & Contact Info'}</span>
          </h3>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-bold text-foreground block mb-1">
                Website Brand Name *
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-foreground block mb-1">
                  Primary Hotline *
                </label>
                <input
                  type="text"
                  value={hotline}
                  onChange={(e) => setHotline(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 font-semibold text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-foreground block mb-1">
                  Secondary Phone
                </label>
                <input
                  type="text"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 font-semibold text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">
                Official Support Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-foreground block mb-1">
                Bangladesh Office Address *
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Theme Primary Color & Maintenance Mode */}
        <div className="flex flex-col gap-6">
          {/* Primary Color Palette */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 shadow-2xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <span>{isBn ? 'প্রাইমারি থিম কালার টোকেন' : 'Theme Primary Color'}</span>
            </h3>

            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-muted-foreground">
                Select your pharmacy primary accent color token:
              </span>

              <div className="grid grid-cols-2 gap-3">
                {themeColors.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => handleApplyColor(col.hex, col.name)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-xs font-bold transition-all ${
                      primaryColor === col.hex
                        ? 'border-primary ring-2 ring-primary/30 bg-primary/5'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-lg shadow-2xs shrink-0"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="truncate">{col.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Maintenance Mode Switch */}
          <div className="flex items-center justify-between rounded-2xl border border-border bg-background p-6 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-foreground block">
                  {isBn ? 'সিস্টেম মেইনটেন্যান্স মোড' : 'Maintenance Mode'}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {isBn ? 'ওয়েবসাইট বন্ধ রেখে আপডেট দিন' : 'Temporarily disable customer checkout for updates'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMaintenanceMode(!isMaintenanceMode);
                toast.warning(
                  !isMaintenanceMode
                    ? 'মেইনটেন্যান্স মোড সক্রিয় করা হয়েছে'
                    : 'মেইনটেন্যান্স মোড বন্ধ করা হয়েছে'
                );
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition-colors ${
                isMaintenanceMode
                  ? 'bg-rose-600 text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {isMaintenanceMode ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
