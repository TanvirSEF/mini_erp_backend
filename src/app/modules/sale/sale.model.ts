import { Schema, model } from 'mongoose';
import { ISale } from './sale_interface';

const saleSchema = new Schema<ISale>(
  {
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    grandTotal: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Sale = model<ISale>('Sale', saleSchema);
