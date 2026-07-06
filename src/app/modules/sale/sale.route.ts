import { Router } from 'express';
import { SaleControllers } from './sale.controller';
import { SaleValidations } from './sale.validation';
import { PERMISSIONS } from '../role/role.permissions';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/',
  auth(PERMISSIONS.SALE_CREATE),
  validateRequest(SaleValidations.createSaleValidation),
  /* #swagger.tags = ['Sales'] */
  /* #swagger.summary = 'Create a sale (auto stock reduce + grand total, transactional)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.requestBody = {
        required: true,
        content: { "application/json": { schema: { $ref: '#/components/schemas/SaleInput' } } }
      } */
  /* #swagger.responses[201] = { description: 'Created', schema: { $ref: '#/components/schemas/SaleResponse' } } */
  /* #swagger.responses[409] = { description: 'Insufficient stock', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  /* #swagger.responses[404] = { description: 'Product not found', schema: { $ref: '#/components/schemas/ErrorResponse' } } */
  SaleControllers.createSale
);

router.get(
  '/',
  auth(PERMISSIONS.SALE_READ),
  /* #swagger.tags = ['Sales'] */
  /* #swagger.summary = 'Get sale history (newest first)' */
  /* #swagger.security = [{ bearerAuth: [] }] */
  /* #swagger.responses[200] = { description: 'OK' } */
  SaleControllers.getAllSales
);

export const SaleRoutes = router;
