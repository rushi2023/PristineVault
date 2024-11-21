import { Sequelize } from 'sequelize';
import { db } from '../config/db-config.js';
import { City } from './city.model.js';
import { Country } from './country.model.js';
import { State } from './state.model.js';

export const Address = db.define(
  'Address',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    addressLine1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    addressLine2: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    addressLine3: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cityID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'City',
        key: 'id',
      },
    },
    stateID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'State',
        key: 'id',
      },
    },
    countryID: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Country',
        key: 'id',
      },
    },
    postalCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'address',
  }
);

Address.belongsTo(City, { as: 'city', foreignKey: 'cityID', targetKey: 'id' });
Address.belongsTo(State, {
  as: 'state',
  foreignKey: 'stateID',
  targetKey: 'id',
});
Address.belongsTo(Country, {
  as: 'country',
  foreignKey: 'countryID',
  targetKey: 'id',
});
