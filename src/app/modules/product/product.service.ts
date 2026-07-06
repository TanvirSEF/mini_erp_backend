import QueryBuilder from '../../builder/QueryBuilder';
import { Product } from './product.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import AppError from '../../errors/AppError';

const getAllProducts = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query)
    .search(['name', 'category', 'sku'])
    .filter()
    .sort()
    .paginate();

  return await productQuery.modelQuery;
};

const getSingleProduct = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  return product;
};

const createProduct = async (payload: any, file: any) => {
  const imageName = payload.sku;
  const uploaded = await sendImageToCloudinary(imageName, file.buffer);

  if (!uploaded) throw new AppError(500, 'Image upload failed');

  payload.image = uploaded.secure_url;
  return await Product.create(payload);
};

const updateProduct = async (id: string, payload: any, file: any) => {
  if (file) {
    const imageName = payload.sku ?? 'product-' + id;
    const uploaded = await sendImageToCloudinary(imageName, file.buffer);
    if (!uploaded) throw new AppError(500, 'Image upload failed');
    payload.image = uploaded.secure_url;
  }

  const product = await Product.findByIdAndUpdate(id, payload, { new: true });
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  return product;
};

const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new AppError(404, 'Product not found');
  }
  return product;
};

export const ProductServices = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
