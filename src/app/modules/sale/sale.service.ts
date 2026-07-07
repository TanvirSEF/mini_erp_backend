import mongoose, { Types } from 'mongoose';
import { Sale } from './sale.model';
import { Product } from '../product/product.model';
import { ISaleItem } from './sale_interface';
import AppError from '../../errors/AppError';
import { emitToRoom } from '../../utils/socketEmitter';

// stock below this is low
const LOW_STOCK_THRESHOLD = 5;

type TSaleInput = {
  items: { productId: string; quantity: number }[];
};

type TLowStockAlert = {
  _id: Types.ObjectId;
  name: string;
  sku: string;
  stockQuantity: number;
};

const createSale = async (payload: TSaleInput) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let grandTotal = 0;
    const saleItems: ISaleItem[] = [];
    const lowStockAlerts: TLowStockAlert[] = [];

    for (const item of payload.items) {
      const product = await Product.findOneAndUpdate(
        { _id: item.productId, stockQuantity: { $gte: item.quantity } },
        { $inc: { stockQuantity: -item.quantity } },
        { new: true, session }
      );

      if (!product) {
        const exists = await Product.findById(item.productId).session(session);
        if (!exists) throw new AppError(404, 'Product not found: ' + item.productId);
        throw new AppError(409, 'Insufficient stock for ' + exists.name);
      }

      const subtotal = product.sellingPrice * item.quantity;
      grandTotal = grandTotal + subtotal;

      saleItems.push({
        product: product._id,
        name: product.name,
        price: product.sellingPrice,
        quantity: item.quantity,
        subtotal,
      });

      if (product.stockQuantity < LOW_STOCK_THRESHOLD) {
        lowStockAlerts.push({
          _id: product._id,
          name: product.name,
          sku: product.sku,
          stockQuantity: product.stockQuantity,
        });
      }
    }

    const sale = await Sale.create([{ items: saleItems, grandTotal }], { session });
    await session.commitTransaction();

    // emit never breaks the sale
    emitToRoom('dashboard', 'sale:created', {
      saleId: sale[0]._id,
      grandTotal,
      itemsCount: saleItems.length,
    });

    if (lowStockAlerts.length > 0) {
      emitToRoom('dashboard', 'low-stock', lowStockAlerts);
    }

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
