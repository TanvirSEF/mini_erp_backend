import { Router } from 'express';
import { SaleControllers } from './sale.controller';
import { SaleValidations } from './sale.validation';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/',
  auth(),
  validateRequest(SaleValidations.createSaleValidation),
  SaleControllers.createSale
);

router.get('/', auth('Admin', 'Manager'), SaleControllers.getAllSales);

export const SaleRoutes = router;
