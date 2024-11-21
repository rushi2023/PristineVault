import bcrypt from 'bcrypt';

import { Address } from '../models/address.model.js';
import { City } from '../models/city.model.js';
import { Country } from '../models/country.model.js';

// import { Hospital } from '../models/hospital.model.js';

import { State } from '../models/state.model.js';
import { User } from '../models/user.model.js';

export const UserDao = {
  create,
  findMe,
  userDeletedByMobile,
  updateUser,
  findById,
  updateLastLogin,
  approveDoctor,
  deactivateDoctor,
  updateMember,
  findByEmail,
  deleteOtp,
};
async function create(user) {
  const hashPassword = await bcrypt.hash(`${user.password}`, 10);
  user.password = hashPassword;
  const member = new User(user);
  return await member
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw console.log('errorr', err);
    });
}
async function findMe(email) {
  return await User.findOne({
    where: { email, isDeleted: false },
    include: [
      {
        model: Address,
        as: 'address',
        include: [
          {
            model: Country,
            as: 'country',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: State,
            as: 'state',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
          {
            model: City,
            as: 'city',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
        attributes: { exclude: ['cityID', 'stateID', 'countryID'] },
      },
    ],
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function userDeletedByMobile(email) {
  return await User.findOne({ where: { email, isDeleted: true } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function updateUser(user, id) {
  return await User.update(user, { where: { id } }, { returning: true })
    .then(async () => await User.findByPk(id))
    .catch((err) => {
      throw err;
    });
}
async function findById(id) {
  return await User.findOne({
    where: { id, isDeleted: false },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function updateLastLogin(id) {
  const data = {
    lastLogin: new Date(),
  };
  return await User.update(data, { where: { id } })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}

async function approveDoctor(id) {
  return await User.update(
    { isApproved: true, hospitalId: null },
    { where: { id } },
    { returning: true }
  )
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
// async function findAllRequest(doctorId) {
//   return await HospitalDoctor.findAll({
//     where: {
//       doctorId,
//     },
//     include: [
//       {
//         model: Hospital,
//         as: 'hospital',
//         attributes: { exclude: ['uuid', 'password', 'createdAt', 'updatedAt'] },
//       },
//     ],
//     attributes: {
//       exclude: [
//         'createdAt',
//         'updatedAt',
//         'approvedDate',
//         'isApproved',
//         'oldUserCode',
//         'reasonDisapproval',
//         'trusteePIN',
//         'sanghID',
//       ],
//     },
//   })
//     .then(async (res) => res)
//     .catch((err) => {
//       throw err;
//     });
// }

async function deactivateDoctor(id) {
  return await User.update(
    { isDeleted: true },
    { where: { id } },
    { returning: true }
  )
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function updateMember(user, id) {
  return await User.update(user, { where: { id } }, { returning: true })
    .then(async () => await User.findByPk(id))
    .catch((err) => {
      throw err;
    });
}
function findByEmail(email) {
  return User.findOne({
    where: { email },
    include: [
      {
        model: Address,
        as: 'address',
        include: [
          {
            model: Country,
            as: 'country',
            attributes: { exclude: ['updatedAt', 'createdAt'] },
          },
          {
            model: State,
            as: 'state',
            attributes: { exclude: ['updatedAt', 'createdAt'] },
          },
          {
            model: City,
            as: 'city',
            attributes: { exclude: ['updatedAt', 'createdAt'] },
          },
        ],
        attributes: {
          exclude: ['countryID', 'stateID', 'cityID', 'updatedAt', 'createdAt'],
        },
      },
    ],
  });
}
async function deleteOtp(id) {
  return await User.update(
    { otp: null, isEmailVerified: true },
    {
      where: {
        id,
      },
    },
    { returning: true }
  )
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
