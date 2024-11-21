import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';
import { SellerUser } from './sellerUser.model.js';

export const Product = db.define(
  'Product',
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
    sellerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: SellerUser,
        key: 'id',
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    tags: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    catagory: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    profilePic: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isApproved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'product',
  }
);
Product.belongsTo(SellerUser, {
  as: 'seller',
  foreignKey: 'sellerId',
  targetKey: 'id',
});
