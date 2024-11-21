import bcrypt from 'bcrypt';
import { Address } from '../models/address.model.js';
import { City } from '../models/city.model.js';
import { Country } from '../models/country.model.js';
import { SellerUser } from '../models/sellerUser.model.js';
import { State } from '../models/state.model.js';
import { User } from '../models/user.model.js';

export const SellerDao = {
  findMe,
  findMeInUser,
  create,
  findMeWithUserId,
  pendingRequest,
  pendingRequestById,
  acceptRequest,
};
async function create(user) {
  const hashPassword = await bcrypt.hash(`${user.password}`, 10);
  user.password = hashPassword;
  const member = new SellerUser(user);
  return await member
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function findMeWithUserId(id) {
  return await SellerUser.findOne({
    where: { userId: id },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function findMe(id) {
  return await SellerUser.findOne({
    where: { id },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function findMeInUser(email) {
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
async function pendingRequest() {
  return await SellerUser.findAll({
    where: { isApproved: false },
    include: [
      {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['lastLogin', 'updatedAt', 'createdAt', 'password', 'otp'],
        },
      },
    ],
    attributes: { exclude: ['lastLogin', 'updatedAt', 'createdAt'] },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function pendingRequestById(id) {
  return await SellerUser.findOne({
    where: { isApproved: false, id },
    include: [
      {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['lastLogin', 'updatedAt', 'createdAt', 'password', 'otp'],
        },
      },
    ],
    attributes: { exclude: ['lastLogin', 'updatedAt', 'createdAt'] },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function acceptRequest(id) {
  return await SellerUser.update(
    { isApproved: true },
    { where: { id } },
    { returning: true }
  )
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
