'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Plus,
  Search,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Calendar,
  DollarSign,
  Percent,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { CouponService } from '@/services/coupon.service';
import { useAppSelector } from '@/store';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';
import { CustomSelect } from '@/components/ui/CustomSelect';

export function CouponManager() {
  const queryClient = useQueryClient();
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 100,
    perUserLimit: 1,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isPublic: true,
    isActive: true,
  });

  // Fetch Coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => CouponService.getAllCoupons(true),
  });

  // Create Coupon Mutation
  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => CouponService.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success(isBn ? 'কুপন সফলভাবে যোগ করা হয়েছে' : 'Coupon created successfully');
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.message || (isBn ? 'কুপন তৈরি করা যায়নি' : 'Failed to create coupon'));
    },
  });

  // Delete Coupon Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => CouponService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success(isBn ? 'কুপন সফলভাবে মুছে ফেলা হয়েছে' : 'Coupon deleted successfully');
      setDeletingCouponId(null);
    },
    onError: (err: any) => {
      toast.error(err?.message || (isBn ? 'কুপন মোছা যায়নি' : 'Failed to delete coupon'));
    },
  });

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 100,
      perUserLimit: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isPublic: true,
      isActive: true,
    });
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(isBn ? `কুপন কোড "${code}" কপি করা হয়েছে` : `Copied coupon code "${code}"`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      toast.error(isBn ? 'দয়া করে কুপন কোড লিখুন' : 'Please enter coupon code');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (start < today) {
      toast.error(isBn ? 'শুরুর তারিখ আজকের বা ভবিষ্যতের তারিখ হতে হবে' : 'Start date cannot be in the past');
      return;
    }

    if (start >= end) {
      toast.error(isBn ? 'মেয়াদ শেষের তারিখ শুরুর তারিখের পরে হতে হবে' : 'End date must be after start date');
      return;
    }

    createMutation.mutate(formData);
  };

  const filteredCoupons = coupons.filter((c: any) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              {isBn ? 'ডিসকাউন্ট কুপন ও প্রোমো কোড ম্যানেজার' : 'Coupon & Promo Code Manager'}
            </h2>
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1">
            {isBn
              ? `মোট ${coupons.length} টি নিবন্ধিত প্রোমো কুপন সিস্টেম ডাটাবেজে রয়েছে`
              : `Total ${coupons.length} registered promo coupons in system database`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন কুপন যোগ করুন' : 'Add New Coupon'}</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'কুপন কোড লিখে খুঁজুন...' : 'Search coupon code...'}
            className="h-10 w-full rounded-2xl border border-border bg-background pl-9 pr-3 text-xs font-medium text-foreground focus:border-primary focus:ring-0 focus:outline-none transition-colors"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-3xl border border-border bg-background shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Ticket className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-bold text-foreground">
              {isBn ? 'কোনো কুপন পাওয়া যায়নি' : 'No coupons found'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isBn
                ? 'নতুন কুপন যোগ করতে উপরের বাটনে ক্লিক করুন'
                : 'Click the button above to add your first promo coupon.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">{isBn ? 'কুপন কোড' : 'Coupon Code'}</th>
                  <th className="px-4 py-3">{isBn ? 'ছাড়ের পরিমাণ' : 'Discount'}</th>
                  <th className="px-4 py-3">{isBn ? 'সর্বনিম্ন অর্ডার' : 'Min Order'}</th>
                  <th className="px-4 py-3">{isBn ? 'সর্বোচ্চ ছাড়' : 'Max Discount'}</th>
                  <th className="px-4 py-3">{isBn ? 'ব্যবহারের তথ্য' : 'Usage'}</th>
                  <th className="px-4 py-3">{isBn ? 'মেয়াদ' : 'Validity'}</th>
                  <th className="px-4 py-3">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                  <th className="px-4 py-3 text-right">{isBn ? 'একশন' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filteredCoupons.map((coupon: any) => {
                  const isExpired = new Date() > new Date(coupon.endDate);
                  const isExhausted =
                    coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

                  return (
                    <tr key={coupon._id || coupon.id} className="hover:bg-muted/30 transition-colors">
                      {/* Code */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-primary tracking-wider bg-primary/10 px-2.5 py-1 rounded-xl">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                            title={isBn ? 'কপি করুন' : 'Copy Code'}
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Discount Value */}
                      <td className="px-4 py-3 font-bold text-foreground">
                        {coupon.discountType === 'percentage' ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                            <Percent className="h-3.5 w-3.5" />
                            {coupon.discountValue}% OFF
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                            <DollarSign className="h-3.5 w-3.5" />
                            ৳{coupon.discountValue} OFF
                          </span>
                        )}
                      </td>

                      {/* Min Order Amount */}
                      <td className="px-4 py-3 text-muted-foreground font-semibold">
                        {coupon.minOrderAmount > 0 ? formatBDT(coupon.minOrderAmount) : '৳0'}
                      </td>

                      {/* Max Discount */}
                      <td className="px-4 py-3 text-muted-foreground font-semibold">
                        {coupon.maxDiscountAmount > 0
                          ? formatBDT(coupon.maxDiscountAmount)
                          : 'অসীমিত (No Cap)'}
                      </td>

                      {/* Usage */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-foreground">
                          {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                        </span>
                      </td>

                      {/* Validity Period */}
                      <td className="px-4 py-3 text-muted-foreground text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {new Date(coupon.startDate).toLocaleDateString()} —{' '}
                            {new Date(coupon.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                            <AlertTriangle className="h-3 w-3" />
                            {isBn ? 'মেয়াদ শেষ' : 'Expired'}
                          </span>
                        ) : isExhausted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                            <AlertTriangle className="h-3 w-3" />
                            {isBn ? 'লিমিট শেষ' : 'Exhausted'}
                          </span>
                        ) : coupon.isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            {isBn ? 'সক্রিয়' : 'Active'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-600 border border-gray-200">
                            <XCircle className="h-3 w-3" />
                            {isBn ? 'বন্ধ' : 'Disabled'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setDeletingCouponId(coupon._id || coupon.id)}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
                          title={isBn ? 'মুছে ফেলুন' : 'Delete Coupon'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-background shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Ticket className="h-5 w-5 text-primary" />
                  <h3 className="text-base font-extrabold text-foreground">
                    {isBn ? 'নতুন ডিসকাউন্ট কুপন তৈরি করুন' : 'Create New Discount Coupon'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold">
                {/* Code */}
                <div>
                  <label className="block text-foreground mb-1">
                    {isBn ? 'কুপন কোড (অক্ষর/সংখ্যা)' : 'Coupon Code (UPPERCASE)'}
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. HEALTH2026, MEDI100"
                    required
                    className="h-10 w-full rounded-2xl border border-border bg-background px-3 font-mono font-bold text-foreground focus:border-primary focus:ring-0 focus:outline-none"
                  />
                </div>

                {/* Discount Type & Value */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1">
                      {isBn ? 'ছাড়ের ধরন' : 'Discount Type'}
                    </label>
                    <CustomSelect
                      value={formData.discountType}
                      onChange={(val) => setFormData({ ...formData, discountType: val as any })}
                      options={[
                        { value: 'percentage', label: isBn ? 'পার্সেন্টেজ (%)' : 'Percentage (%)' },
                        { value: 'fixed', label: isBn ? 'ফিক্সড টাকা (৳)' : 'Fixed Amount (৳)' },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-foreground mb-1">
                      {isBn ? 'ছাড়ের মান' : 'Discount Value'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                      required
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 font-bold text-foreground focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Min Order & Max Discount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1">
                      {isBn ? 'সর্বনিম্ন অর্ডার (৳)' : 'Min Order Amount (৳)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 font-bold text-foreground focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground mb-1">
                      {isBn ? 'সর্বোচ্চ ছাড়ের সীমা (৳)' : 'Max Discount Cap (৳)'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                      placeholder="0 = No limit"
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 font-bold text-foreground focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Usage Limits */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1">
                      {isBn ? 'মোট ব্যবহারের সীমা' : 'Total Usage Limit'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 font-bold text-foreground focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground mb-1">
                      {isBn ? 'ইউজার প্রতি সীমা' : 'Per User Limit'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.perUserLimit}
                      onChange={(e) => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 font-bold text-foreground focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-foreground mb-1">
                      {isBn ? 'শুরুর তারিখ' : 'Start Date'}
                    </label>
                    <input
                      type="date"
                      min={todayStr}
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 font-medium text-foreground focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground mb-1">
                      {isBn ? 'মেয়াদ শেষের তারিখ' : 'End Date'}
                    </label>
                    <input
                      type="date"
                      min={formData.startDate || todayStr}
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                      className="h-10 w-full rounded-2xl border border-border bg-background px-3 font-medium text-foreground focus:border-primary focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="rounded-md text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>{isBn ? 'পাবলিক প্রোমো ব্যাজ দেখান' : 'Show as Public Promo Chip'}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded-md text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>{isBn ? 'কুপন সক্রিয় (Active)' : 'Active Status'}</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-2xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    {isBn ? 'বাতিল' : 'Cancel'}
                  </button>

                  <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-primary-dark disabled:opacity-50"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    <span>{isBn ? 'কুপন তৈরি করুন' : 'Save Coupon'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deletingCouponId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingCouponId(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-background shadow-2xl p-6 text-center space-y-4"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Trash2 className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {isBn ? 'কুপনটি স্থায়ীভাবে মুছে ফেলবেন?' : 'Delete Coupon Permanently?'}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'এই একশনটি পররবর্তীতে আর বাতিল করা যাবে না।'
                    : 'This action cannot be undone. Users will no longer be able to apply this promo code.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingCouponId(null)}
                  className="rounded-2xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(deletingCouponId)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{isBn ? 'হ্যাঁ, মুছুন' : 'Delete'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
