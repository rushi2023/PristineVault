import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';
import { Product } from './product.model.js';

export const ProductImage = db.define(
  'ProductImage',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    productUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product-image',
  }
);
ProductImage.belongsTo(Product, {
  as: 'product',
  foreignKey: 'productId',
  targetKey: 'id',
});
Product.hasMany(ProductImage, {
  as: 'productImages',
  foreignKey: 'productId',
  sourceKey: 'id',
});
