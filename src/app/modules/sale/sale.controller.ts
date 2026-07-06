import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SaleServices } from './sale.service';

const createSale = catchAsync(async (req, res) => {
  // #swagger.tags = ['Sales']
  // #swagger.summary = 'Create a sale (auto stock reduce + grand total, transactional)'
  // #swagger.security = [{ bearerAuth: [] }]
  /* #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: '#/components/schemas/SaleInput' }
          }
        }
      } */
  // #swagger.responses[201] = { description: 'Created', schema: { $ref: '#/components/schemas/SaleResponse' } }
  // #swagger.responses[409] = { description: 'Insufficient stock', schema: { $ref: '#/components/schemas/ErrorResponse' } }
  // #swagger.responses[404] = { description: 'Product not found', schema: { $ref: '#/components/schemas/ErrorResponse' } }
  const result = await SaleServices.createSale(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Sale created successfully!',
    data: result,
  });
});

const getAllSales = catchAsync(async (req, res) => {
  // #swagger.tags = ['Sales']
  // #swagger.summary = 'Get sale history (newest first)'
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.responses[200] = { description: 'OK' }
  const result = await SaleServices.getAllSales();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Sales history retrieved successfully!',
    data: result,
  });
});

export const SaleControllers = {
  createSale,
  getAllSales,
};
