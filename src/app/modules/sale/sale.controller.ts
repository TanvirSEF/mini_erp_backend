import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SaleServices } from './sale.service';

const createSale = catchAsync(async (req, res) => {
  const result = await SaleServices.createSale(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Sale created successfully!',
    data: result,
  });
});

const getAllSales = catchAsync(async (req, res) => {
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
