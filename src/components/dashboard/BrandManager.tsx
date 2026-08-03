import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, ShieldCheck, ExternalLink, Globe, X, Upload } from 'lucide-react';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

interface BrandItem {
  id: string;
  name: string;
  country: string;
  dgdaReg: string;
  productCount: number;
  isVerified: boolean;
  isActive: boolean;
}

export function BrandManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [brands, setBrands] = useState<BrandItem[]>([
    {
      id: 'b-1',
      name: 'Square Pharmaceuticals Ltd.',
      country: 'Bangladesh',
      dgdaReg: 'DAR-SQ-1092',
      productCount: 420,
      isVerified: true,
      isActive: true,
    },
    {
      id: 'b-2',
      name: 'Beximco Pharmaceuticals',
      country: 'Bangladesh',
      dgdaReg: 'DAR-BX-4012',
      productCount: 310,
      isVerified: true,
      isActive: true,
    },
    {
      id: 'b-3',
      name: 'Incepta Pharmaceuticals Ltd.',
      country: 'Bangladesh',
      dgdaReg: 'DAR-INC-8821',
      productCount: 280,
      isVerified: true,
      isActive: true,
    },
    {
      id: 'b-4',
      name: 'Healthcare Pharmaceuticals Ltd.',
      country: 'Bangladesh',
      dgdaReg: 'DAR-HPL-2201',
      productCount: 190,
      isVerified: true,
      isActive: true,
    },
    {
      id: 'b-5',
      name: 'Renata Limited',
      country: 'Bangladesh',
      dgdaReg: 'DAR-REN-3301',
      productCount: 150,
      isVerified: true,
      isActive: true,
    },
    {
      id: 'b-6',
      name: 'LifeScan Inc. (OneTouch)',
      country: 'United States',
      dgdaReg: 'IMP-LS-9912',
      productCount: 45,
      isVerified: true,
      isActive: true,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    country: 'Bangladesh',
    dgdaReg: '',
    isVerified: true,
  });

  const handleToggleVerified = (id: string) => {
    setBrands((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isVerified: !b.isVerified } : b))
    );
    toast.success(isBn ? 'ব্র্যান্ড ভেরিফিকেশন আপডেট হয়েছে' : 'Brand verification status updated');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error(isBn ? 'ব্র্যান্ড নাম আবশ্যক' : 'Brand name is required');
      return;
    }

    const newBrand: BrandItem = {
      id: `b-${Date.now()}`,
      name: formData.name,
      country: formData.country || 'Bangladesh',
      dgdaReg: formData.dgdaReg || `DAR-${Date.now().toString().slice(-4)}`,
      productCount: 0,
      isVerified: formData.isVerified,
      isActive: true,
    };

    setBrands([newBrand, ...brands]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      country: 'Bangladesh',
      dgdaReg: '',
      isVerified: true,
    });
    toast.success(isBn ? 'নতুন ব্র্যান্ড সফলভাবে যোগ হয়েছে!' : 'New Pharma Brand added successfully!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'ফার্মাসিউটিক্যালস ব্র্যান্ড ও ম্যানুফ্যাকচারার' : 'Pharma Brand Directory'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'ডিজিডিএ নিবন্ধিত ওষুধ প্রস্তুতকারক ব্র্যান্ড তালিকা'
              : 'DGDA licensed pharmaceutical manufacturers & partners'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন ব্র্যান্ড যোগ' : 'Add New Brand'}</span>
        </button>
      </div>

      {/* Brands Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">{isBn ? 'ব্র্যান্ড নাম' : 'Manufacturer Name'}</th>
                <th className="py-3 px-4">{isBn ? 'দেশ' : 'Country'}</th>
                <th className="py-3 px-4">{isBn ? 'ডিজিডিএ রেজি নং' : 'DGDA License'}</th>
                <th className="py-3 px-4">{isBn ? 'প্রডাক্ট সংখ্যা' : 'Medicines Listed'}</th>
                <th className="py-3 px-4 text-right">{isBn ? 'ভেরিফিকেশন' : 'Verification'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-foreground sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span>{b.name}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-semibold text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-sky-600" />
                      <span>{b.country}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-primary">
                    {b.dgdaReg}
                  </td>

                  <td className="py-3 px-4 font-bold text-foreground">
                    {b.productCount} Items
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleVerified(b.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        b.isVerified
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <ShieldCheck className="h-3 w-3" />
                      <span>{b.isVerified ? 'Verified Partner' : 'Unverified'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Brand Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-base font-bold text-foreground">
                  {isBn ? 'নতুন ফার্মা ব্র্যান্ড যোগ করুন' : 'Add New Pharma Manufacturer'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="flex flex-col gap-4 mt-4 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Manufacturer / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: ACME Laboratories Ltd."
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Bangladesh"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    DGDA License / Registration No.
                  </label>
                  <input
                    type="text"
                    value={formData.dgdaReg}
                    onChange={(e) => setFormData({ ...formData, dgdaReg: e.target.value })}
                    placeholder="DAR-ACME-5021"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="brandVerified"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary"
                  />
                  <label htmlFor="brandVerified" className="font-bold text-foreground">
                    Verified DGDA Licensed Manufacturer
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-md"
                  >
                    Add Brand
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

