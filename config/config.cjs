require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    database: process.env.DB_NAME_LOCAL,
    dialect: 'postgres',
    password: process.env.DB_PASSWORD_LOCAL,
    host: process.env.DB_HOST_LOCAL,
    timestamps: true,
    timezone: '-05:00', // Canada timezone offset
  },
  test: {
    username: process.env.DB_USER,
    database: process.env.DB_NAME_TEST,
    dialect: 'postgres',
    password: process.env.DB_PASSWORD_TEST,
    host: process.env.DB_HOST_TEST,
  },
  staging: {
    username: process.env.DB_USER,
    database: process.env.DB_NAME_STAG,
    dialect: 'postgres',
    password: process.env.DB_PASSWORD_STAG,
    host: process.env.DB_HOST_STAG,
  },
  production: {
    username: process.env.DB_USER,
    database: process.env.DB_NAME_PROD,
    dialect: 'postgres',
    password: process.env.DB_PASSWORD_PROD,
    host: process.env.DB_HOST_PROD,
  },
};
//todo
