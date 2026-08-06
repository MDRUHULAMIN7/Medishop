import { z } from 'zod';

const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;

export const addressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: 'গ্রহীতার নাম কমপক্ষে ২ অক্ষরের হতে হবে' }),
  phone: z.string().trim().refine((val) => bdPhoneRegex.test(val), {
    message: '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন (যেমন: 01700000000)',
  }),
  email: z.string().trim().email({ message: 'সঠিক ইমেইল ইনপুট দিন' }).optional().or(z.literal('')),
  division: z.string().trim().min(1, { message: 'বিভাগ নির্বাচন করুন' }),
  district: z.string().trim().min(2, { message: 'জেলা দিন' }),
  area: z.string().trim().min(2, { message: 'উপজেলা/থানা দিন' }),
  streetAddress: z
    .string()
    .trim()
    .min(5, { message: 'বিস্তারিত ঠিকানা কমপক্ষে ৫ অক্ষরের হতে হবে' }),
  postalCode: z.string().trim().optional(),
  label: z.enum(['Home', 'Office', 'Other'], {
    required_error: 'লেবেল চয়ন করুন',
  }),
  isDefault: z.boolean().default(false),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

export function createAddressValidationSchema(isBn: boolean = true) {
  return z.object({
    label: z.string().trim().optional(),
    recipientName: z
      .string()
      .trim()
      .min(2, {
        message: isBn
          ? 'গ্রহীতার নাম কমপক্ষে ২ অক্ষরের হতে হবে'
          : 'Recipient name must be at least 2 characters',
      }),
    phone: z
      .string()
      .trim()
      .refine((val) => bdPhoneRegex.test(val), {
        message: isBn
          ? '১১ ডিজিটের সঠিক মোবাইল নম্বর দিন'
          : 'Enter a valid 11-digit BD mobile number',
      }),
    division: z.string().trim().optional(),
    district: z.string().trim().min(2, {
      message: isBn ? 'জেলা নির্বাচন বা উল্লেখ করুন' : 'District is required',
    }),
    thana: z.string().trim().min(2, {
      message: isBn ? 'থানা/উপজেলা দিন' : 'Thana/Area is required',
    }),
    addressLine: z.string().trim().min(5, {
      message: isBn
        ? 'বিস্তারিত ঠিকানা কমপক্ষে ৫ অক্ষরের হতে হবে'
        : 'Street address must be at least 5 characters',
    }),
    postalCode: z.string().trim().optional(),
    isDefault: z.boolean().optional(),
  });
}

export type AddressValidationSchemaType = z.infer<
  ReturnType<typeof createAddressValidationSchema>
>;
