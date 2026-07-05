import { Router } from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.get('/', auth('Admin', 'Manager'), DashboardControllers.getDashboardStats);

export const DashboardRoutes = router;
