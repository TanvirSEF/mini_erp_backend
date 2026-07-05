import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from './product.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import AppError from '../../errors/AppError';

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(['name', 'category', 'sku'])
    .paginate();

  return await productQuery.modelQuery;
};

const createProduct = async (payload: any, file: any) => {
  const imageName = payload.sku;
  const path = file.path;
  const uploaded = await sendImageToCloudinary(imageName, path);

  if (!uploaded) throw new AppError(500, 'Image upload failed');

  payload.image = uploaded.secure_url;
  return await Product.create(payload);
};

export const ProductServices = {
  getAllProducts,
  createProduct,
};
