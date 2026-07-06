import mongoose, { Types } from 'mongoose';
import { Sale } from './sale.model';
import { Product } from '../product/product.model';
import { ISaleItem } from './sale_interface';
import AppError from '../../errors/AppError';
import { emitToRoom } from '../../utils/socketEmitter';

// A product is flagged as low stock once its quantity drops to this value
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

      // Collected to emit a single low-stock event after the commit
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

    // emitToRoom swallows errors, so this can't break the sale flow
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
