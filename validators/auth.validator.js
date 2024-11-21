import { body } from 'express-validator';

export const authValidator = function (method) {
  switch (method) {
    case 'login': {
      return [
        body('email', 'email is missing!').notEmpty(),
        body('password', 'Invalid password!').notEmpty().isLength({ min: 8 }),
      ];
    }
    case 'register': {
      return [
        body('firstName', 'Invalid first name!').notEmpty(),
        // body('middleName', 'Invalid middle name!').notEmpty(),
        body('lastName', 'Invalid last name!').notEmpty(),
        body('email', 'Invalid email!').notEmpty().isEmail(),
        body('password', 'Invalid password!').notEmpty().isLength({ min: 8 }),
      ];
    }
    case 'approve': {
      return [body('approveStatus', 'Invalid Approve Status!').notEmpty()];
    }
  }
};
