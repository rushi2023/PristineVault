import { Address } from '../models/address.model.js';

export const AddressDao = {
  create,
  updateAddress,
  deleteByID,
  findAll,
  findById,
  findByCity,
  findByState,
  findByCountry,
};

async function create(address) {
  const newAddress = new Address(address);

  return await newAddress
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function updateAddress(address, id) {
  return await Address.update(address, { where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function deleteByID(id) {
  return await Address.destroy({ where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findAll() {
  return await Address.findAll()
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findById(id) {
  return await Address.findByPk(id)
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findByCity(cityID) {
  return await Address.findOne({ where: { cityID } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findByState(stateID) {
  return await Address.findOne({ where: { stateID } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findByCountry(countryID) {
  return await Address.findOne({ where: { countryID } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
