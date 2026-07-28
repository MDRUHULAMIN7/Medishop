import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useAppSelector } from '@/store';

export const PRESCRIPTIONS_STORAGE_KEY = 'medishop_prescriptions_v1';

export interface SavedPrescription {
  id: string;
  title: string;
  doctorName?: string;
  patientName: string;
  uploadDate: string;
  fileSize: string;
  fileType: string;
  fileUrl: string;
  status: 'Verified' | 'Pending Verification' | 'Archived';
}

const INITIAL_MOCK_PRESCRIPTIONS: SavedPrescription[] = [
  {
    id: 'rx-101',
    title: 'Diabetic & Hypertension Routine Rx',
    doctorName: 'Dr. A. K. M. Shamsul Huda (Cardiologist)',
    patientName: 'Mohammad Ruhul Amin',
    uploadDate: '15 Jul 2026',
    fileSize: '1.2 MB',
    fileType: 'PDF Document',
    fileUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
    status: 'Verified',
  },
  {
    id: 'rx-102',
    title: 'General OTC & Allergy Prescription',
    doctorName: 'Square Hospital Outpatient Dept.',
    patientName: 'Mohammad Ruhul Amin',
    uploadDate: '02 Jun 2026',
    fileSize: '850 KB',
    fileType: 'JPEG Image',
    fileUrl: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=600&auto=format&fit=crop',
    status: 'Verified',
  },
];

export function usePrescriptions() {
  const language = useAppSelector((state) => state.ui.language);
  const isBn = language === 'bn';

  const [prescriptions, setPrescriptions] = useState<SavedPrescription[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(PRESCRIPTIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPrescriptions(parsed);
          return;
        }
      }
      setPrescriptions(INITIAL_MOCK_PRESCRIPTIONS);
      localStorage.setItem(
        PRESCRIPTIONS_STORAGE_KEY,
        JSON.stringify(INITIAL_MOCK_PRESCRIPTIONS)
      );
    } catch (e) {
      console.error('Failed to load prescriptions:', e);
    }
  }, []);

  const addPrescription = useCallback(
    (newRx: Omit<SavedPrescription, 'id' | 'uploadDate' | 'status'>) => {
      const created: SavedPrescription = {
        ...newRx,
        id: `rx-${Date.now()}`,
        uploadDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Verified',
      };

      setPrescriptions((prev) => {
        const updated = [created, ...prev];
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            PRESCRIPTIONS_STORAGE_KEY,
            JSON.stringify(updated)
          );
        }
        return updated;
      });

      toast.success(
        isBn
          ? 'প্রেসক্রিপশন সফলভাবে সংরক্ষণ করা হয়েছে!'
          : 'Prescription saved successfully!'
      );
    },
    [isBn]
  );

  const deletePrescription = useCallback(
    (id: string) => {
      setPrescriptions((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            PRESCRIPTIONS_STORAGE_KEY,
            JSON.stringify(updated)
          );
        }
        toast.info(
          isBn ? 'প্রেসক্রিপশন মোছা হয়েছে' : 'Prescription removed'
        );
        return updated;
      });
    },
    [isBn]
  );

  return {
    prescriptions,
    addPrescription,
    deletePrescription,
    isBn,
  };
}
