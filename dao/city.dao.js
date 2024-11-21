import { City } from '../models/city.model.js';
import { Country } from '../models/country.model.js';
import { State } from '../models/state.model.js';

export const CityDao = {
  create,
  deleteById,
  findAll,
  findById,
  findByName,
  findUniqueCity,
  findByStateID,
  updateCity,
};

async function deleteById(id) {
  return await City.destroy({ where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function create(city) {
  const newCity = new City(city);
  return await newCity
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findAll() {
  return await City.findAll({
    include: [
      {
        model: State,
        as: 'state',
        attributes: ['id', 'stateName'],
      },
      {
        model: Country,
        as: 'country',
        attributes: ['id', 'countryName', 'countryCode'],
      },
    ],
    attributes: { exclude: ['stateID', 'countryID'] },
    order: [['updatedAt', 'DESC']],
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findById(id) {
  return await City.findOne({ where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findByName(cityName) {
  return await City.findOne({ where: { cityName } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findUniqueCity(cityName, stateID) {
  return await City.findOne({ where: { cityName, stateID } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findByStateID(id) {
  return await City.findAll({
    where: { stateID: id },
    include: [
      {
        model: State,
        as: 'state',
        attributes: ['id', 'stateName'],
      },
      {
        model: Country,
        as: 'country',
        attributes: ['id', 'countryName', 'countryCode'],
      },
    ],
    attributes: { exclude: ['stateID', 'countryID'] },
    order: [['updatedAt', 'DESC']],
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function updateCity(city, id) {
  return await City.update(city, { where: { id } }, { returning: true })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
