import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';
import { Address } from './address.model.js';

export const User = db.define(
  'User',
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

    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    middleName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    mobile: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    otp: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isEmailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    gender: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    dateOfBirth: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    addressID: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Address,
        key: 'id',
      },
    },
    profilePic: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    isApproved: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    lastLogin: {
      type: Sequelize.DATE,
    },
  },
  {
    tableName: 'user',
  }
);
User.belongsTo(Address, {
  as: 'address',
  foreignKey: 'addressID',
  targetKey: 'id',
});
