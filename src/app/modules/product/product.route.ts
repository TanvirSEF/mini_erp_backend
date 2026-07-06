import { Router } from 'express';
import { upload } from '../../middlewares/multer';
import { ProductControllers } from './product.controller';
import { ProductValidations } from './product.validation';
import { PERMISSIONS } from '../role/role.permissions';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.get(
  '/',
  auth(PERMISSIONS.PRODUCT_READ),
  /* #swagger.tags = ['Products'] */
  /* #swagger.summary = 'List products (search, filter, sort, paginate)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.parameters['searchTerm'] = { in: 'query', type: 'string' } */
  /* #swagger.parameters['category'] = { in: 'query', type: 'string' } */
  /* #swagger.parameters['sort'] = { in: 'query', type: 'string', example: '-createdAt' } */
  /* #swagger.parameters['page'] = { in: 'query', type: 'number' } */
  /* #swagger.parameters['limit'] = { in: 'query', type: 'number' } */
  /* #swagger.responses[200] = { description: 'OK' } */
  ProductControllers.getAllProducts
);

router.get(
  '/:id',
  auth(PERMISSIONS.PRODUCT_READ),
  /* #swagger.tags = ['Products'] */
  /* #swagger.summary = 'Get a single product by ID' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  /* #swagger.responses[200] = { description: 'OK' } */
  /* #swagger.responses[404] = { description: 'Not found', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  ProductControllers.getSingleProduct
);

router.post(
  '/',
  auth(PERMISSIONS.PRODUCT_CREATE),
  upload.single('file'),
  validateRequest(ProductValidations.createProductValidation),
  /* #swagger.tags = ['Products'] */
  /* #swagger.summary = 'Create a product (multipart/form-data, image required)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.requestBody = {
        required: true,
        content: { "multipart/form-data": { schema: { $ref: '#/components/schemas/ProductInput' } } }
      } */
  /* #swagger.responses[201] = { description: 'Created' } */
  /* #swagger.responses[400] = { description: 'Image missing / validation error', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  ProductControllers.createProduct
);

router.patch(
  '/:id',
  auth(PERMISSIONS.PRODUCT_UPDATE),
  upload.single('file'),
  validateRequest(ProductValidations.updateProductValidation),
  /* #swagger.tags = ['Products'] */
  /* #swagger.summary = 'Update a product (optional new image)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  /* #swagger.requestBody = {
        content: { "multipart/form-data": { schema: { $ref: '#/components/schemas/ProductInput' } } }
      } */
  /* #swagger.responses[200] = { description: 'Updated' } */
  /* #swagger.responses[404] = { description: 'Not found', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  ProductControllers.updateProduct
);

router.delete(
  '/:id',
  auth(PERMISSIONS.PRODUCT_DELETE),
  /* #swagger.tags = ['Products'] */
  /* #swagger.summary = 'Delete a product' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.parameters['id'] = { in: 'path', required: true, type: 'string' } */
  /* #swagger.responses[200] = { description: 'Deleted' } */
  /* #swagger.responses[404] = { description: 'Not found', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  ProductControllers.deleteProduct
);

export const ProductRoutes = router;
