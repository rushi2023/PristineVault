import { validationResult } from 'express-validator';
import path from 'path';
import { ProductDao } from '../dao/product.dao.js';
import { SellerDao } from '../dao/seller.dao.js';
import { deleteImageFromGCP, uplodeImage } from '../utils/gcpUtiles.js';

export const productController = {
  getProductById: [
    async (req, res) => {
      try {
        const { id } = req.params;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const getProduct = await ProductDao.findProductById(id);
        if (!getProduct) {
          return res.status(400).json({
            status: false,
            message: 'Product dose not exist!!',
          });
        }
        const checkSeller = await SellerDao.findMe(getProduct?.sellerId);

        if (!checkSeller || checkSeller?.id !== req.user.id) {
          return res.status(400).json({
            status: false,
            message: 'Product dose not belongs to you!!',
          });
        }
        return res.status(200).json({
          data: getProduct,
          status: true,
          message: 'data fetched successfully',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  addProduct: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const { id } = req.user;

        const tags = JSON.parse(req?.body?.tags);
        const files = req.files?.productPics;
        if (!files || files.length === 0) {
          return res.status(400).json({
            status: false,
            message: 'Product image is mandatory!',
          });
        }
        req.body.sellerId = id;
        const addProduct = await ProductDao.create(req.body);
        if (!addProduct) {
          return res.status(400).json({
            status: false,
            message:
              'Error occure During adding the product, please try again!!',
          });
        }
        if (tags.length !== 0) {
          tags.forEach(async (tag) => {
            const data = {
              name: tag,
              productId: addProduct?.id,
            };
            await ProductDao.createTag(data);
          });
        }

        const { uuid } = addProduct.dataValues;
        const imageUploadPromises = [];
        files.forEach((file, index) => {
          const extension = path.extname(file.originalname);
          const name = `product_pictures/${uuid}/${uuid}_${
            index + 1
          }${extension}`;
          file.name = name;

          // Upload each image and store the resulting URL
          imageUploadPromises.push(
            uplodeImage(file).then((uploaded) => {
              if (uploaded) {
                return {
                  productId: addProduct.id,
                  productUrl: `https://storage.googleapis.com/sellerproductimages/${name}`,
                };
              }
              throw new Error('Image upload failed!');
            })
          );
        });

        // Resolve all image uploads
        const uploadedImages = await Promise.all(imageUploadPromises);
        // console.log(uploadedImages);

        // Add image URLs to the database
        const addProductImages = await ProductDao.addImageUrl(uploadedImages); // Save multiple URLs at once
        if (!addProductImages) {
          return res.status(400).json({
            status: false,
            message:
              'Error occurred during adding product images, please try again!',
          });
        }

        return res.status(200).json({
          status: true,
          message: 'Product added successfully!',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  deleteImage: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const { id } = req.params;
        const getImage = await ProductDao.findProductImageById(id);
        if (!getImage) {
          return res.status(400).json({
            status: false,
            message: 'Image dose not exist!!',
          });
        }
        const product = await ProductDao.findProductById(getImage?.productId);
        if (!product) {
          return res.status(400).json({
            status: false,
            message: 'Product dose not exist!!',
          });
        }

        const checkSeller = await SellerDao.findMe(product?.sellerId);

        if (!checkSeller || checkSeller?.id !== req.user.id) {
          return res.status(400).json({
            status: false,
            message: 'Product dose not belongs to you!!',
          });
        }
        const urlPath = getImage?.productUrl.replace(
          'https://storage.googleapis.com/sellerproductimages/',
          ''
        );
        const deleteImage = await deleteImageFromGCP(urlPath);
        if (!deleteImage) {
          return res.status(400).json({
            status: false,
            message: 'Error occures during deleting Image!!',
          });
        }
        const deleteImageFromDB = await ProductDao.deleteImageById(id);
        if (!deleteImageFromDB) {
          return res.status(400).json({
            status: false,
            message: 'Error occures during deleting Image!!',
          });
        }
        return res.status(200).json({
          status: true,
          message: 'Image deleted successfully!',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  getAllImages: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const { id } = req.params;
        const product = await ProductDao.findProductById(id);
        if (!product) {
          return res.status(400).json({
            status: false,
            message: 'Product dose not exist!!',
          });
        }
        const checkSeller = await SellerDao.findMe(product?.sellerId);

        if (!checkSeller || checkSeller?.id !== req.user.id) {
          return res.status(400).json({
            status: false,
            message: 'Product dose not belongs to you!!',
          });
        }
        const allImages = await ProductDao.findImageByProductId(id);
        return res.status(200).json({
          data: allImages,
          status: true,
          message: 'Image deleted successfully!',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
};
