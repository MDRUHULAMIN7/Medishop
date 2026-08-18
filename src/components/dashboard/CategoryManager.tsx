'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderTree,
  Plus,
  Star,
  X,
  Loader2,
  Trash2,
  Edit2,
  Upload,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/services/category.service';
import { formatNumber } from '@/utils/cart';
import { toast } from 'sonner';

export function CategoryManager() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Server-side URL String Pagination Parameters
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '20', 10);

  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const itemsPerPage = isNaN(limitParam) || limitParam < 1 ? 10 : limitParam;

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
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    isFeatured: true,
    isActive: true,
  });

  // Calculate pagination bounds
  const totalItems = categories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedCategories = categories.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'categories');
    params.set('page', newPage.toString());
    params.set('limit', itemsPerPage.toString());
    router.push(`/dashboard/admin?${params.toString()}`);
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'categories');
    params.set('page', '1');
    params.set('limit', newLimit.toString());
    router.push(`/dashboard/admin?${params.toString()}`);
  };

  const handleTogglePopular = async (cat: Category) => {
    await toggleFeatured(cat.id);
  };

  const handleToggleActive = async (cat: Category) => {
    await updateCategory({
      id: cat.id,
      payload: { isActive: !cat.isActive },
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategoryId) return;
    try {
      setIsDeleting(true);
      await deleteCategory(deletingCategoryId);
      setDeletingCategoryId(null);
    } catch {
      // Error handled by mutation toast
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(isBn ? 'ছবি সর্বোচ্চ ৫ মেগাবাইট (5MB) হতে পারবে' : 'Image file size must be less than 5MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
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
              ? 'লাইভ ব্যাকএন্ড ক্যাটাগরি ডাটা টেবিল, ফাইল আপলোড ও পেজিনেশন'
              : 'Live backend API data table with server query pagination'}
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
        <>
          {/* Categories Data Table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="py-3 px-4">{isBn ? 'ক্যাটাগরি নাম' : 'Category Name'}</th>
                    <th className="py-3 px-4">{isBn ? 'ইউআরএল স্ল্যাগ' : 'URL Slug'}</th>
                    <th className="py-3 px-4 text-center">{isBn ? 'ফিচারড' : 'Featured'}</th>
                    <th className="py-3 px-4 text-center">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
                    <th className="py-3 px-4 text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-foreground sm:text-sm">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold overflow-hidden border border-primary/20">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                            ) : (
                              <FolderTree className="h-4 w-4" />
                            )}
                          </div>
                          <span className="truncate">{cat.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-muted-foreground">
                        /{cat.slug}
                      </td>

                      <td className="py-3 px-4 text-center">
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
                      </td>

                      <td className="py-3 px-4 text-center">
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
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCategoryId(cat.id)}
                            className="p-1.5 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Server-side Query Parameter Pagination Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 shadow-2xs text-xs">
            <div className="flex items-center gap-4 text-muted-foreground font-semibold">
              <span>
                {isBn
                  ? `মোট ${formatNumber(totalItems, 'bn')} টির মধ্যে ${totalItems > 0 ? formatNumber(startIndex + 1, 'bn') : 0}-${formatNumber(endIndex, 'bn')} দেখাচ্ছে`
                  : `Showing ${totalItems > 0 ? formatNumber(startIndex + 1, 'en') : 0} to ${formatNumber(endIndex, 'en')} of ${formatNumber(totalItems, 'en')} entries`}
              </span>

              <div className="flex items-center gap-1.5">
                <span>{isBn ? 'প্রতি পেজে:' : 'Per page:'}</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="rounded-2xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer transition-all"
                >
                  <option value={5}>{formatNumber(5, isBn ? 'bn' : 'en')}</option>
                  <option value={10}>{formatNumber(10, isBn ? 'bn' : 'en')}</option>
                  <option value={20}>{formatNumber(20, isBn ? 'bn' : 'en')}</option>
                  <option value={50}>{formatNumber(50, isBn ? 'bn' : 'en')}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{isBn ? 'পূর্ববর্তী' : 'Prev'}</span>
              </button>

              <div className="flex items-center gap-1 font-bold">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    className={`h-8 w-8 rounded-xl font-extrabold transition-all cursor-pointer ${
                      p === currentPage
                        ? 'bg-primary text-white shadow-xs font-black'
                        : 'border border-border hover:bg-muted text-foreground'
                    }`}
                  >
                    {formatNumber(p, isBn ? 'bn' : 'en')}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 font-bold text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span>{isBn ? 'পরবর্তী' : 'Next'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
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
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
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
                  className="rounded-xl p-1 text-muted-foreground hover:bg-muted cursor-pointer"
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

                {/* 5MB File Upload Field */}
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Category Image (Max 5MB)
                  </label>
                  <div className="flex flex-col gap-2">
                    {formData.image ? (
                      <div className="relative flex items-center justify-between gap-3 p-2 rounded-xl border border-border bg-muted/40">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="h-12 w-12 rounded-lg object-cover border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          {isBn ? 'রিমুভ করুন' : 'Remove'}
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-28 w-full border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all p-3 text-center">
                        <Upload className="h-6 w-6 text-primary mb-1" />
                        <span className="font-bold text-foreground text-xs">
                          {isBn ? 'ছবি ফাইল সিলেক্ট করুন (Max 5MB)' : 'Upload Image File (Max 5MB)'}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          PNG, JPG, WEBP formats up to 5MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
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

      {/* Modern Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingCategoryId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeletingCategoryId(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl border border-border bg-background p-6 shadow-2xl text-center space-y-4"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <AlertTriangle className="h-7 w-7" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-foreground">
                  {isBn ? 'ক্যাটাগরি ডিলিট নিশ্চিতকরণ' : 'Delete Category Confirmation'}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {isBn
                    ? 'আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি মুছে ফেলতে চান? এই অ্যাকশনটি বাতিল করা যাবে না।'
                    : 'Are you sure you want to delete this category? This action cannot be undone.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingCategoryId(null)}
                  className="w-full rounded-xl border border-border py-2.5 text-xs font-bold text-foreground hover:bg-muted cursor-pointer transition-all"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700 disabled:opacity-70 cursor-pointer transition-all"
                >
                  {isDeleting && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  <span>{isBn ? 'মুছে ফেলুন' : 'Delete'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
