import express from 'express';

import { doctorLogin } from '../config/authenticate.js';
import { userController } from '../controllers/user-api.js';
import { authValidator } from '../validators/auth.validator.js';
import { commonValidator } from '../validators/common.validator.js';

export const userRouter = express.Router();

userRouter.post('/', authValidator('register'), userController.registerUser);
userRouter.get('/:id', userController.getUser);
userRouter.post('/login', doctorLogin, userController.loginUser);
userRouter.post(
  '/forgot-password',
  commonValidator('forgotPassword'),
  userController.forgotPassword
);
userRouter.post(
  '/update-forgot-password',
  commonValidator('updateForgotPassword'),
  userController.updateForgotPassword
);
userRouter.post(
  '/verify-email',
  commonValidator('verifyEmail'),
  userController.verifyEmail
);
