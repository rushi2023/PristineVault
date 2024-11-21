import express from 'express';

// import { superAdminAuthCheck } from '../config/authenticate.js';
import { cityController } from '../controllers/city-api.js';

export const cityRouter = express.Router();
// city routes

cityRouter.post('/', cityController.registerCity);

cityRouter.get('/', cityController.viewAllCities);

cityRouter.get('/:id', cityController.viewCitiesByState);

cityRouter.put('/:id', cityController.updateCity);

cityRouter.delete('/:id', cityController.deleteCity);
