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
    tagline: 'Online Pharmacy & Healthcare BD',
    logoLight: '/images/logo.png',
    favicon: '/favicon.ico',
    contactEmail: 'support@medishop.com.bd',
    contactPhone: '+880 1742-643763',
    address: 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh',
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
    options: [],
  },
  seo: {
    defaultMetaTitle: 'mediShop — Online Pharmacy BD',
    defaultMetaDescription: 'Genuine medicine doorstep delivery in Bangladesh',
  },
  legal: {
    termsContent: 'Welcome to mediShop. By using our website, you agree to our terms and conditions.',
    privacyContent: 'We protect your personal data and health information with strict confidentiality.',
    refundPolicyContent: 'Returns accepted within 7 days with original seal & invoice receipt.',
    invoiceTerms: 'Goods once sold are non-refundable unless damaged or incorrect. DGDA verified items.',
    warrantyPolicyContent: 'Manufacturer warranty applies where applicable with official invoice.',
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

  const applyFaviconToDOM = (faviconUrl?: string) => {
    if (typeof document === 'undefined' || !faviconUrl) return;
    try {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = faviconUrl;
    } catch {}
  };

  const applyColorsToDOM = (primary?: string, accent?: string) => {
    if (typeof document === 'undefined') return;
    const pColor = primary || '#1D4ED8';
    const aColor = accent || '#F59E0B';

    let styleEl = document.getElementById('dynamic-branding');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-branding';
      document.head.appendChild(styleEl);
    }

    styleEl.innerHTML = `
      :root {
        --site-primary: ${pColor} !important;
        --site-accent: ${aColor} !important;
        --color-primary: ${pColor} !important;
        --color-primary-dark: ${pColor} !important;
        --color-primary-light: ${pColor} !important;
        --color-ring: ${pColor} !important;
        --color-accent: ${aColor} !important;
        --color-accent-dark: ${aColor} !important;
      }
    `;

    document.documentElement.style.setProperty('--site-primary', pColor);
    document.documentElement.style.setProperty('--site-accent', aColor);
    document.documentElement.style.setProperty('--color-primary', pColor);
    document.documentElement.style.setProperty('--color-accent', aColor);
  };

  const refreshSettings = async () => {
    try {
      const data = await settingsService.getPublicSettings();
      setSettings(data);
      applyColorsToDOM(data.branding?.primaryColor, data.branding?.accentColor);
      applyFaviconToDOM(data.general?.favicon);
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
        legal: { ...(prev.legal || defaultSettings.legal!), ...newSettings.legal },
      };
      applyColorsToDOM(updated.branding?.primaryColor, updated.branding?.accentColor);
      applyFaviconToDOM(updated.general?.favicon);
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
