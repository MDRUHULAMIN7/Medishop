import { apiClient } from '@/lib/apiClient';

export interface DynamicPaymentMethod {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  accountNumber?: string;
  instructionsBn?: string;
  instructionsEn?: string;
  icon?: string;
  isActive: boolean;
  isDefault?: boolean;
}

export interface DynamicDeliveryOption {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  charge: number;
  estimatedDaysBn: string;
  estimatedDaysEn: string;
  descriptionBn?: string;
  descriptionEn?: string;
  isActive: boolean;
  isDefault?: boolean;
}

export interface GeneralSettings {
  siteName: string;
  tagline?: string;
  logoLight: string;
  logoDark?: string;
  favicon: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
}

export interface BrandingSettings {
  primaryColor: string;
  accentColor: string;
  fontHeading?: string;
  fontBody?: string;
}

export interface PaymentSettings {
  codEnabled: boolean;
  minOrderForCod?: number;
  enabledGateways: string[];
  methods?: DynamicPaymentMethod[];
}

export interface ShippingSettings {
  freeShippingThreshold?: number;
  defaultDeliveryChargeInsideDhaka: number;
  defaultDeliveryChargeOutsideDhaka: number;
  estimatedDeliveryDays: string;
  options?: DynamicDeliveryOption[];
}

export interface SEOSettings {
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  ogImage?: string;
  googleAnalyticsId?: string;
  facebookPixelId?: string;
}

export interface LegalSettings {
  termsContent: string;
  privacyContent: string;
  refundPolicyContent: string;
  invoiceTerms?: string;
  warrantyPolicyContent?: string;
}

export interface PublicSiteSettings {
  general: GeneralSettings;
  branding: BrandingSettings;
  payment?: PaymentSettings;
  shipping: ShippingSettings;
  seo: SEOSettings;
  legal?: LegalSettings;
  maintenanceMode: boolean;
  updatedAt?: string;
}

export interface FullSiteSettings extends PublicSiteSettings {
  payment: PaymentSettings;
  legal: LegalSettings;
}

export const settingsService = {
  /**
   * Get public site settings (Cached in Redis)
   */
  async getPublicSettings(): Promise<PublicSiteSettings> {
    try {
      const res = await apiClient<PublicSiteSettings>('/settings/public');
      return res || {
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
          options: [],
        },
        payment: {
          codEnabled: true,
          enabledGateways: ['cod', 'bkash', 'nagad', 'card'],
          methods: [],
        },
        seo: {
          defaultMetaTitle: 'mediShop — Online Pharmacy BD',
          defaultMetaDescription: 'Genuine medicine doorstep delivery',
        },
        maintenanceMode: false,
      };
    } catch {
      return {
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
          options: [],
        },
        payment: {
          codEnabled: true,
          enabledGateways: ['cod', 'bkash', 'nagad', 'card'],
          methods: [],
        },
        seo: {
          defaultMetaTitle: 'mediShop — Online Pharmacy BD',
          defaultMetaDescription: 'Genuine medicine doorstep delivery',
        },
        maintenanceMode: false,
      };
    }
  },

  /**
   * Get full admin settings (Admin only)
   */
  async getFullSettings(): Promise<FullSiteSettings> {
    const res = await apiClient<FullSiteSettings>('/settings');
    return res;
  },

  /**
   * Update site settings
   */
  async updateSettings(data: Partial<FullSiteSettings>): Promise<FullSiteSettings> {
    const res = await apiClient<FullSiteSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res;
  },
};
