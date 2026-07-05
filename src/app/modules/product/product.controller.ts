import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
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

const createProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.createProduct(req.body, req.file);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Product created successfully!',
    data: result,
  });
});

export const ProductControllers = {
  getAllProducts,
  createProduct,
};
