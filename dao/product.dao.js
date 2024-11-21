import { Product } from '../models/product.model.js';
import { ProductImage } from '../models/productImage.model.js';
import { Tags } from '../models/tags.model.js';

export const ProductDao = {
  create,
  findProductById,
  addImageUrl,
  findProductImageById,
  deleteImageById,
  findImageByProductId,
  createTag,
};

async function findProductById(id) {
  return await Product.findOne({
    where: { id },
    include: [
      {
        model: ProductImage,
        as: 'productImages',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ],
    attributes: {
      exclude: [
        'isApproved',
        'isDeleted',
        'createdAt',
        'updatedAt',
        'profilePic',
      ],
    },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function findImageByProductId(id) {
  return await ProductImage.findAll({
    where: { productId: id },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function create(product) {
  product.tags = false;
  const member = new Product(product);
  return await member
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw console.log('errorr', err);
    });
}
async function addImageUrl(products) {
  try {
    const createdImages = [];
    for (const product of products) {
      const newImage = await ProductImage.create(product);
      createdImages.push(newImage);
    }
    return createdImages;
  } catch (err) {
    console.error('Error while adding/updating image URLs:', err);
    throw new Error('Failed to add/update image URLs');
  }
}
async function findProductImageById(id) {
  return await ProductImage.findOne({
    where: { id },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function deleteImageById(id) {
  return await ProductImage.destroy({
    where: { id },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function createTag(tag) {
  const tags = new Tags(tag);
  return await tags
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw console.log('errorr', err);
    });
}
