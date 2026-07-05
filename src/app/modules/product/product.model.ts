import { Schema, model } from 'mongoose';
import { IProduct } from './product_interface';

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);
