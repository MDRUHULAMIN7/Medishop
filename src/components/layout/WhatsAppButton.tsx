'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageSquare } from 'lucide-react';
import { WHATSAPP_LINK, HOTLINE_TEL, HOTLINE_NUMBER, MESSENGER_LINK } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store';
import { usePathname } from 'next/navigation';
import { toggleQuickContact, setQuickContactOpen } from '@/store/slices/uiSlice';

export function WhatsAppButton() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isQuickContactOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const handleClose = () => {
    dispatch(setQuickContactOpen(false));
  };

  const handleToggle = () => {
    dispatch(toggleQuickContact());
  };

  // Close menu on click outside or press escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch]);

  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  const contactOptions = [
    {
      id: 'call',
      titleBn: 'সরাসরি কল (২৪/৭)',
      titleEn: 'Call Support (24/7)',
      subBn: HOTLINE_NUMBER,
      subEn: HOTLINE_NUMBER,
      href: HOTLINE_TEL,
      bgColor: 'bg-primary hover:bg-primary-dark',
      icon: <Phone className="h-5 w-5 text-white" />,
    },
    {
      id: 'messenger',
      titleBn: 'ফেসবুক মেসেঞ্জার',
      titleEn: 'FB Messenger',
      subBn: 'ইনস্ট্যান্ট চ্যাট',
      subEn: 'Instant Chat',
      href: MESSENGER_LINK,
      bgColor: 'bg-gradient-to-r from-[#0084FF] to-[#00C6FF]',
      icon: (
        <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.964z" />
        </svg>
      ),
    },
    {
      id: 'whatsapp',
      titleBn: 'হোয়াটসঅ্যাপ চ্যাট',
      titleEn: 'WhatsApp Chat',
      subBn: '২৪/৭ অ্যাক্টিভ',
      subEn: 'Always Active',
      href: WHATSAPP_LINK,
      bgColor: 'bg-[#25D366] hover:bg-[#20ba5a]',
      icon: (
        <svg className="h-5.5 w-5.5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      ref={containerRef}
      aria-label="Quick Customer Support Menu"
      className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Speed Dial Options Container */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col items-end gap-3 mb-1">
            {contactOptions.map((opt, index) => (
              <motion.div
                key={opt.id}
                initial={{ opacity: 0, y: 28, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.85 }}
                transition={{
                  type: 'spring',
                  stiffness: 340,
                  damping: 23,
                  delay: (contactOptions.length - 1 - index) * 0.06,
                }}
                className="flex items-center gap-2.5 group"
              >
                {/* Option Text Label */}
                <a
                  href={opt.href}
                  target={opt.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="rounded-xl border border-border/80 bg-background/95 backdrop-blur-md px-3 py-1.5 shadow-md transition-all hover:bg-background hover:scale-102 flex flex-col items-end"
                >
                  <span className="text-xs font-bold text-foreground leading-tight">
                    {isBn ? opt.titleBn : opt.titleEn}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {isBn ? opt.subBn : opt.subEn}
                  </span>
                </a>

                {/* Option Circular Icon Button */}
                <a
                  href={opt.href}
                  target={opt.href.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  aria-label={isBn ? opt.titleBn : opt.titleEn}
                  className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-200 active:scale-90 hover:scale-110 ${opt.bgColor}`}
                >
                  {opt.icon}
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <div className="relative flex items-center gap-2 group">
        {/* Tooltip Popup on Hover (when closed) */}
        {!isOpen && (
          <span className="hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap pointer-events-none">
            {isBn ? 'সাহায্য ও মেসেজ করুন' : 'Quick Support & Chat'}
          </span>
        )}

        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-label={isBn ? 'মেসেজ ও কন্টাক্ট অপশন খুলুন' : 'Open Contact Options'}
          className={`relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 active:scale-95 hover:scale-105 ${
            isOpen
              ? 'bg-slate-900 ring-4 ring-slate-900/30'
              : 'bg-primary hover:bg-primary-dark ring-4 ring-primary/20'
          }`}
        >
          {/* Subtle background pulse animation when closed */}
          {!isOpen && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-25 pointer-events-none" />
          )}

          {/* Icon with smooth rotation transition */}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageSquare className="h-6 w-6 text-white" />
            )}
          </motion.div>
        </button>
      </div>
    </aside>
  );
}
