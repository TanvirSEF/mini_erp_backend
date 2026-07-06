import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { ProductServices } from './product.service';

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully!',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getSingleProduct(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully!',
    data: result,
  });
});

const createProduct = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(400, 'Product image is required');
  }
  const result = await ProductServices.createProduct(req.body, req.file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.updateProduct(req.params.id as string, req.body, req.file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.deleteProduct(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product deleted successfully!',
    data: result,
  });
});

export const ProductControllers = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
