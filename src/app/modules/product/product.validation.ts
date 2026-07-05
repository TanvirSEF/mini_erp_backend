import { z } from 'zod';

const createProductValidation = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  purchasePrice: z.coerce.number().min(0, 'Purchase price must be >= 0'),
  sellingPrice: z.coerce.number().min(0, 'Selling price must be >= 0'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock quantity must be a non-negative integer'),
});

const updateProductValidation = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  sellingPrice: z.coerce.number().min(0).optional(),
  stockQuantity: z.coerce.number().int().min(0).optional(),
});

export const ProductValidations = {
  createProductValidation,
  updateProductValidation,
};
