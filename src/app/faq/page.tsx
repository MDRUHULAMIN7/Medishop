'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Phone,
  Mail,
  Upload,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useAppSelector } from '@/store';
import { HOTLINE_NUMBER, HOTLINE_TEL, COMPANY_EMAIL_PRIMARY } from '@/lib/constants';

interface FAQItem {
  id: string;
  category: 'prescription' | 'ordering' | 'delivery' | 'payment' | 'returns';
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'prescription',
    questionEn: 'How do I order medicines using a prescription?',
    questionBn: 'প্রেসক্রিপশন দিয়ে কিভাবে ওষুধ অর্ডার করব?',
    answerEn: 'Go to our "Upload Prescription" page, upload a clear photo or PDF of your doctor prescription, enter your phone number, and submit. Our graduate pharmacist will verify your order and call you to confirm.',
    answerBn: 'আমাদের "প্রেসক্রিপশন আপলোড" পেজে গিয়ে আপনার ডাক্তারের দেওয়া প্রেসক্রিপশনের ছবি বা পিডিএফ আপলোড করুন, ফোন নম্বর দিন এবং সাবমিট করুন। আমাদের গ্র্যাজুয়েট ফার্মাসিস্ট রিভিউ করে আপনাকে নিশ্চিত করার জন্য কল দেবেন।',
  },
  {
    id: 'faq-2',
    category: 'prescription',
    questionEn: 'Is a prescription mandatory for all medicines?',
    questionBn: 'সব ওষুধের জন্য কি প্রেসক্রিপশন আবশ্যক?',
    answerEn: 'Prescription is mandatory only for Rx prescription drugs (antibiotics, psychiatric meds, etc.). OTC (Over-The-Counter) products like vitamins, baby items, and general pain relievers can be ordered without a prescription.',
    answerBn: 'শুধুমাত্র প্রেসক্রিপশন ওষুধ (অ্যান্টিবায়োটিক, প্রেশার/ডায়াবেটিস/মানসিক ওষুধ) এর জন্য প্রেসক্রিপশন প্রয়োজন। সাধারণ ওটিসি পণ্য যেমন ভিটামিন, বেবি কেয়ার ও ফুড সাপ্লিমেন্ট প্রেসক্রিপশন ছাড়াই কেনা যাবে।',
  },
  {
    id: 'faq-3',
    category: 'delivery',
    questionEn: 'How fast is Same-Day Dhaka delivery?',
    questionBn: 'ঢাকার ভেতর সেম-ডে ডেলিভারি কত দ্রুত পাওয়া যায়?',
    answerEn: 'Inside Dhaka city, express delivery orders placed before 4:00 PM are delivered within 4 to 6 hours on the same day.',
    answerBn: 'ঢাকা সিটির ভেতরে বিকাল ৪:০০ টার আগে দেওয়া এক্সপ্রেস ডেলিভারি অর্ডারগুলো একই দিনে ৪ থেকে ৬ ঘণ্টার মধ্যে গ্রাহকের দ্বারে পৌঁছে দেওয়া হয়।',
  },
  {
    id: 'faq-4',
    category: 'delivery',
    questionEn: 'What are the delivery charges?',
    questionBn: 'ডেলিভারি চার্জ কত?',
    answerEn: 'Standard shipping inside Dhaka is ৳60 (Free on orders above ৳1,000). Express Dhaka shipping is ৳100. Outside Dhaka courier shipping is ৳120.',
    answerBn: 'ঢাকার ভেতরে সাধারণ ডেলিভারি চার্জ ৳৬০ (১,০০০ টাকার বেশি অর্ডারে ফ্রী ডেলিভারি)। ঢাকা এক্সপ্রেস ডেলিভারি ৳১০০ এবং ঢাকার বাইরে ৳১২০।',
  },
  {
    id: 'faq-5',
    category: 'payment',
    questionEn: 'Which payment options are supported?',
    questionBn: 'কি কি পেমেন্ট মাধ্যম গ্রহণ করা হয়?',
    answerEn: 'We support Cash on Delivery (COD), bKash Mobile Banking, Nagad, Rocket, and Visa / Mastercard debit & credit cards.',
    answerBn: 'আমরা ক্যাশ অন ডেলিভারি (COD), বিকাশ মোবাইল ব্যাংকিং, নগদ, রকেট এবং যেকোনো ডেবিট/ক্রেডিট কার্ডের মাধ্যমে পেমেন্ট গ্রহণ করি।',
  },
  {
    id: 'faq-6',
    category: 'returns',
    questionEn: 'Can I return medicines after receiving them?',
    questionBn: 'ওষুধ গ্রহণের পর ফেরত দেওয়া সম্ভব?',
    answerEn: 'Yes, if the medicine is sealed, undamaged, and returned within 7 days with the original purchase invoice. Temperature-sensitive cold-chain items are non-returnable once accepted for safety compliance.',
    answerBn: 'হ্যাঁ, যদি ওষুধের প্যাকেজিং অক্ষত ও সিল করা থাকে এবং ক্রয়ের ৭ দিনের মধ্যে ক্যাশ মেমোসহ ফেরত দেওয়া হয়। তবে নিরাপত্তার খাতিরে কোল্ড-চেইন টেম্পারেচার ওষুধের ক্ষেত্রে ডেলিভারি ম্যানের সামনে চেক করার পর ফেরত প্রযোজ্য নয়।',
  },
  {
    id: 'faq-7',
    category: 'ordering',
    questionEn: 'Are your medicines 100% authentic?',
    questionBn: 'আপনাদের ওষুধ কি ১০০% খাঁটি?',
    answerEn: 'Yes, mediShop is a DGDA licensed digital pharmacy (Reg #DAR-2026-BD). All medicines are directly sourced from top pharmaceutical companies in Bangladesh.',
    answerBn: 'হ্যাঁ, মেডিশপ একটি ডিজিডিএ অনুমোদিত নিবন্ধিত ফার্মেসি (লাইসেন্স নং: DAR-2026-BD)। আমরা সরাসরি স্কয়ার, ইনসেপ্টা, বেক্সিমকোসহ শীর্ষ কোম্পানির সাথে কাজ করি।',
  },
];

