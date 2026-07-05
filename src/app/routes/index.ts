import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { ProductRoutes } from '../modules/product/product.route';

const router = Router();

router.use('/auth', UserRoutes);
router.use('/products', ProductRoutes);

export default router;
