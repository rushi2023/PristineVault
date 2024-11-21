import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';

export const Country = db.define(
  'Country',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    countryName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    countryCode: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'country',
  }
);
