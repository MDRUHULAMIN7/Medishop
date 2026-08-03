import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderTree,
  Plus,
  Star,
  CheckCircle,
  Pill,
  Stethoscope,
  Activity,
  Heart,
  Baby,
  ShieldPlus,
  Sparkles,
  Apple,
  X,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

interface CategoryItem {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  iconName: string;
  productCount: number;
  isPopular: boolean;
  isActive: boolean;
}

export function CategoryManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: 'c-1',
      slug: 'prescription-medicines',
      nameEn: 'Prescription Medicines',
      nameBn: 'প্রেসক্রিপশন ওষুধ',
      iconName: 'Pill',
      productCount: 1420,
      isPopular: true,
      isActive: true,
    },
    {
      id: 'c-2',
      slug: 'otc-medicines',
      nameEn: 'OTC Medicines',
      nameBn: 'ওটিসি (সাধারণ) ওষুধ',
      iconName: 'Stethoscope',
      productCount: 890,
      isPopular: true,
      isActive: true,
    },
    {
      id: 'c-3',
      slug: 'diabetic-care',
      nameEn: 'Diabetic Care',
      nameBn: 'ডায়াবেটিস কেয়ার',
      iconName: 'Activity',
      productCount: 320,
      isPopular: true,
      isActive: true,
    },
    {
      id: 'c-4',
      slug: 'women-care',
      nameEn: "Women's Choice",
      nameBn: 'উইমেনস কেয়ার',
      iconName: 'Heart',
      productCount: 210,
      isPopular: true,
      isActive: true,
    },
    {
      id: 'c-5',
      slug: 'baby-care',
      nameEn: 'Baby Care',
      nameBn: 'বেবি কেয়ার',
      iconName: 'Baby',
      productCount: 450,
      isPopular: true,
      isActive: true,
    },
    {
      id: 'c-6',
      slug: 'healthcare-devices',
      nameEn: 'Healthcare Devices',
      nameBn: 'হেলথকেয়ার ডিভাইস',
      iconName: 'ShieldPlus',
      productCount: 180,
      isPopular: false,
      isActive: true,
    },
  ]);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameBn: '',
    slug: '',
    iconName: 'Pill',
    isPopular: true,
  });

  const handleTogglePopular = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPopular: !c.isPopular } : c))
    );
    toast.success(isBn ? 'পপুলার স্ট্যাটাস আপডেট হয়েছে' : 'Popular status updated');
  };

  const handleToggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    toast.success(isBn ? 'ক্যাটাগরি স্ট্যাটাস আপডেট হয়েছে' : 'Category active status updated');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameEn) {
      toast.error(isBn ? 'ক্যাটাগরি নাম আবশ্যক' : 'Category name is required');
      return;
    }

    const slug =
      formData.slug ||
      formData.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newCat: CategoryItem = {
      id: `c-${Date.now()}`,
      nameEn: formData.nameEn,
      nameBn: formData.nameBn || formData.nameEn,
      slug,
      iconName: formData.iconName,
      productCount: 0,
      isPopular: formData.isPopular,
      isActive: true,
    };

    setCategories([newCat, ...categories]);
    setIsAddModalOpen(false);
    setFormData({
      nameEn: '',
      nameBn: '',
      slug: '',
      iconName: 'Pill',
      isPopular: true,
    });
    toast.success(isBn ? 'নতুন ক্যাটাগরি যোগ হয়েছে!' : 'New Category added successfully!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'ফার্মেসি ক্যাটাগরি কনফিগারেটর' : 'Category Management'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'হোমপেজ পপুলার ক্যাটাগরি ও আইকন কাস্টমাইজ করুন'
              : 'Customize homepage category highlights, icons, and visibility'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন ক্যাটাগরি যোগ' : 'Add New Category'}</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                  <FolderTree className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {isBn ? cat.nameBn : cat.nameEn}
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    {cat.productCount} Items Available
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleTogglePopular(cat.id)}
                className={`rounded-full p-1.5 transition-colors ${
                  cat.isPopular
                    ? 'text-amber-500 bg-amber-50'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
                title="Toggle Popular Category"
              >
                <Star className="h-4 w-4 fill-current" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-[11px] font-medium text-muted-foreground">
                Slug: /{cat.slug}
              </span>

              <button
                onClick={() => handleToggleActive(cat.id)}
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  cat.isActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {cat.isActive ? 'Active' : 'Disabled'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Category Modal */}
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
              exit={{ opacity: 0, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-base font-bold text-foreground">
                  {isBn ? 'নতুন ক্যাটাগরি যুক্ত করুন' : 'Add New Category'}
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
                    Category Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="Ex: Herbal & Natural"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Category Name (Bengali)
                  </label>
                  <input
                    type="text"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="Ex: হার্বাল ও ন্যাচারাল"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="herbal-natural"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="catPopular"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary"
                  />
                  <label htmlFor="catPopular" className="font-bold text-foreground">
                    Highlight as Popular Category on Homepage
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
                    Add Category
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

