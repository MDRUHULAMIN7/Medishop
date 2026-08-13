'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { settingsService, PublicSiteSettings } from '@/services/settings.service';

interface BrandingContextType {
  settings: PublicSiteSettings;
  updateLocalPreview: (newSettings: Partial<PublicSiteSettings>) => void;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: PublicSiteSettings = {
  general: {
    siteName: 'mediShop',
    tagline: 'Online Pharmacy BD',
    logoLight: '/images/logo.png',
    favicon: '/favicon.ico',
    contactEmail: 'support@medishop.com.bd',
    contactPhone: '+880 1742-643763',
    address: 'Dhaka, Bangladesh',
  },
  branding: {
    primaryColor: '#1D4ED8',
    accentColor: '#F59E0B',
  },
  shipping: {
    freeShippingThreshold: 1000,
    defaultDeliveryChargeInsideDhaka: 60,
    defaultDeliveryChargeOutsideDhaka: 120,
    estimatedDeliveryDays: '2 - 4 working days',
  },
  seo: {
    defaultMetaTitle: 'mediShop — Online Pharmacy BD',
    defaultMetaDescription: 'Genuine medicine doorstep delivery',
  },
  maintenanceMode: false,
};

const BrandingContext = createContext<BrandingContextType>({
  settings: defaultSettings,
  updateLocalPreview: () => {},
  refreshSettings: async () => {},
});

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSiteSettings>(defaultSettings);

  const applyColorsToDOM = (primary?: string, accent?: string) => {
    if (typeof document === 'undefined') return;
    const styleEl = document.getElementById('dynamic-branding');
    const pColor = primary || '#1D4ED8';
    const aColor = accent || '#F59E0B';

    if (styleEl) {
      styleEl.innerHTML = `:root { --site-primary: ${pColor}; --site-accent: ${aColor}; }`;
    } else {
      document.documentElement.style.setProperty('--site-primary', pColor);
      document.documentElement.style.setProperty('--site-accent', aColor);
    }
  };

  const refreshSettings = async () => {
    try {
      const data = await settingsService.getPublicSettings();
      setSettings(data);
      applyColorsToDOM(data.branding?.primaryColor, data.branding?.accentColor);
    } catch {
      // Keep defaults if network fails
    }
  };

  const updateLocalPreview = (newSettings: Partial<PublicSiteSettings>) => {
    setSettings((prev) => {
      const updated = {
        ...prev,
        ...newSettings,
        general: { ...prev.general, ...newSettings.general },
        branding: { ...prev.branding, ...newSettings.branding },
      };
      applyColorsToDOM(updated.branding?.primaryColor, updated.branding?.accentColor);
      return updated;
    });
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <BrandingContext.Provider value={{ settings, updateLocalPreview, refreshSettings }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
