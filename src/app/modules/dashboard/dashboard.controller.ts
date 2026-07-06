import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DashboardServices } from './dashboard.service';

const getDashboardStats = catchAsync(async (req, res) => {
  // #swagger.tags = ['Dashboard']
  // #swagger.summary = 'Dashboard statistics (totals + low stock products)'
  // #swagger.security = [{ bearerAuth: [] }]
  // #swagger.responses[200] = { description: 'OK', schema: { $ref: '#/components/schemas/DashboardResponse' } }
  const result = await DashboardServices.getDashboardStats();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard stats retrieved successfully!',
    data: result,
  });
});

export const DashboardControllers = {
  getDashboardStats,
};
