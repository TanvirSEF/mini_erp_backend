import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { ProductServices } from './product.service';

const getAllProducts = catchAsync(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'List products (search, filter, sort, paginate)'
  // #swagger.security = [{ bearerAuth: [] }]
  /* #swagger.parameters['searchTerm'] = { in: 'query', type: 'string' } */
  /* #swagger.parameters['category'] = { in: 'query', type: 'string' } */
  /* #swagger.parameters['sort'] = { in: 'query', type: 'string', example: '-createdAt' } */
  /* #swagger.parameters['page'] = { in: 'query', type: 'number' } */
  /* #swagger.parameters['limit'] = { in: 'query', type: 'number' } */
  // #swagger.responses[200] = { description: 'OK' }
  const result = await ProductServices.getAllProducts(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Products retrieved successfully!',
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Get a single product by ID'
  // #swagger.security = [{ bearerAuth: [] }]
  /* #swagger.parameters['id'] = { in: 'path', type: 'string', required: true } */
  // #swagger.responses[200] = { description: 'OK' }
  // #swagger.responses[404] = { description: 'Not found', schema: { $ref: '#/components/schemas/ErrorResponse' } }
  const result = await ProductServices.getSingleProduct(req.params.id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product retrieved successfully!',
    data: result,
  });
});

const createProduct = catchAsync(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Create a product (multipart/form-data, image required)'
  // #swagger.security = [{ bearerAuth: [] }]
  /* #swagger.requestBody = {
        required: true,
        content: {
          "multipart/form-data": {
            schema: { $ref: '#/components/schemas/ProductInput' }
          }
        }
      } */
  // #swagger.responses[201] = { description: 'Created' }
  // #swagger.responses[400] = { description: 'Image missing / validation error', schema: { $ref: '#/components/schemas/ErrorResponse' } }
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
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Update a product (optional new image)'
  // #swagger.security = [{ bearerAuth: [] }]
  /* #swagger.parameters['id'] = { in: 'path', type: 'string', required: true } */
  /* #swagger.requestBody = {
        content: {
          "multipart/form-data": {
            schema: { $ref: '#/components/schemas/ProductInput' }
          }
        }
      } */
  // #swagger.responses[200] = { description: 'Updated' }
  // #swagger.responses[404] = { description: 'Not found', schema: { $ref: '#/components/schemas/ErrorResponse' } }
  const result = await ProductServices.updateProduct(req.params.id as string, req.body, req.file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Product updated successfully!',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  // #swagger.tags = ['Products']
  // #swagger.summary = 'Delete a product'
  // #swagger.security = [{ bearerAuth: [] }]
  /* #swagger.parameters['id'] = { in: 'path', type: 'string', required: true } */
  // #swagger.responses[200] = { description: 'Deleted' }
  // #swagger.responses[404] = { description: 'Not found', schema: { $ref: '#/components/schemas/ErrorResponse' } }
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
