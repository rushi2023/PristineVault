import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';
import { Country } from './country.model.js';

export const State = db.define(
  'State',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    stateName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    countryID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Country',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'state',
  }
);

State.belongsTo(Country, {
  as: 'country',
  foreignKey: 'countryID',
  targetKey: 'id',
});
