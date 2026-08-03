import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Plus, ArrowUp, ArrowDown, Eye, CheckCircle2, X, Upload } from 'lucide-react';
import { useAppSelector } from '@/store';
import { toast } from 'sonner';

interface BannerSlide {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badgeBn?: string;
  badgeEn?: string;
  ctaTextBn: string;
  ctaTextEn: string;
  ctaLink: string;
  bgGradient: string;
  isActive: boolean;
  priority: number;
  image?: string;
}

export function BannerManager() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [banners, setBanners] = useState<BannerSlide[]>([
    {
      id: 'hs-1',
      titleBn: '২৪/৭ ভিডিও কলে অভিজ্ঞ ডাক্তারের পরামর্শ',
      titleEn: '24/7 Expert Doctor Video Consultation',
      subtitleBn: 'যেকোনো স্বাস্থ্য সমস্যায় তাৎক্ষণিক বিশেষজ্ঞ ডাক্তারের সেবা নিন।',
      subtitleEn: 'Get instant healthcare advice from verified specialists anytime.',
      badgeBn: 'তাৎক্ষণিক ভিডিও কনসাল্টেশন',
      badgeEn: 'Instant Video Call',
      ctaTextBn: 'ডাক্তার দেখান',
      ctaTextEn: 'Consult Now',
      ctaLink: '/consultation',
      bgGradient: 'from-slate-950/85 via-slate-900/60 to-primary-dark/80',
      isActive: true,
      priority: 1,
    },
    {
      id: 'hs-2',
      titleBn: 'জরুরি প্রয়োজনে দ্রুততম হোম ডেলিভারি',
      titleEn: 'Express Same-Day Dhaka Delivery',
      subtitleBn: 'ঢাকায় ৪-৬ ঘণ্টার মধ্যে এবং সারাদেশে ১-৩ দিনে ১০০% আসল ওষুধ পৌঁছে যাবে।',
      subtitleEn: 'Express 4-6 hours delivery in Dhaka and 1-3 days nationwide.',
      badgeBn: 'সেম-ডে ডেলিভারি গ্যারান্টি',
      badgeEn: 'Express Delivery Guaranteed',
      ctaTextBn: 'ওষুধ অর্ডার করুন',
      ctaTextEn: 'Order Medicine',
      ctaLink: '/products',
      bgGradient: 'from-blue-950/90 via-slate-900/65 to-sky-900/75',
      isActive: true,
      priority: 2,
    },
    {
      id: 'hs-3',
      titleBn: 'বাংলাদেশে সর্ববৃহৎ মেডিসিন সম্ভার',
      titleEn: 'Largest Authentic Medicine Inventory',
      subtitleBn: 'ডিজিডিএ অনুমোদিত ১০০% আসল ওষুধ এবং আধুনিক ডায়াবেটিস কেয়ার ডিভাইস।',
      subtitleEn: 'DGDA licensed 100% authentic medicine and diabetic monitoring kits.',
      badgeBn: 'ডিজিডিএ অনুমোদিত অনলাইন ফার্মেসি',
      badgeEn: 'DGDA Approved Pharmacy',
      ctaTextBn: 'প্রেসক্রিপশন আপলোড',
      ctaTextEn: 'Upload Prescription',
      ctaLink: '/upload-prescription',
      bgGradient: 'from-slate-950/90 via-indigo-950/70 to-blue-950/80',
      isActive: true,
      priority: 3,
    },
  ]);

  const [formData, setFormData] = useState({
    titleEn: '',
    titleBn: '',
    subtitleEn: '',
    subtitleBn: '',
    badgeEn: '',
    badgeBn: '',
    ctaTextEn: 'Order Now',
    ctaTextBn: 'অর্ডার করুন',
    ctaLink: '/products',
    priority: '4',
    image: '',
  });

  const handleToggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    toast.success(isBn ? 'ব্যানার স্ট্যাটাস পরিবর্তিত হয়েছে' : 'Banner active status toggled');
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.subtitleEn) {
      toast.error(isBn ? 'শিরোনাম ও সাবটাইটেল আবশ্যক' : 'Title and Subtitle are required');
      return;
    }

    const newSlide: BannerSlide = {
      id: `hs-${Date.now()}`,
      titleEn: formData.titleEn,
      titleBn: formData.titleBn || formData.titleEn,
      subtitleEn: formData.subtitleEn,
      subtitleBn: formData.subtitleBn || formData.subtitleEn,
      badgeEn: formData.badgeEn,
      badgeBn: formData.badgeBn || formData.badgeEn,
      ctaTextEn: formData.ctaTextEn,
      ctaTextBn: formData.ctaTextBn,
      ctaLink: formData.ctaLink || '/products',
      bgGradient: 'from-slate-950/90 via-slate-900/70 to-primary-dark/80',
      isActive: true,
      priority: Number(formData.priority) || 4,
      image: formData.image,
    };

    setBanners([...banners, newSlide]);
    setIsAddModalOpen(false);
    setFormData({
      titleEn: '',
      titleBn: '',
      subtitleEn: '',
      subtitleBn: '',
      badgeEn: '',
      badgeBn: '',
      ctaTextEn: 'Order Now',
      ctaTextBn: 'অর্ডার করুন',
      ctaLink: '/products',
      priority: '4',
      image: '',
    });
    toast.success(isBn ? 'নতুন হিরো ব্যানার স্লাইড যোগ হয়েছে!' : 'New Banner Slide added successfully!');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-foreground">
            {isBn ? 'হিরো ব্যানার ও প্রমোশনাল স্লাইডার' : 'Hero Banner Manager'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isBn
              ? 'হোমপেজ স্লাইডার টেক্সট, ব্যাকগ্রাউন্ড ও পজিশন কন্ট্রোল করুন'
              : 'Control homepage hero slide sequence, headline text and CTA targets'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-md hover:bg-primary-dark transition-all shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{isBn ? 'নতুন ব্যানার স্লাইড যোগ' : 'Add New Banner Slide'}</span>
        </button>
      </div>

      {/* Banner Cards List */}
      <div className="flex flex-col gap-4">
        {banners.map((slide) => (
          <div
            key={slide.id}
            className="flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-border bg-background p-5 shadow-2xs gap-4"
          >
            {/* Banner Meta Info */}
            <div className="flex flex-col gap-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                  Priority #{slide.priority}
                </span>
                {slide.badgeEn && (
                  <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                    {isBn ? slide.badgeBn : slide.badgeEn}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-foreground">
                {isBn ? slide.titleBn : slide.titleEn}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isBn ? slide.subtitleBn : slide.subtitleEn}
              </p>

              <div className="flex items-center gap-4 text-xs text-primary font-bold mt-1">
                <span>CTA: {isBn ? slide.ctaTextBn : slide.ctaTextEn}</span>
                <span>Link: {slide.ctaLink}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleToggleActive(slide.id)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                  slide.isActive
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-800'
                }`}
              >
                {slide.isActive ? 'Active on Home' : 'Disabled'}
              </button>

              <button
                onClick={() => toast.info(isBn ? 'স্লাইড লাইভ প্রিভিউ' : 'Live Preview')}
                className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                title="Preview Slide"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Banner Modal */}
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
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-border bg-background p-4 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <h3 className="text-base font-bold text-foreground">
                  {isBn ? 'নতুন হিরো ব্যানার যোগ করুন' : 'Add New Hero Banner Slide'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl p-1 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="flex flex-col gap-3.5 mt-4 text-xs">
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Banner Headline (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Ex: 24/7 Expert Doctor Video Call"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-foreground block mb-1">
                    Banner Subtitle (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subtitleEn}
                    onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                    placeholder="Ex: Get instant healthcare advice anytime..."
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-foreground block mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={formData.badgeEn}
                      onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                      placeholder="Ex: Instant Consultation"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-foreground block mb-1">CTA Target Link</label>
                    <input
                      type="text"
                      value={formData.ctaLink}
                      onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                      placeholder="/products"
                      className="h-9 w-full rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Banner Background Image */}
                <div>
                  <label className="font-bold text-foreground block mb-1">
                    {isBn ? 'স্লাইড ব্যাকগ্রাউন্ড ছবি' : 'Slide Background Image'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Image URL or upload banner..."
                      className="h-9 flex-1 rounded-xl border border-border bg-background px-3 text-xs focus:border-primary focus:outline-none"
                    />
                    <label className="cursor-pointer rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs font-bold text-foreground hover:bg-muted">
                      <Upload className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData({ ...formData, image: URL.createObjectURL(file) });
                            toast.success('Image attached');
                          }
                        }}
                      />
                    </label>
                  </div>
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
                    Add Banner Slide
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
