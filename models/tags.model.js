import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';
import { Product } from './product.model.js';

export const Tags = db.define(
  'Tags',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    uuid: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    productId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Product,
        key: 'id',
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'tags',
  }
);
Tags.belongsTo(Product, {
  as: 'product',
  foreignKey: 'productId',
  targetKey: 'id',
});