export default function FAQPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const qText = isBn ? faq.questionBn : faq.questionEn;
    const aText = isBn ? faq.answerBn : faq.answerEn;
    const matchesSearch =
      qText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title & Search Bar */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="h-4 w-4" />
            <span>{isBn ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী' : 'Frequently Asked Questions'}</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-foreground">
            {isBn ? 'আপনার যেকোনো প্রশ্নের উত্তর খুঁজুন' : 'How Can We Help You Today?'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isBn ? 'প্রেসক্রিপশন আপলোড, ডেলিভারি ও পেমেন্ট সংক্রান্ত যেকোনো তথ্যের জন্য নিচের প্রশ্নগুলো দেখুন।' : 'Find answers regarding prescription upload, express shipping, payments, and return policy.'}
          </p>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={isBn ? 'কীওয়ার্ড দিয়ে প্রশ্ন খুঁজুন (যেমন: ডেলিভারি, প্রেসক্রিপশন)...' : 'Search questions (e.g. delivery, prescription)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background pl-10 pr-4 py-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-2xs"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { key: 'all', labelEn: 'All Questions', labelBn: 'সব প্রশ্ন' },
            { key: 'prescription', labelEn: 'Prescriptions', labelBn: 'প্রেসক্রিপশন' },
            { key: 'delivery', labelEn: 'Delivery & Shipping', labelBn: 'ডেলিভারি' },
            { key: 'payment', labelEn: 'Payments', labelBn: 'পেমেন্ট' },
            { key: 'returns', labelEn: 'Returns & Refunds', labelBn: 'ফেরত ও রিফান্ড' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.key
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-muted/40 border border-border text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {isBn ? cat.labelBn : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Accordion FAQ List */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted/20 p-8 text-center text-xs text-muted-foreground">
              {isBn ? 'কোনো মানানসই প্রশ্ন পাওয়া যায়নি।' : 'No matching questions found.'}
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-border bg-background shadow-2xs transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-foreground hover:bg-muted/30 transition-colors"
                  >
                    <span>{isBn ? faq.questionBn : faq.questionEn}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-primary shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground border-t border-border/50 leading-relaxed bg-muted/10">
                      {isBn ? faq.answerBn : faq.answerEn}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support Banner */}
        <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-gradient-to-r from-primary-soft/50 via-background to-accent-light/50 p-6 text-center space-y-3">
          <h3 className="text-base font-bold text-foreground">
            {isBn ? 'অন্য কোনো প্রশ্ন আছে?' : 'Still Have Questions?'}
          </h3>
          <p className="text-xs text-muted-foreground">
            {isBn ? 'আমাদের গ্রাহক সেবা দল আপনার সহায়তার জন্য প্রস্তুত।' : 'Our support representatives are standing by to assist you.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <a
              href={HOTLINE_TEL}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary-dark"
            >
              <Phone className="h-4 w-4" />
              <span>{HOTLINE_NUMBER}</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
            >
              <Mail className="h-4 w-4 text-primary" />
              <span>{isBn ? 'যোগাযোগ পেজ' : 'Contact Support'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
