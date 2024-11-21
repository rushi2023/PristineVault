import express from 'express';
import multer from 'multer';
import { sellerAuthCheck } from '../config/authenticate.js';
import { productController } from '../controllers/product-api.js';
import { sellerController } from '../controllers/seller-api.js';
import { authValidator } from '../validators/auth.validator.js';

export const sellerRouter = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});
sellerRouter.post(
  '/',
  authValidator('register'),
  sellerController.registerSeller
);
sellerRouter.post('/login', authValidator('login'), sellerController.login);

sellerRouter.post(
  '/add-product',
  sellerAuthCheck,
  upload.fields([{ name: 'productPics' }]),
  productController.addProduct
);
sellerRouter.delete(
  '/delete-image/:id',
  sellerAuthCheck,
  productController.deleteImage
);
sellerRouter.get(
  '/product/:id',
  sellerAuthCheck,
  productController.getProductById
);
