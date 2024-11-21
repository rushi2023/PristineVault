import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';

export const Admin = db.define(
  'admin',
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
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    otp: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    isEmailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    tempEmail: {
      // this field is use to store the email while updating email
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'admin',
  }
);
