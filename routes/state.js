import express from 'express';

// import { superAdminAuthCheck } from '../config/authenticate.js';
import { stateController } from '../controllers/state-api.js';

export const stateRouter = express.Router();

stateRouter.post('/', stateController.registerState);

stateRouter.get('/', stateController.viewAllStates);

stateRouter.get('/:id', stateController.viewStatesByCountry);

stateRouter.put('/:id', stateController.updateState);

stateRouter.delete('/:id', stateController.deleteState);
