import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';
import { PERMISSIONS } from '../role/role.permissions';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/', auth(PERMISSIONS.DASHBOARD_READ), DashboardControllers.getDashboardStats);

export const DashboardRoutes = router;
