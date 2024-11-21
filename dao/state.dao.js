import { Country } from '../models/country.model.js';
import { State } from '../models/state.model.js';

export const StateDao = {
  create,
  deleteById,
  findAll,
  findById,
  findUniqueState,
  findByCountryID,
  updateState,
};

async function deleteById(id) {
  return await State.destroy({ where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function create(state) {
  const newState = new State(state);
  return await newState
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findAll() {
  return await State.findAll({
    include: [
      {
        model: Country,
        as: 'country',
        attributes: ['id', 'countryName', 'countryCode'],
      },
    ],
    attributes: { exclude: ['countryID'] },
    order: [['updatedAt', 'DESC']],
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findById(id) {
  return await State.findOne({ where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findUniqueState(stateName, countryID) {
  return await State.findOne({
    where: { stateName, countryID },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function findByCountryID(id) {
  return await State.findAll({
    where: { countryID: id },
    include: [
      {
        model: Country,
        as: 'country',
        attributes: ['id', 'countryName', 'countryCode'],
      },
    ],
    attributes: { exclude: ['countryID'] },
    order: [['updatedAt', 'DESC']],
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function updateState(state, id) {
  const updateStateData = {
    stateName: state.stateName,
    countryID: state.countryID,
  };
  return await State.update(
    updateStateData,
    { where: { id } },
    { returning: true }
  )
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
