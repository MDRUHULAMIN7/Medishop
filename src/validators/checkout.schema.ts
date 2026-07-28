import { z } from 'zod';

export const checkoutSchema = z.object({
  selectedAddressId: z
    .string({ required_error: 'Please select a delivery address' })
    .min(1, { message: 'Please select a delivery address' }),
  selectedDeliveryMethodId: z.enum(['standard', 'express', 'pickup']),
  selectedPaymentMethodId: z.enum([
    'cod',
    'bkash',
    'nagad',
    'rocket',
    'card',
    'sslcommerz',
    'stripe',
  ]),
  notes: z.string().max(250).optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
