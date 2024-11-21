import { body } from 'express-validator';

export const commonValidator = function (method) {
  switch (method) {
    case 'register': {
      return [
        body('name', 'Hospital name is compulsory!').notEmpty().isString(),
        body('mobile', 'Invalid mobile is compulsory!')
          .notEmpty()
          .isMobilePhone(),
        body('password', 'Invalid password is compulsory!')
          .notEmpty()
          .isString(),
        body('email', 'Invalid Email!').notEmpty().isEmail(),
      ];
    }

    case 'updateSangh': {
      return [
        body('sanghName', 'Sangh name is compulsory!').notEmpty().isString(),
      ];
    }
    case 'update-password': {
      return [
        body('newPassword', 'newPassword name is compulsory!')
          .notEmpty()
          .isString(),
        body('oldPassword', 'oldPassword name is compulsory!')
          .notEmpty()
          .isString(),
      ];
    }
    case 'hospitalLogin': {
      return [
        body('email', 'Invalid email!').notEmpty().isEmail(),
        body('password', 'Invalid password!').notEmpty().isString(),
      ];
    }

    case 'approveHospitalJoinRequest': {
      return [
        body('memberID', 'Invalid mobile!').notEmpty().isString(),
        body('approveStatus', 'Invalid password!').notEmpty().isString(),
        body('reasonDisapproval', 'Invalid password!').optional().isString(),
      ];
    }

    case 'forgotPassword': {
      return [body('email', 'Invalid email!').notEmpty().isEmail()];
    }

    case 'verifyEmail': {
      return [
        body('email', 'Invalid email!').notEmpty().isEmail(),
        body('otp', 'Otp is missing!').notEmpty().isNumeric(),
      ];
    }
    case 'updateForgotPassword': {
      return [
        body('email', 'Email is missing!').notEmpty().isEmail(),
        body('otp', 'OTP is missing!').notEmpty().isNumeric(),
        body('newPassword', 'Password is missing!').notEmpty().isString(),
      ];
    }

    case 'verifyUpdateEmail': {
      return [body('email', 'Email is missing!').notEmpty().isEmail()];
    }
    case 'updateEmail': {
      return [
        body('email', 'Email is missing!').notEmpty().isEmail(),
        body('otp', 'Otp is missing!').notEmpty().isNumeric(),
      ];
    }
  }
};
