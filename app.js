import './config/authenticate.js';

import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { adminRouter } from './routes/admin.js';
import { cityRouter } from './routes/city.js';
import { countryRouter } from './routes/country.js';
import { sellerRouter } from './routes/seller.js';
import { stateRouter } from './routes/state.js';
import { userRouter } from './routes/user.js';

export const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

app.use(limiter);
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'tiny'));

app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/seller', sellerRouter);
app.use('/country', countryRouter);
app.use('/city', cityRouter);
app.use('/state', stateRouter);
