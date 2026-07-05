import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

router.use('/auth', UserRoutes);

export default router;
