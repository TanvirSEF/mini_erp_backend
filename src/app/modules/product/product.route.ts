import { Router } from 'express';
import { upload } from '../../middlewares/multer';
import { ProductControllers } from './product.controller';
import { ProductValidations } from './product.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.get('/', auth(), ProductControllers.getAllProducts);
router.get('/:id', auth(), ProductControllers.getSingleProduct);

router.post(
  '/',
  auth('Admin', 'Manager'),
  upload.single('file'),
  validateRequest(ProductValidations.createProductValidation),
  ProductControllers.createProduct
);

router.patch(
  '/:id',
  auth('Admin', 'Manager'),
  upload.single('file'),
  validateRequest(ProductValidations.updateProductValidation),
  ProductControllers.updateProduct
);

router.delete('/:id', auth('Admin', 'Manager'), ProductControllers.deleteProduct);

export const ProductRoutes = router;
