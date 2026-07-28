import { z } from 'zod';

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(60, { message: 'Full name must not exceed 60 characters' }),
  phone: z
    .string()
    .min(11, { message: 'Phone number must be 11 digits' })
    .max(11, { message: 'Phone number must be 11 digits' })
    .refine((val) => /^01[3-9]\d{8}$/.test(val), {
      message: 'Enter a valid Bangladeshi phone number (e.g. 01712345678)',
    }),
  email: z
    .string()
    .email({ message: 'Enter a valid email address' })
    .optional()
    .or(z.literal('')),
  division: z.enum(
    [
      'Dhaka',
      'Chattogram',
      'Rajshahi',
      'Khulna',
      'Barishal',
      'Sylhet',
      'Rangpur',
      'Mymensingh',
    ],
    { required_error: 'Please select a division' }
  ),
  district: z.string().min(2, { message: 'District is required' }),
  area: z.string().min(2, { message: 'Area / Thana is required' }),
  streetAddress: z
    .string()
    .min(5, { message: 'Street address must be at least 5 characters' }),
  postalCode: z.string().optional().or(z.literal('')),
  label: z.enum(['Home', 'Office', 'Other']),
  isDefault: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
