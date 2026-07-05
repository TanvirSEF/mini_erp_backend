import { z } from 'zod';

const createSaleValidation = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product id is required'),
        quantity: z.number().int().positive('Quantity must be a positive integer'),
      })
    )
    .min(1, 'At least one product is required'),
});

export const SaleValidations = {
  createSaleValidation,
};
