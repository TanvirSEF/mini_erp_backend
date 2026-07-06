import { Router } from 'express';
import { upload } from '../../middlewares/multer';
import { ProductControllers } from './product.controller';
import { ProductValidations } from './product.validation';
import { PERMISSIONS } from '../role/role.permissions';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.get('/', auth(PERMISSIONS.PRODUCT_READ), ProductControllers.getAllProducts);
router.get('/:id', auth(PERMISSIONS.PRODUCT_READ), ProductControllers.getSingleProduct);

router.post(
  '/',
  auth(PERMISSIONS.PRODUCT_CREATE),
  upload.single('file'),
  validateRequest(ProductValidations.createProductValidation),
  ProductControllers.createProduct
);

router.patch(
  '/:id',
  auth(PERMISSIONS.PRODUCT_UPDATE),
  upload.single('file'),
  validateRequest(ProductValidations.updateProductValidation),
  ProductControllers.updateProduct
);

router.delete('/:id', auth(PERMISSIONS.PRODUCT_DELETE), ProductControllers.deleteProduct);

export const ProductRoutes = router;
