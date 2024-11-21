import { StateDao } from '../dao/state.dao.js';
import { CountryDao } from '../dao/country.dao.js';

export const stateController = {
  registerState: [
    async (req, res) => {
      try {
        const { countryID } = req.body;
        const { stateName } = req.body;

        const checkCountry = await CountryDao.findById(countryID);
        if (!checkCountry) {
          return res.status(400).json({
            status: false,
            message: 'Country ID is not valid',
          });
        }
        const checkState = await StateDao.findUniqueState(stateName, countryID);
        if (checkState) {
          return res.status(400).json({
            status: false,
            message: 'State already exists!',
          });
        }
        const stateData = {
          countryID,
          stateName,
        };

        await StateDao.create(stateData)
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'State registered Successfully!',
            });
          })
          .catch((err) => {
            res.status(400).json({
              status: false,
              message: err,
            });
          });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],

  viewAllStates: [
    async (req, res) => {
      try {
        const allStates = await StateDao.findAll();

        if (allStates) {
          res.status(200).json({
            status: true,
            data: allStates,
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

  viewStatesByCountry: [
    async (req, res) => {
      try {
        const countryID = req.params.id;
        const checkCountry = await CountryDao.findById(countryID);

        if (!checkCountry) {
          return res.status(400).json({
            status: false,
            message: 'Country not found!',
          });
        }
        const allStates = await StateDao.findByCountryID(countryID);
        if (allStates) {
          return res.status(200).json({
            status: true,
            data: allStates,
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

  updateState: [
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
        const checkCountry = await CountryDao.findById(req.body.countryID);
        if (!checkCountry) {
          return res.status(400).json({
            status: false,
            message: 'Country ID is not valid',
          });
        }
        const updateStateData = {
          stateName: req.body.stateName,
          countryID: req.body.countryID,
        };

        const updateState = await StateDao.updateState(
          updateStateData,
          stateID
        );
        if (updateState[0] == 1) {
          return res.status(200).json({
            status: true,
            message: 'State updated Successfully!',
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

  deleteState: [
    async (req, res) => {
      try {
        const stateID = req.params.id;
        const checkState = await StateDao.findById(stateID);

        if (!checkState) {
          return res.status(400).json({
            status: false,
            message: 'State is not available!',
          });
        }
        const deletedState = await StateDao.deleteById(stateID);
        if (deletedState > 0) {
          return res.status(200).json({
            status: true,
            message: 'State Deleted Successfully!',
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
