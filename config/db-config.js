import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

let DB_USER = process.env.DB_USER;
let DB_PORT = process.env.DB_PORT;

let DB_PASSWORD;
let DB_HOST;
let DB_NAME;

switch (process.env.NODE_ENV) {
  case 'development':
    DB_PASSWORD = process.env.DB_PASSWORD_LOCAL;
    DB_HOST = process.env.DB_HOST_LOCAL;
    DB_NAME = process.env.DB_NAME_LOCAL;
    break;
  case 'test':
    DB_PASSWORD = process.env.DB_PASSWORD_TEST;
    DB_HOST = `${process.env.DB_HOST_TEST}`;
    DB_NAME = process.env.DB_NAME_TEST;
    break;
  case 'staging':
    DB_PASSWORD = process.env.DB_PASSWORD_STAG;
    DB_HOST = process.env.DB_HOST_STAG;
    DB_NAME = process.env.DB_NAME_STAG;
    break;
  case 'production':
    DB_PASSWORD = process.env.DB_PASSWORD_PROD;
    DB_HOST = process.env.DB_HOST_PROD;
    DB_NAME = process.env.DB_NAME_PROD;
    break;
  default:
    DB_PASSWORD = process.env.DB_PASSWORD_LOCAL;
    DB_HOST = process.env.DB_HOST_LOCAL;
    DB_NAME = process.env.DB_NAME_LOCAL;
}

console.log(
  `using ${process.env.NODE_ENV} having host ${DB_HOST} for CRUD on Database name ${DB_NAME}`
);

export const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  port: DB_PORT,
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

try {
  db.authenticate();
  console.log('Database connected successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
