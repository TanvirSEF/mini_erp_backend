import { Router } from 'express';
import { upload } from '../../middlewares/multer';
import { ProductControllers } from './product.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/',
  auth('Admin', 'Manager'), // Only Admin/Manager can create
  upload.single('file'), // Middleware to handle image upload
  ProductControllers.createProduct
);

router.get('/', ProductControllers.getAllProducts);

export const ProductRoutes = router;
