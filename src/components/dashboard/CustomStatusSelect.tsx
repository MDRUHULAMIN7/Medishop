'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatusOption {
  value: string;
  label: string;
  badgeClass: string;
}

interface CustomStatusSelectProps {
  value: string;
  options: StatusOption[];
  onChange: (val: string) => void;
  disabled?: boolean;
}

export function CustomStatusSelect({
  value,
  options,
  onChange,
  disabled,
}: CustomStatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 140,
  });

  const currentOpt = options.find((o) => o.value === value) || options[0];

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 150),
      });
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    updateCoords();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleScrollOrResize() {
      updateCoords();
    }

    function handleClickOutside(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        const portalEl = document.getElementById('custom-status-select-portal');
        if (portalEl && portalEl.contains(e.target as Node)) {
          return;
        }
        setIsOpen(false);
      }
    }

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          'flex h-8 items-center gap-1.5 rounded-xl border px-3 text-xs font-black uppercase transition-all shadow-2xs cursor-pointer disabled:opacity-50 select-none shrink-0',
          currentOpt?.badgeClass || 'bg-muted text-foreground border-border'
        )}
      >
        <span>{currentOpt?.label || value}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', isOpen && 'rotate-180')} />
      </button>

      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            id="custom-status-select-portal"
            style={{
              position: 'absolute',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              minWidth: `${coords.width}px`,
              zIndex: 9999,
            }}
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="rounded-2xl border border-border bg-background p-1.5 shadow-2xl ring-1 ring-black/10 overflow-hidden"
              >
                <div className="flex flex-col gap-1">
                  {options.map((opt) => {
                    const isSelected = opt.value === value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          onChange(opt.value);
                          setIsOpen(false);
                        }}
                        className={cn(
                          'flex items-center justify-between rounded-xl px-3 py-2 text-xs font-black uppercase transition-all cursor-pointer select-none',
                          opt.badgeClass,
                          isSelected ? 'ring-2 ring-primary/40 shadow-xs' : 'hover:opacity-95'
                        )}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>,
          document.body
        )}
    </>
  );
}
