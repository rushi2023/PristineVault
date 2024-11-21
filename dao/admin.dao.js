import bcrypt from 'bcrypt';
import { Admin } from '../models/admin.model.js';

export const AdminDao = {
  create,
  findByEmail,
};

async function create(user) {
  const hashPassword = await bcrypt.hash(`${user.password}`, 10);
  user.password = hashPassword;
  const member = new Admin(user);
  return await member
    .save()
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
async function findByEmail(email) {
  return await Admin.findOne({
    where: { email },
  })
    .then(async (res) => res)
    .catch((err) => {
      throw err;
    });
}
