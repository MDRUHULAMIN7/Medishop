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
  Plus,
  Trash2,
  Edit2,
  Power,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import {
  settingsService,
  FullSiteSettings,
  DynamicPaymentMethod,
  DynamicDeliveryOption,
} from '@/services/settings.service';
import { useBranding } from '@/context/BrandingContext';
import { toast } from 'sonner';

export function SettingsManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';
  const { updateLocalPreview, refreshSettings } = useBranding();

  const [activeTab, setActiveTab] = useState<'general' | 'branding' | 'payment' | 'shipping' | 'seo' | 'legal' | 'maintenance'>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New Payment Method Modal State
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPayMethod, setNewPayMethod] = useState<Partial<DynamicPaymentMethod>>({
    code: '',
    nameBn: '',
    nameEn: '',
    accountNumber: '',
    instructionsBn: '',
    instructionsEn: '',
    isActive: true,
  });

  // New Delivery Option Modal State
  const [showAddDeliveryModal, setShowAddDeliveryModal] = useState(false);
  const [newDelOption, setNewDelOption] = useState<Partial<DynamicDeliveryOption>>({
    code: '',
    nameBn: '',
    nameEn: '',
    charge: 60,
    estimatedDaysBn: '২ - ৩ কার্যদিবস',
    estimatedDaysEn: '2 - 3 Working Days',
    descriptionBn: '',
    isActive: true,
  });

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
      methods: [
        {
          id: 'pay_cod',
          code: 'cod',
          nameBn: 'ক্যাশ অন ডেলিভারি (পণ্য বুঝে টাকা দিন)',
          nameEn: 'Cash on Delivery',
          descriptionBn: 'পণ্য হাতে পাওয়ার পর মূল্য পরিশোধ করুন',
          isActive: true,
          isDefault: true,
        },
        {
          id: 'pay_bkash',
          code: 'bkash',
          nameBn: 'বিকাশ (bKash Instant)',
          nameEn: 'bKash Payment',
          accountNumber: '01712345678',
          instructionsBn: 'বিকাশ মার্চেন্ট একাউন্টে মেক পেমেন্ট করুন',
          isActive: true,
        },
        {
          id: 'pay_nagad',
          code: 'nagad',
          nameBn: 'নগদ (Nagad Payment)',
          nameEn: 'Nagad Payment',
          accountNumber: '01712345678',
          isActive: true,
        },
        {
          id: 'pay_card',
          code: 'card',
          nameBn: 'কার্ড / ইন্টারনেট ব্যাংকিং',
          nameEn: 'Visa / Mastercard / Net Banking',
          isActive: true,
        },
      ],
    },
    shipping: {
      freeShippingThreshold: 1000,
      defaultDeliveryChargeInsideDhaka: 60,
      defaultDeliveryChargeOutsideDhaka: 120,
      estimatedDeliveryDays: '2 - 4 working days',
      options: [
        {
          id: 'del_dhaka',
          code: 'inside_dhaka',
          nameBn: 'ঢাকার ভিতরে ডেলিভারি',
          nameEn: 'Inside Dhaka City',
          charge: 60,
          estimatedDaysBn: '২৪ - ৪৮ ঘণ্টা',
          estimatedDaysEn: '24 - 48 Hours',
          isActive: true,
          isDefault: true,
        },
        {
          id: 'del_outside',
          code: 'outside_dhaka',
          nameBn: 'ঢাকার বাইরে কুরিয়ার ডেলিভারি',
          nameEn: 'Outside Dhaka (All BD)',
          charge: 120,
          estimatedDaysBn: '২ - ৩ কার্যদিবস',
          estimatedDaysEn: '2 - 3 Working Days',
          isActive: true,
        },
      ],
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
      invoiceTerms: 'Goods once sold are non-refundable unless damaged or incorrect.',
      warrantyPolicyContent: 'Manufacturer warranty applies where applicable.',
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
      if (updated) {
        toast.success(isBn ? 'সাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Site settings updated successfully!');
        await refreshSettings();
      }
    } catch (err: any) {
      toast.error(err.message || (isBn ? 'সেটিংস সেভ করতে সমস্যা হয়েছে' : 'Failed to save settings'));
    } finally {
      setSaving(false);
    }
  };

  // Toggle Payment Method Active Status
  const togglePaymentMethodActive = (id: string) => {
    setFormData((prev) => {
      const methods = (prev.payment.methods || []).map((m) =>
        m.id === id ? { ...m, isActive: !m.isActive } : m
      );
      return {
        ...prev,
        payment: { ...prev.payment, methods },
      };
    });
  };

  // Add Payment Method
  const handleAddPaymentMethod = () => {
    if (!newPayMethod.nameBn || !newPayMethod.code) {
      toast.error(isBn ? 'পেমেন্ট পদ্ধতির নাম ও কোড দিন' : 'Please provide name and code');
      return;
    }

    const created: DynamicPaymentMethod = {
      id: `pay_${Date.now()}`,
      code: newPayMethod.code.toLowerCase().replace(/\s+/g, '_'),
      nameBn: newPayMethod.nameBn,
      nameEn: newPayMethod.nameEn || newPayMethod.nameBn,
      accountNumber: newPayMethod.accountNumber || '',
      instructionsBn: newPayMethod.instructionsBn || '',
      instructionsEn: newPayMethod.instructionsEn || '',
      isActive: Boolean(newPayMethod.isActive),
    };

    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: [...(prev.payment.methods || []), created],
      },
    }));

    setNewPayMethod({ code: '', nameBn: '', nameEn: '', accountNumber: '', isActive: true });
    setShowAddPaymentModal(false);
    toast.success(isBn ? 'নতুন পেমেন্ট পদ্ধতি যুক্ত হয়েছে!' : 'New payment method added!');
  };

  // Delete Payment Method
  const handleDeletePaymentMethod = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        methods: (prev.payment.methods || []).filter((m) => m.id !== id),
      },
    }));
    toast.success(isBn ? 'পেমেন্ট পদ্ধতি মুছে ফেলা হয়েছে' : 'Payment method removed');
  };

  // Toggle Delivery Option Active Status
  const toggleDeliveryOptionActive = (id: string) => {
    setFormData((prev) => {
      const options = (prev.shipping.options || []).map((o) =>
        o.id === id ? { ...o, isActive: !o.isActive } : o
      );
      return {
        ...prev,
        shipping: { ...prev.shipping, options },
      };
    });
  };

  // Add Delivery Option
  const handleAddDeliveryOption = () => {
    if (!newDelOption.nameBn || !newDelOption.code) {
      toast.error(isBn ? 'ডেলিভারি অপশনের নাম ও কোড দিন' : 'Please provide name and code');
      return;
    }

    const created: DynamicDeliveryOption = {
      id: `del_${Date.now()}`,
      code: newDelOption.code.toLowerCase().replace(/\s+/g, '_'),
      nameBn: newDelOption.nameBn,
      nameEn: newDelOption.nameEn || newDelOption.nameBn,
      charge: Number(newDelOption.charge || 60),
      estimatedDaysBn: newDelOption.estimatedDaysBn || '২-৩ দিন',
      estimatedDaysEn: newDelOption.estimatedDaysEn || '2-3 Days',
      descriptionBn: newDelOption.descriptionBn || '',
      isActive: Boolean(newDelOption.isActive),
    };

    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        options: [...(prev.shipping.options || []), created],
      },
    }));

    setNewDelOption({ code: '', nameBn: '', nameEn: '', charge: 60, isActive: true });
    setShowAddDeliveryModal(false);
    toast.success(isBn ? 'নতুন ডেলিভারি অপশন যুক্ত হয়েছে!' : 'New delivery option added!');
  };

  // Delete Delivery Option
  const handleDeleteDeliveryOption = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        options: (prev.shipping.options || []).filter((o) => o.id !== id),
      },
    }));
    toast.success(isBn ? 'ডেলিভারি অপশন মুছে ফেলা হয়েছে' : 'Delivery option removed');
  };

  const navItems = [
    { id: 'general', label: isBn ? 'সাধারণ পরিচয়' : 'General Identity', icon: Globe },
    { id: 'branding', label: isBn ? 'ব্র্যান্ডিং ও থিম' : 'Theme & Branding', icon: Palette },
    { id: 'payment', label: isBn ? 'পেমেন্ট মেথডসমূহ' : 'Payment Methods', icon: CreditCard },
    { id: 'shipping', label: isBn ? 'ডেলিভারি অপশনসমূহ' : 'Delivery Options', icon: Truck },
    { id: 'seo', label: isBn ? 'এসইও (SEO)' : 'SEO & Meta', icon: Search },
    { id: 'legal', label: isBn ? 'শর্তাবলী ও পলিসি' : 'Terms & Policies', icon: FileText },
    { id: 'maintenance', label: isBn ? 'মেইনটেন্যান্স মোড' : 'Maintenance Mode', icon: ShieldAlert },
  ];

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-foreground font-serif-title">
            {isBn ? 'সাইট সেটিংস ও কন্ট্রোল প্যানেল' : 'Site Settings & Control Center'}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">
            {isBn
              ? 'ওয়েবসাইটের পরিচয়, থিম কালার, পেমেন্ট মেথড ও ডেলিভারি অপশন কনফিগার করুন'
              : 'Configure website branding, active payment gateways, and delivery options'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isBn ? 'পরিবর্তন সেভ করুন' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Main Grid: Left Tabs, Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Navigation Tabs */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-background p-2 space-y-1 shadow-2xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
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
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
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
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
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
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
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
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground focus:border-primary focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC PAYMENT METHODS TAB */}
          {activeTab === 'payment' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    {isBn ? 'ডাইনামিক পেমেন্ট মেথডসমূহ' : 'Dynamic Payment Methods Management'}
                  </h3>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {isBn
                      ? 'অ্যাডমিন নতুন পেমেন্ট মেথড যুক্ত ও একটিভ/ইনএকটিভ করতে পারবেন'
                      : 'Add, enable/disable, or customize active checkout payment options'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isBn ? 'নতুন পেমেন্ট মেথড' : 'Add Payment Method'}</span>
                </button>
              </div>

              {/* Payment Methods List */}
              <div className="space-y-3">
                {(formData.payment?.methods || []).map((method) => (
                  <div
                    key={method.id}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                      method.isActive
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-border bg-muted/20 opacity-70'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm">
                          {isBn ? method.nameBn : method.nameEn}
                        </span>
                        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground uppercase">
                          Code: {method.code}
                        </span>
                        {method.isActive ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-300">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-600 border border-gray-300">
                            Inactive
                          </span>
                        )}
                      </div>

                      {method.accountNumber && (
                        <p className="text-sky-600 font-bold text-[11px]">
                          Account/Number: {method.accountNumber}
                        </p>
                      )}
                      {method.instructionsBn && (
                        <p className="text-muted-foreground text-[11px]">
                          Instructions: {method.instructionsBn}
                        </p>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => togglePaymentMethodActive(method.id)}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          method.isActive
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span>{method.isActive ? (isBn ? 'একটিভ' : 'Active') : (isBn ? 'ইনএকটিভ' : 'Inactive')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Method"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Payment Method Modal */}
              {showAddPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-3xl bg-background p-6 space-y-4 shadow-xl border border-border">
                    <h4 className="text-base font-extrabold text-foreground border-b border-border pb-2">
                      {isBn ? 'নতুন পেমেন্ট মেথড যুক্ত করুন' : 'Add New Payment Method'}
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-foreground mb-1">Method Code (Unique identifier):</label>
                        <input
                          type="text"
                          placeholder="e.g. bkash, nagad, rocket, cod"
                          value={newPayMethod.code || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, code: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Name (Bangla):</label>
                        <input
                          type="text"
                          placeholder="e.g. বিকাশ (bKash Instant)"
                          value={newPayMethod.nameBn || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, nameBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Name (English):</label>
                        <input
                          type="text"
                          placeholder="e.g. bKash Payment"
                          value={newPayMethod.nameEn || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, nameEn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Account / Merchant Number (Optional):</label>
                        <input
                          type="text"
                          placeholder="e.g. 01712345678"
                          value={newPayMethod.accountNumber || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, accountNumber: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Instructions (Bangla):</label>
                        <input
                          type="text"
                          placeholder="e.g. বিকাশ মার্চেন্ট নম্বরে মেক পেমেন্ট করুন"
                          value={newPayMethod.instructionsBn || ''}
                          onChange={(e) => setNewPayMethod({ ...newPayMethod, instructionsBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setShowAddPaymentModal(false)}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddPaymentMethod}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark"
                      >
                        Save Method
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC DELIVERY OPTIONS TAB */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    {isBn ? 'ডাইনামিক ডেলিভারি অপশনসমূহ' : 'Dynamic Delivery Options Management'}
                  </h3>
                  <p className="text-muted-foreground text-[11px] mt-0.5">
                    {isBn
                      ? 'অ্যাডমিন নতুন ডেলিভারি অপশন, ফি (৳) ও সময়সীমা সেট ও একটিভ করতে পারবেন'
                      : 'Customize delivery options, rates, and active shipping zones'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddDeliveryModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{isBn ? 'নতুন ডেলিভারি অপশন' : 'Add Delivery Option'}</span>
                </button>
              </div>

              {/* Delivery Options List */}
              <div className="space-y-3">
                {(formData.shipping?.options || []).map((option) => (
                  <div
                    key={option.id}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                      option.isActive
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-border bg-muted/20 opacity-70'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-foreground text-sm">
                          {isBn ? option.nameBn : option.nameEn}
                        </span>
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary text-[11px]">
                          Charge: ৳{option.charge}
                        </span>
                        {option.isActive ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-300">
                            Active
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-600 border border-gray-300">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="text-muted-foreground text-[11px]">
                        Estimated Delivery: <strong className="text-foreground">{option.estimatedDaysBn || option.estimatedDaysEn}</strong>
                      </p>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleDeliveryOptionActive(option.id)}
                        className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          option.isActive
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <Power className="h-3.5 w-3.5" />
                        <span>{option.isActive ? (isBn ? 'একটিভ' : 'Active') : (isBn ? 'ইনএকটিভ' : 'Inactive')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteDeliveryOption(option.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete Option"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Delivery Option Modal */}
              {showAddDeliveryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-3xl bg-background p-6 space-y-4 shadow-xl border border-border">
                    <h4 className="text-base font-extrabold text-foreground border-b border-border pb-2">
                      {isBn ? 'নতুন ডেলিভারি অপশন যুক্ত করুন' : 'Add New Delivery Option'}
                    </h4>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-foreground mb-1">Option Code (Unique identifier):</label>
                        <input
                          type="text"
                          placeholder="e.g. inside_dhaka, express, pickup"
                          value={newDelOption.code || ''}
                          onChange={(e) => setNewDelOption({ ...newDelOption, code: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Option Name (Bangla):</label>
                        <input
                          type="text"
                          placeholder="e.g. ঢাকার ভিতরে ডেলিভারি"
                          value={newDelOption.nameBn || ''}
                          onChange={(e) => setNewDelOption({ ...newDelOption, nameBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Option Name (English):</label>
                        <input
                          type="text"
                          placeholder="e.g. Inside Dhaka Delivery"
                          value={newDelOption.nameEn || ''}
                          onChange={(e) => setNewDelOption({ ...newDelOption, nameEn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Delivery Charge (৳):</label>
                        <input
                          type="number"
                          value={newDelOption.charge || 60}
                          onChange={(e) => setNewDelOption({ ...newDelOption, charge: Number(e.target.value) })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-foreground mb-1">Estimated Days (Bangla):</label>
                        <input
                          type="text"
                          placeholder="e.g. ২-৩ কার্যদিবস"
                          value={newDelOption.estimatedDaysBn || ''}
                          onChange={(e) => setNewDelOption({ ...newDelOption, estimatedDaysBn: e.target.value })}
                          className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-border">
                      <button
                        type="button"
                        onClick={() => setShowAddDeliveryModal(false)}
                        className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-muted-foreground hover:bg-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddDeliveryOption}
                        className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark"
                      >
                        Save Option
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'এসইও ও মেটা ফিল্ডস' : 'SEO & Meta Configuration'}
              </h3>

              <div>
                <label className="block font-bold text-foreground mb-1">Default Meta Title:</label>
                <input
                  type="text"
                  value={formData.seo.defaultMetaTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, defaultMetaTitle: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Default Meta Description:</label>
                <textarea
                  rows={2}
                  value={formData.seo.defaultMetaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, defaultMetaDescription: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                />
              </div>
            </div>
          )}

          {/* LEGAL TAB */}
          {activeTab === 'legal' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
                {isBn ? 'শর্তাবলী ও লিগ্যাল পলিসি' : 'Legal Terms & Policy Content'}
              </h3>

              <div>
                <label className="block font-bold text-foreground mb-1">Invoice Sale Terms:</label>
                <input
                  type="text"
                  value={formData.legal.invoiceTerms || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      legal: { ...formData.legal, invoiceTerms: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Return & Refund Policy Summary:</label>
                <input
                  type="text"
                  value={formData.legal.refundPolicyContent || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      legal: { ...formData.legal, refundPolicyContent: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-1">Warranty Policy Summary:</label>
                <input
                  type="text"
                  value={formData.legal.warrantyPolicyContent || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      legal: { ...formData.legal, warrantyPolicyContent: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-xs"
                />
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
