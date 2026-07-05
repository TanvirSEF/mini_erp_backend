import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { ProductRoutes } from '../modules/product/product.route';
import { SaleRoutes } from '../modules/sale/sale.route';

const router = Router();

router.use('/auth', UserRoutes);
router.use('/products', ProductRoutes);
router.use('/sales', SaleRoutes);

export default router;
