import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';
import { User } from './user.model.js';

export const SellerUser = db.define(
  'SellerUser',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    isApproved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: 'sellerUser',
  }
);
SellerUser.belongsTo(User, {
  as: 'user',
  foreignKey: 'userId',
  targetKey: 'id',
});
