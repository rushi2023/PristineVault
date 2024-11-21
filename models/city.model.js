import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';
import { State } from './state.model.js';
import { Country } from './country.model.js';

export const City = db.define(
  'City',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    cityName: {
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
    stateID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'State',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'city',
  }
);

City.belongsTo(State, { as: 'state', foreignKey: 'stateID', targetKey: 'id' });
City.belongsTo(Country, {
  as: 'country',
  foreignKey: 'countryID',
  targetKey: 'id',
});
