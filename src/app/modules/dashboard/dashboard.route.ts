import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';
import { PERMISSIONS } from '../role/role.permissions';
import auth from '../../middlewares/auth';

const router = Router();

router.get(
  '/',
  auth(PERMISSIONS.DASHBOARD_READ),
  /* #swagger.tags = ['Dashboard'] */
  /* #swagger.summary = 'Dashboard statistics (totals + low stock products)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.responses[200] = { description: 'OK', schema: { $ref: '#/components/schemas/DashboardResponse' } } */
  DashboardControllers.getDashboardStats
);

export const DashboardRoutes = router;
