'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/store';
import {
  HOTLINE_NUMBER,
  PHONE_SECONDARY,
  HOTLINE_TEL,
  PHONE_SECONDARY_TEL,
  WHATSAPP_LINK,
  COMPANY_EMAIL_PRIMARY,
  COMPANY_EMAIL_SECONDARY,
  COMPANY_ADDRESS_EN,
  COMPANY_ADDRESS_BN,
  COMPANY_OFFICE_TITLE_EN,
  COMPANY_OFFICE_TITLE_BN,
} from '@/lib/constants';

export default function ContactPage() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [formData, setFormData] = useState({
    name: '',
    phoneOrEmail: '',
    subject: '',
    category: 'general',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phoneOrEmail || !formData.message) {
      toast.error(
        isBn
          ? 'অনুগ্রহ করে আপনার নাম, যোগাযোগ এবং বার্তা প্রদান করুন।'
          : 'Please fill in your name, contact details, and message.'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success(
        isBn
          ? 'আপনার বার্তা সফলভাবে পাঠানো হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।'
          : 'Message sent successfully! Our team will contact you shortly.'
      );
      setFormData({
        name: '',
        phoneOrEmail: '',
        subject: '',
        category: 'general',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 md:py-12">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-3.5 py-1 text-xs font-semibold text-primary">
            <MessageSquare className="h-4 w-4" />
            <span>{isBn ? 'আমরা সাহায্য করতে প্রস্তুত' : 'We are here to help'}</span>
          </div>
          <h1 className="font-serif-title text-3xl sm:text-4xl font-bold text-foreground">
            {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {isBn
              ? 'ওষুধ সংক্রান্ত প্রশ্ন, অর্ডার ট্র্যাকিং অথবা ফার্মাসিস্টের পরামর্শের জন্য যেকোনো সময় আমাদের সাথে যোগাযোগ করতে পারেন।'
              : 'Have a question about medicine, orders, or prescription guidance? Get in touch with our support team.'}
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone */}
          <div className="rounded-2xl border border-border bg-muted/30 p-6 flex flex-col items-center text-center space-y-3 transition-all hover:border-primary/40 hover:shadow-xs">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{isBn ? 'হটলাইন ও সহায়তা' : 'Hotline & Support'}</h3>
              <p className="text-xs text-muted-foreground mt-1">{isBn ? 'সকাল ৯:০০ - রাত ১১:০০ (প্রতিদিন)' : '9:00 AM - 11:00 PM (Daily)'}</p>
            </div>
            <div className="space-y-1 text-xs">
              <a href={HOTLINE_TEL} className="block font-bold text-primary hover:underline">
                {HOTLINE_NUMBER}
              </a>
              <a href={PHONE_SECONDARY_TEL} className="block font-bold text-primary hover:underline">
                {PHONE_SECONDARY}
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-2xl border border-border bg-muted/30 p-6 flex flex-col items-center text-center space-y-3 transition-all hover:border-primary/40 hover:shadow-xs">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{isBn ? 'ইমেইল সাপোর্ট' : 'Email Support'}</h3>
              <p className="text-xs text-muted-foreground mt-1">{isBn ? '২৪ ঘণ্টার মধ্যে দ্রুত উত্তর' : 'Fast response within 24 hours'}</p>
            </div>
            <div className="space-y-1 text-xs">
              <a href={`mailto:${COMPANY_EMAIL_PRIMARY}`} className="block font-semibold text-primary hover:underline">
                {COMPANY_EMAIL_PRIMARY}
              </a>
              <a href={`mailto:${COMPANY_EMAIL_SECONDARY}`} className="block font-semibold text-primary hover:underline">
                {COMPANY_EMAIL_SECONDARY}
              </a>
            </div>
          </div>

          {/* Head Office Address */}
          <div className="rounded-2xl border border-border bg-muted/30 p-6 flex flex-col items-center text-center space-y-3 transition-all hover:border-primary/40 hover:shadow-xs">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">{isBn ? COMPANY_OFFICE_TITLE_BN : COMPANY_OFFICE_TITLE_EN}</h3>
              <p className="text-xs text-muted-foreground mt-1">{isBn ? 'সরাসরি হেড অফিস ঠিকানা' : 'Main Headquarters'}</p>
            </div>
            <p className="text-xs text-foreground font-medium leading-relaxed max-w-xs">
              {isBn ? COMPANY_ADDRESS_BN : COMPANY_ADDRESS_EN}
            </p>
          </div>
        </div>

        {/* Form and Quick Action Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Action Buttons & Office Hours (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-border bg-background p-6 space-y-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>{isBn ? 'জরুরি সেবা ও হটলাইন' : 'Quick Connect'}</span>
              </h3>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {isBn
                  ? 'আপনার কোনো জরুরি ওষুধের তথ্য জানা বা অবিলম্বে অর্ডার দেওয়ার প্রয়োজন হলে সরাসরি হোয়াটসঅ্যাপ বা ফোনে কথা বলুন।'
                  : 'If you need immediate assistance or prescription confirmation, reach us via WhatsApp or Phone call.'}
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{isBn ? 'হোয়াটসঅ্যাপে চ্যাট করুন' : 'Chat on WhatsApp'}</span>
                </a>

                <a
                  href={HOTLINE_TEL}
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all"
                >
                  <Phone className="h-4 w-4" />
                  <span>{isBn ? `কল করুন: ${HOTLINE_NUMBER}` : `Call: ${HOTLINE_NUMBER}`}</span>
                </a>
              </div>
            </div>

            {/* Office Hours Info */}
            <div className="rounded-3xl border border-border bg-muted/40 p-6 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span>{isBn ? 'অফিস সময়সূচী' : 'Head Office Hours'}</span>
              </h3>
              <div className="text-xs text-muted-foreground space-y-2">
                <div className="flex justify-between py-1 border-b border-border">
                  <span>{isBn ? 'শনিবার - বৃহস্পতিবার:' : 'Saturday - Thursday:'}</span>
                  <span className="font-semibold text-foreground">৯:০০ AM - ৮:০০ PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span>{isBn ? 'শুক্রবার:' : 'Friday:'}</span>
                  <span className="font-semibold text-foreground">২:৩০ PM - ৮:০০ PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>{isBn ? 'অনলাইন সাপোর্ট:' : 'Online Support:'}</span>
                  <span className="font-semibold text-primary">২৪/৭ সচল</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-background p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {isBn ? 'আমাদের বার্তা পাঠান' : 'Send Us a Message'}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {isBn
                  ? 'নিচের ফর্মটি পূরণ করুন, আমাদের সাপোর্ট টিম খুব দ্রুত উত্তর প্রদান করবে।'
                  : 'Fill out the form below and our team will get back to you shortly.'}
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-success/40 bg-success-light/30 p-6 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-success/10 text-success mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  {isBn ? 'ধন্যবাদ! আপনার বার্তা প্রাপ্ত হয়েছে।' : 'Thank You! Message Received.'}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'আমাদের একজন প্রতিনিধি শীঘ্রই আপনার প্রদানকৃত মোবাইল বা ইমেইলে যোগাযোগ করবে।'
                    : 'A customer care specialist will respond to your inquiry soon.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-primary hover:underline"
                >
                  {isBn ? 'অন্য একটি বার্তা পাঠান' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isBn ? 'আপনার নাম *' : 'Your Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isBn ? 'যেমন: মোহাম্মদ রাহিম' : 'e.g. John Doe'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  {/* Phone / Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isBn ? 'মোবাইল নম্বর / ইমেইল *' : 'Phone Number or Email *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isBn ? '০১৭XXXXXXXX' : '017XXXXXXXX or email'}
                      value={formData.phoneOrEmail}
                      onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isBn ? 'বিষয়শ্রেণী' : 'Category'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="general">{isBn ? 'সাধারণ প্রশ্ন' : 'General Inquiry'}</option>
                      <option value="order">{isBn ? 'অর্ডার সংক্রান্ত' : 'Order Issues'}</option>
                      <option value="prescription">{isBn ? 'প্রেসক্রিপশন সাহায্য' : 'Prescription Assistance'}</option>
                      <option value="refund">{isBn ? 'রিফান্ড বা ফেরত' : 'Refund & Returns'}</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      {isBn ? 'বিষয় (ঐচ্ছিক)' : 'Subject (Optional)'}
                    </label>
                    <input
                      type="text"
                      placeholder={isBn ? 'যেমন: ডেলিভারি সময়সূচী' : 'e.g. Delivery status'}
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    {isBn ? 'আপনার বার্তা *' : 'Your Message *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={isBn ? 'বিস্তারিত লিখুন...' : 'Type your query or comments here...'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? (isBn ? 'পাঠানো হচ্ছে...' : 'Sending...') : (isBn ? 'বার্তা পাঠান' : 'Send Message')}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
