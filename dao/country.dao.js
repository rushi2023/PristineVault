import { Country } from '../models/country.model.js';

export const CountryDao = {
  create,
  deleteById,
  findById,
  findByName,
  findByCountryCode,
  findAll,
  updateCountry,
};

async function deleteById(id) {
  return await Country.destroy({ where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function create(country) {
  const newCountry = new Country(country);
  return await newCountry
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findById(id) {
  return await Country.findOne({ where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findByName(countryName) {
  return await Country.findOne({ where: { countryName } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findByCountryCode(countryCode) {
  return await Country.findOne({ where: { countryCode } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findAll() {
  return await Country.findAll()
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function updateCountry(country, id) {
  return await Country.update(country, { where: { id } }, { returning: true })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
