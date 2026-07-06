import { Router } from 'express';
import { UserAuthRoutes } from '../modules/user/user.route';
import { UserManagementRoutes } from '../modules/user/user.management.route';
import { ProductRoutes } from '../modules/product/product.route';
import { SaleRoutes } from '../modules/sale/sale.route';
import { DashboardRoutes } from '../modules/dashboard/dashboard.route';
import { RoleRoutes } from '../modules/role/role.route';

const router = Router();

router.use('/auth', UserAuthRoutes);
router.use('/users', UserManagementRoutes);
router.use('/products', ProductRoutes);
router.use('/sales', SaleRoutes);
router.use('/dashboard', DashboardRoutes);
router.use('/roles', RoleRoutes);

export default router;
