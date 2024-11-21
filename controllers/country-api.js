import { CountryDao } from '../dao/country.dao.js';

export const countryController = {
  registerCountry: [
    // Registers a new country
    // Requires authentication: No
    // Inputs: countryName (string), countryCode (string)
    // Example payload: { "countryName": "United States", "countryCode": "US" }
    async (req, res) => {
      try {
        const { countryName } = req.body;
        if (!countryName) {
          // Invalid input: missing countryName
          return res.status(400).json({
            message: 'Invalid country name!',
          });
        }
        const checkCountry = await CountryDao.findByName(countryName);
        if (checkCountry) {
          // Country with the same name already exists
          return res.status(400).json({
            message: 'Country already exists!',
            status: false,
          });
        }
        const { countryCode } = req.body;
        if (!countryCode) {
          // Invalid input: missing countryCode
          return res.status(400).json({
            message: 'Invalid country code!',
          });
        }
        const checkCountryCode = await CountryDao.findByCountryCode(
          countryCode
        );
        if (checkCountryCode) {
          // Country with the same country Code already exists
          return res.status(400).json({
            message: 'Country code already registered!',
            status: false,
          });
        }
        const countryData = {
          countryName,
          countryCode,
        };
        const countryAdded = await CountryDao.create(countryData);
        if (countryAdded) {
          // Country added successfully
          return res.status(200).json({
            status: true,
            message: 'Country added successfully!',
          });
        }
      } catch (err) {
        // Error occurred during country registration
        return res.status(400).json({
          status: false,
          err: err?.message,
        });
      }
    },
  ],

  viewCountries: [
    // View all countries
    // Requires authentication: No
    // Inputs: None
    async (req, res) => {
      try {
        const allCountries = await CountryDao.findAll();
        if (allCountries) {
          // Successfully retrieved all countries
          return res.status(200).json({
            status: true,
            data: allCountries,
          });
        }
      } catch (err) {
        // Error occurred while retrieving countries
        res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],

  updateCountry: [
    // Update a country
    // Requires authentication: No
    // Inputs: countryID (string), countryName (string), countryCode (string)
    // Example payload: { "countryName": "United States", "countryCode": "US" }
    async (req, res) => {
      try {
        const countryID = req.params.id;
        const checkCountry = await CountryDao.findById(countryID);
        if (!checkCountry) {
          // Country to update not found
          return res.status(400).json({
            status: false,
            message: 'No country found to update!',
          });
        }
        const countryData = {
          countryName: req.body.countryName,
          countryCode: req.body.countryCode,
        };
        const countryUpdated = await CountryDao.updateCountry(
          countryData,
          countryID
        );
        if (countryUpdated) {
          // Country updated successfully
          return res.status(200).json({
            status: true,
            message: 'Country updated successfully!',
          });
        }
      } catch (err) {
        // Error occurred during country update
        return res.status(400).json({
          status: false,
          message: 'Country name or country code already registered!',
        });
      }
    },
  ],

  deleteCountry: [
    // Delete a country
    // Requires authentication: No
    // Inputs: countryID (string)
    // Example payload: None (countryID is provided through URL parameters)
    async (req, res) => {
      try {
        const countryID = req.params.id;
        const checkCountry = await CountryDao.findById(countryID);
        if (!checkCountry) {
          // Country to delete not found
          return res.status(400).json({
            status: false,
            message: 'Country not found!',
          });
        }
        const countryDeleted = await CountryDao.deleteById(countryID);
        if (countryDeleted) {
          // Country deleted successfully
          return res.status(200).json({
            status: true,
            message: 'Country deleted successfully!',
          });
        }
      } catch (err) {
        // Error occurred during country deletion
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
};
