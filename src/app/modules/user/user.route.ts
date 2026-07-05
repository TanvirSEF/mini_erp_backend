import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post('/register', UserControllers.registerUser);
router.post('/login', UserControllers.loginUser);

export const UserRoutes = router;
