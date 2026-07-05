import mongoose from 'mongoose';
import { Sale } from './sale.model';
import { Product } from '../product/product.model';
import { ISaleItem } from './sale_interface';
import AppError from '../../errors/AppError';

type TSaleInput = {
  items: { productId: string; quantity: number }[];
};

const createSale = async (payload: TSaleInput) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let grandTotal = 0;
    const saleItems: ISaleItem[] = [];

    for (const item of payload.items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new AppError(404, 'Product not found: ' + item.productId);
      }

      if (product.stockQuantity < item.quantity) {
        throw new AppError(409, 'Insufficient stock for ' + product.name);
      }

      product.stockQuantity = product.stockQuantity - item.quantity;
      await product.save({ session });

      const subtotal = product.sellingPrice * item.quantity;
      grandTotal = grandTotal + subtotal;

      saleItems.push({
        product: product._id,
        name: product.name,
        price: product.sellingPrice,
        quantity: item.quantity,
        subtotal,
      });
    }

    const sale = await Sale.create([{ items: saleItems, grandTotal }], { session });
    await session.commitTransaction();
    return sale[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const getAllSales = async () => {
  return await Sale.find().sort({ createdAt: -1 });
};

export const SaleServices = {
  createSale,
  getAllSales,
};
