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
  SaleControllers.createSale
);

router.get('/', auth(PERMISSIONS.SALE_READ), SaleControllers.getAllSales);

export const SaleRoutes = router;
