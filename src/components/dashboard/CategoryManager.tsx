'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderTree,
  Plus,
  Star,
  CheckCircle,
  Pill,
  X,
  Loader2,
  Trash2,
  Edit2,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/services/category.service';

export function CategoryManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    toggleFeatured,
    deleteCategory,
    isCreating,
  } = useCategories(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    isFeatured: true,
    isActive: true,
  });

  const handleTogglePopular = async (cat: Category) => {
    await toggleFeatured(cat.id);
  };

  const handleToggleActive = async (cat: Category) => {
    await updateCategory({
      id: cat.id,
      payload: { isActive: !cat.isActive },
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(isBn ? 'আপনি কি নিশ্চিত এই ক্যাটাগরিটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this category?')) {
      await deleteCategory(id);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      await updateCategory({
        id: editingCategory.id,
        payload: {
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
          image: formData.image.trim() || undefined,
          isFeatured: formData.isFeatured,
          isActive: formData.isActive,
        },
      });
    } else {
      await createCategory({
        name: formData.name.trim(),
        slug: formData.slug.trim() || undefined,
        image: formData.image.trim() || undefined,
        isFeatured: formData.isFeatured,
        isActive: formData.isActive,
      });
    }

    setIsAddModalOpen(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      image: '',
      isFeatured: true,
      isActive: true,
    });
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      image: cat.image || '',
      isFeatured: Boolean(cat.isFeatured),
      isActive: Boolean(cat.isActive),
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground font-serif-title">
            {isBn ? 'ফার্মেসি ক্যাটাগরি কনফিগারেটর' : 'Category Management'}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isBn
              ? 'লাইভ ব্যাকএন্ড ক্যাটাগরি, ইমেজ ও হোমপেজ পপুলার ফিল্টার'
              : 'Live backend API integration for pharmacy categories and featured highlights'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', image: '', isFeatured: true, isActive: true });
            setIsAddModalOpen(true);
          }}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন ক্যাটাগরি যোগ' : 'Add New Category'}</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-xs font-bold text-muted-foreground">
          {isBn ? 'কোনো ক্যাটাগরি পাওয়া যায়নি' : 'No categories available'}
        </div>
      ) : (
        /* Categories Grid */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between rounded-2xl border border-border bg-background p-5 shadow-2xs transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold overflow-hidden">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                    ) : (
                      <FolderTree className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-foreground truncate">{cat.name}</h3>
                    <span className="text-[11px] text-muted-foreground truncate block">
                      /{cat.slug}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleTogglePopular(cat)}
                    className={`rounded-full p-1.5 transition-colors cursor-pointer ${
                      cat.isFeatured
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    title="Toggle Featured Category"
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                <span className="text-[11px] font-medium text-muted-foreground">
                  ID: {cat.id.slice(-6)}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleActive(cat)}
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer ${
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
      )}

      {/* Add / Edit Category Modal */}
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
                  {editingCategory
                    ? isBn
                      ? 'ক্যাটাগরি এডিট করুন'
                      : 'Edit Category'
                    : isBn
                    ? 'নতুন ক্যাটাগরি যোগ করুন'
                    : 'Add New Category'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 mt-4 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Antibiotics & Anti-infectives"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    URL Slug (Auto-generated if empty)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="antibiotics-anti-infectives"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    id="catPopular"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="h-4 w-4 rounded border-border text-primary"
                  />
                  <label htmlFor="catPopular" className="font-bold text-foreground cursor-pointer">
                    Highlight as Featured Category on Homepage
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-dark shadow-md disabled:opacity-70 cursor-pointer"
                  >
                    {isCreating && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                    <span>{editingCategory ? 'Save Changes' : 'Add Category'}</span>
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
