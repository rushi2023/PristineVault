import { AddressDao } from '../dao/address.dao.js';
import { addressBodyValidator } from './validators.js';

export const addOrUpdateAddress = async (address) => {
  const validationError = await addressBodyValidator(address);

  if (!validationError.status) {
    return validationError;
  }

  const { addressID } = address;

  if (addressID) {
    const addressUpdated = await AddressDao.updateAddress(address, addressID);
    if (!addressUpdated) {
      return {
        status: false,
        message: 'Address not updated!',
      };
    }

    return {
      status: true,
      message: 'Address updated successfully!',
      addressID,
    };
  }

  delete address.addressID;
  const addressCreated = await AddressDao.create(address);
  if (!addressCreated) {
    return {
      status: false,
      message: 'Address not created!',
    };
  }

  return {
    status: true,
    message: 'Address created successfully!',
    addressID: addressCreated.dataValues.id,
  };
};

export const deleteAddress = async (id) => {
  await AddressDao.deleteByID(id);
};

export const convertEmptyStringToNull = (myObject) => {
  Object.keys(myObject).map((key) => {
    if (myObject[key] == 'null' || myObject[key] == '') {
      myObject[key] = null;
    }
  });
};
