'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Globe,
  Palette,
  CreditCard,
  Truck,
  Search,
  FileText,
  ShieldAlert,
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { settingsService, FullSiteSettings } from '@/services/settings.service';
import { useBranding } from '@/context/BrandingContext';
import { toast } from 'sonner';

export function SettingsManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const { updateLocalPreview, refreshSettings } = useBranding();

  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'payment' | 'shipping' | 'seo' | 'legal' | 'maintenance'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<FullSiteSettings>({
    general: {
      siteName: 'mediShop',
      tagline: 'Online Pharmacy BD',
      logoLight: '/images/logo.png',
      favicon: '/favicon.ico',
      contactEmail: 'support@medishop.com.bd',
      contactPhone: '+880 1742-643763',
      address: 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
    },
    branding: {
      primaryColor: '#1D4ED8',
      accentColor: '#F59E0B',
      fontHeading: 'Inter',
      fontBody: 'Inter',
    },
    payment: {
      codEnabled: true,
      minOrderForCod: 0,
      enabledGateways: ['cod', 'bkash', 'nagad', 'card'],
    },
    shipping: {
      freeShippingThreshold: 1000,
      defaultDeliveryChargeInsideDhaka: 60,
      defaultDeliveryChargeOutsideDhaka: 120,
      estimatedDeliveryDays: '2 - 4 working days',
    },
    seo: {
      defaultMetaTitle: 'mediShop — Online Pharmacy BD',
      defaultMetaDescription: 'Genuine medicine doorstep delivery in Bangladesh',
      ogImage: '/images/og-banner.png',
    },
    legal: {
      termsContent: 'Welcome to mediShop terms and conditions.',
      privacyContent: 'We protect your health information confidentiality.',
      refundPolicyContent: 'Returns accepted within 7 days for sealed packages.',
    },
    maintenanceMode: false,
  });

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await settingsService.getFullSettings();
      if (data) {
        setFormData(data);
      }
    } catch (err: any) {
      console.error('Failed to load full settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handlePrimaryColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      branding: { ...prev.branding, primaryColor: color },
    }));
    updateLocalPreview({ branding: { primaryColor: color, accentColor: formData.branding.accentColor } });
  };

  const handleAccentColorChange = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      branding: { ...prev.branding, accentColor: color },
    }));
    updateLocalPreview({ branding: { primaryColor: formData.branding.primaryColor, accentColor: color } });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await settingsService.updateSettings(formData);
      toast.success(
        isBn
          ? 'সাইট সেটিং ও ব্র্যান্ডিং সফলভাবে সংরক্ষিত ও লাইভ আপডেট হয়েছে!'
          : 'Site settings and branding saved and updated live!'
      );
      await refreshSettings();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'general', labelBn: 'সাধারণ তথ্য', labelEn: 'General Info', icon: Globe },
    { id: 'branding', labelBn: 'ব্র্যান্ডিং ও কালার', labelEn: 'Branding & Theme', icon: Palette },
    { id: 'payment', labelBn: 'পেমেন্ট মেথড', labelEn: 'Payment Gateways', icon: CreditCard },
    { id: 'shipping', labelBn: 'শিপিং ও ডেলিভারি', labelEn: 'Shipping & Delivery', icon: Truck },
    { id: 'seo', labelBn: 'এসইও ও মেটা', labelEn: 'SEO & Analytics', icon: Search },
    { id: 'legal', labelBn: 'লিগ্যাল কন্টেন্ট', labelEn: 'Legal & Policies', icon: FileText },
    { id: 'maintenance', labelBn: 'মেইনটেন্যান্স মোড', labelEn: 'Maintenance Mode', icon: ShieldAlert },
  ] as const;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>{isBn ? 'সেটিং লোড হচ্ছে...' : 'Loading site settings...'}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary border border-primary/20">
            <Globe className="h-3.5 w-3.5" />
            <span>{isBn ? 'গ্লোবাল প্ল্যাটফর্ম কাস্টমাইজেশন' : 'Global Platform Control'}</span>
          </span>
          <h2 className="text-xl font-extrabold text-foreground mt-1">
            {isBn ? 'সাইট সেটিং ও ডাইনামিক ব্র্যান্ডিং' : 'Site Settings & Dynamic Branding'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'এখানে ব্র্যান্ডিং বা কালার পরিবর্তন করলে লাইভ ওয়েবসাইটে কোনো রি-ডিপ্লয় ছাড়া সাথে সাথে পরিবর্তন দেখা যাবে'
              : 'Changes here update the live storefront immediately without code deploy.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isBn ? 'সেভ হচ্ছে...' : 'Saving...'}</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isBn ? 'সেটিংস সেভ করুন' : 'Save & Publish'}</span>
            </>
          )}
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Nav Tabs */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-2xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-background border border-border text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{isBn ? tab.labelBn : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Form Panels */}
        <div className="lg:col-span-9 rounded-3xl border border-border bg-background p-6 shadow-2xs space-y-6">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'সাধারণ ওয়েবসাইট তথ্য' : 'General Site Identity'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-foreground mb-1">Site Name:</label>
                  <input
                    type="text"
                    value={formData.general.siteName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, siteName: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Tagline / Subtitle:</label>
                  <input
                    type="text"
                    value={formData.general.tagline || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, tagline: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Contact Phone Hotline:</label>
                  <input
                    type="text"
                    value={formData.general.contactPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, contactPhone: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Contact Support Email:</label>
                  <input
                    type="email"
                    value={formData.general.contactEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, contactEmail: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Physical Pharmacy Address:</label>
                <textarea
                  rows={2}
                  value={formData.general.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, address: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* BRANDING TAB */}
          {activeTab === 'branding' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'লাইভ থিম কালার ও ব্র্যান্ডিং' : 'Live Brand Colors & Typography'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Primary Color Picker */}
                <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                  <span className="font-extrabold text-foreground block">
                    {isBn ? 'প্রাইমারি কালার (Primary Color):' : 'Primary Theme Color:'}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.branding.primaryColor}
                      onChange={(e) => handlePrimaryColorChange(e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-border p-1 bg-background"
                    />
                    <input
                      type="text"
                      value={formData.branding.primaryColor}
                      onChange={(e) => handlePrimaryColorChange(e.target.value)}
                      className="h-10 w-28 font-mono font-bold text-xs uppercase rounded-xl border border-border bg-background px-3"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {isBn
                      ? 'বাটন, হেডার লোগো, এক্টিভ ট্যাব ও ড্যাশবোর্ডের প্রধান রঙ'
                      : 'Used for main CTA buttons, header icons, active tabs, and primary highlights.'}
                  </p>
                </div>

                {/* Accent Color Picker */}
                <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
                  <span className="font-extrabold text-foreground block">
                    {isBn ? 'অ্যাক্সেন্ট কালার (Accent Color):' : 'Accent Theme Color:'}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.branding.accentColor}
                      onChange={(e) => handleAccentColorChange(e.target.value)}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-border p-1 bg-background"
                    />
                    <input
                      type="text"
                      value={formData.branding.accentColor}
                      onChange={(e) => handleAccentColorChange(e.target.value)}
                      className="h-10 w-28 font-mono font-bold text-xs uppercase rounded-xl border border-border bg-background px-3"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {isBn
                      ? 'হটলাইন নম্বর, অফার নোটিশ ও সেকেন্ডারি হাইলাইটের রঙ'
                      : 'Used for hotline badges, promotional notices, and secondary highlights.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENT TAB */}
          {activeTab === 'payment' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'পেমেন্ট গেটওয়ে কনফিগারেশন' : 'Payment Gateways & COD Controls'}
              </h3>

              <div className="flex items-center justify-between rounded-2xl border border-border p-4 bg-muted/20">
                <div>
                  <span className="font-bold text-foreground block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-muted-foreground">Allow customers to pay upon package receipt</span>
                </div>

                <input
                  type="checkbox"
                  checked={formData.payment.codEnabled}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment: { ...formData.payment, codEnabled: e.target.checked },
                    })
                  }
                  className="h-5 w-5 rounded border-border text-primary cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* SHIPPING TAB */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'ডেলিভারি চার্জ ও ফ্রী শিপিং' : 'Shipping Charges & Limits'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-foreground mb-1">Inside Dhaka Charge (৳):</label>
                  <input
                    type="number"
                    value={formData.shipping.defaultDeliveryChargeInsideDhaka}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping: {
                          ...formData.shipping,
                          defaultDeliveryChargeInsideDhaka: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-foreground mb-1">Outside Dhaka Charge (৳):</label>
                  <input
                    type="number"
                    value={formData.shipping.defaultDeliveryChargeOutsideDhaka}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping: {
                          ...formData.shipping,
                          defaultDeliveryChargeOutsideDhaka: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MAINTENANCE TAB */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'মেডিকেল প্ল্যাটফর্ম মেইনটেন্যান্স' : 'Platform Maintenance Mode'}
              </h3>

              <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
                <div>
                  <span className="font-extrabold text-rose-900 block">Maintenance Mode Switch</span>
                  <span className="text-[11px] text-rose-700">Temporarily pause customer orders for system updates</span>
                </div>

                <input
                  type="checkbox"
                  checked={formData.maintenanceMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maintenanceMode: e.target.checked,
                    })
                  }
                  className="h-5 w-5 rounded border-rose-300 text-rose-600 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
