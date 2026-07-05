import { Product } from '../product/product.model';
import { Sale } from '../sale/sale.model';

const getDashboardStats = async () => {
  const [totalProducts, salesCount, revenueAgg, lowStockProducts] = await Promise.all([
    Product.countDocuments(),
    Sale.countDocuments(),
    Sale.aggregate([{ $group: { _id: null, total: { $sum: '$grandTotal' } } }]),
    Product.find({ stockQuantity: { $lt: 5 } }),
  ]);

  return {
    totalProducts,
    salesCount,
    totalSales: revenueAgg[0]?.total ?? 0,
    lowStockProducts,
  };
};

export const DashboardServices = {
  getDashboardStats,
};
