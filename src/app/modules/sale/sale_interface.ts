import { Document, Types } from 'mongoose';

export interface ISaleItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ISale extends Document {
  items: ISaleItem[];
  grandTotal: number;
}
