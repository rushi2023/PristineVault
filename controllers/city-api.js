import { CityDao } from '../dao/city.dao.js';
import { CountryDao } from '../dao/country.dao.js';
import { StateDao } from '../dao/state.dao.js';

export const cityController = {
  registerCity: [
    async (req, res) => {
      try {
        const { countryID } = req.body;
        const checkCountry = await CountryDao.findById(countryID);
        if (!checkCountry) {
          return res.status(400).json({
            status: false,
            message: 'Country not found! Add country first.',
          });
        }
        const { stateID } = req.body;
        const checkState = await StateDao.findById(stateID);
        if (!checkState) {
          return res.status(400).json({
            status: false,
            message: 'State not found! Add state first.',
          });
        }
        if (checkState.countryID != countryID) {
          return res.status(400).json({
            status: false,
            message: 'State does not belongs to the Country!',
          });
        } else {
          const { cityName } = req.body;
          const { stateID } = req.body;

          const checkCity = await CityDao.findUniqueCity(cityName, stateID);
          if (checkCity) {
            return res.status(400).json({
              status: false,
              message: 'City already exists!',
            });
          }
          const cityData = {
            cityName: req.body.cityName,
            stateID: req.body.stateID,
            countryID: req.body.countryID,
          };
          const cityAdded = await CityDao.create(cityData);
          if (cityAdded) {
            return res.status(200).json({
              status: true,
              message: 'City added successfully!',
            });
          }
        }
      } catch (err) {
        return res.status(400).json({
          status: false,
          err: err?.message,
        });
      }
    },
  ],

  viewAllCities: [
    async (req, res) => {
      try {
        const allCities = await CityDao.findAll();
        if (allCities) {
          return res.status(200).json({
            status: true,
            data: allCities,
          });
        }
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],

  viewCitiesByState: [
    async (req, res) => {
      try {
        const stateID = req.params.id;
        const checkState = await StateDao.findById(stateID);
        if (!checkState) {
          return res.status(400).json({
            status: false,
            message: 'State not found!',
          });
        }
        const allCities = await CityDao.findByStateID(stateID);
        if (allCities) {
          return res.status(200).json({
            status: true,
            data: allCities,
          });
        }
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],

  updateCity: [
    async (req, res) => {
      try {
        const cityID = req.params.id;
        const checkCity = await CityDao.findById(cityID);
        if (!checkCity) {
          return res.status(400).json({
            status: false,
            message: 'City not found!',
          });
        }
        const { countryID } = req.body;
        const checkCountry = await CountryDao.findById(countryID);
        if (!checkCountry) {
          return res.status(400).json({
            status: false,
            message: 'Invalid CountryID!',
          });
        }
        const { stateID } = req.body;
        const checkState = await StateDao.findById(stateID);
        if (!checkState) {
          return res.status(400).json({
            status: false,
            message: 'State not found!',
          });
        }
        if (checkState.countryID != countryID) {
          return res.status(400).json({
            status: false,
            message: 'State does not belongs to the Country!',
          });
        }
        const cityData = {
          cityName: req.body.cityName,
          stateID: req.body.stateID,
          countryID: req.body.countryID,
        };
        const cityUpdated = await CityDao.updateCity(cityData, cityID);
        if (cityUpdated) {
          return res.status(200).json({
            status: true,
            message: 'City updated successfully!',
          });
        }
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],

  deleteCity: [
    async (req, res) => {
      try {
        const cityID = req.params.id;
        const checkCity = await CityDao.findById(cityID);
        if (!checkCity) {
          return res.status(400).json({
            status: false,
            message: 'City not found!',
          });
        }
        const cityDeleted = await CityDao.deleteById(cityID);
        if (cityDeleted) {
          return res.status(200).json({
            status: true,
            message: 'City deleted successfully!',
          });
        }
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
};
