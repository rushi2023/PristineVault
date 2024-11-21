import express from 'express';

import { countryController } from '../controllers/country-api.js';

export const countryRouter = express.Router();

// Register a new country
countryRouter.post('/', countryController.registerCountry);

// View all countries
countryRouter.get('/', countryController.viewCountries);

// Update a country by ID
countryRouter.put('/:id', countryController.updateCountry);

// Delete a country by ID
countryRouter.delete('/:id', countryController.deleteCountry);
