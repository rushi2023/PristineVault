import express from 'express';
import { adminAuthCheck, adminLogin } from '../config/authenticate.js';
import { adminController } from '../controllers/admin-api.js';
import { sellerController } from '../controllers/seller-api.js';
import { authValidator } from '../validators/auth.validator.js';

export const adminRouter = express.Router();

adminRouter.post('/register', adminController.registerAdmin);
adminRouter.post(
  '/login',
  authValidator('login'),
  adminLogin,
  adminController.login
);
adminRouter.get(
  '/approve/:id',
  authValidator('approve'),
  adminAuthCheck,
  adminController.approveSeller
);
adminRouter.get('/requests', adminAuthCheck, sellerController.getAllRequest);
