import { CityDao } from '../dao/city.dao.js';
import { CountryDao } from '../dao/country.dao.js';
import { StateDao } from '../dao/state.dao.js';

export const addressBodyValidator = async (data) => {
  const { addressLine1, addressLine2, countryID, stateID, cityID, postalCode } =
    data;

  if (!addressLine1) {
    return {
      status: false,
      message: 'Address Line 1 is required!',
    };
  }

  if (!countryID) {
    return {
      status: false,
      message: 'Country is required!',
    };
  }
  const checkCountry = await CountryDao.findById(countryID);

  if (!checkCountry) {
    return {
      status: false,
      message: "Country doesn't exist!",
    };
  }

  if (!stateID) {
    return {
      status: false,
      message: 'State is required!',
    };
  }

  const checkState = await StateDao.findById(stateID);
  if (!checkState) {
    return {
      status: false,
      message: "State doesn't exist!",
    };
  }

  if (checkState.countryID != countryID) {
    return {
      status: false,
      message: "State doesn't belong to country!",
    };
  }

  if (!cityID) {
    return {
      status: false,
      message: 'City is required!',
    };
  }

  const checkCity = await CityDao.findById(cityID);

  if (!checkCity) {
    return {
      status: false,
      message: "City doesn't exist!",
    };
  }

  if (checkCity.stateID != stateID) {
    return {
      status: false,
      message: "City doesn't belong to state!",
    };
  }

  if (postalCode.toString().length > 6) {
    return {
      status: false,
      message: 'Pin Code should be 6 digits!',
    };
  }
  console.log('addressBodyValidator', data);

  return {
    status: true,
  };
};
