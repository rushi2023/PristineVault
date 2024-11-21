import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { AdminDao } from '../dao/admin.dao.js';
import { SellerDao } from '../dao/seller.dao.js';
import { UserDao } from '../dao/user.dao.js';

dotenv.config();

// all secret key
// const superAdminSecretKey = process.env.SUPERADMIN_SECRET_KEY;
const hospitalSecretKey = process.env.HOSPITAL_SECRET_KEY;
const sellerSecretkey = process.env.MAINMEMBER_SECRET_KEY;
const doctorTempSecretKey = process.env.MAINMEMBER_TEMP_SECRET_KEY;
// const trusteeSecretKey = process.env.TRUSTEE_SECRET_KEY;
// const operatorSecretKey = process.env.OPERATOR_SECRET_KEY;
const refreshTokenKey = process.env.REFRESH_TOKEN_KEY;

// generate token
// export const getSuperAdminToken = function (user) {
//   try {
//     const payload = {
//       userId: user.dataValues.userId,
//       username: user.dataValues.username,
//     };
//     return jwt.sign(payload, superAdminSecretKey, {
//       expiresIn: 1800,
//     });
//   } catch (err) {
//     return err?.message;
//   }
// };

export const getHospitalAdminToken = function (user) {
  try {
    const payload = {
      hospitalId: user.dataValues.id,
      name: user.dataValues.name,
      email: user.dataValues.email,
    };

    return jwt.sign(payload, hospitalSecretKey, {
      expiresIn: '1h',
    });
  } catch (err) {
    return err?.message;
  }
};

export const getTempMemberToken = function (user) {
  try {
    const payload = {
      userId: user.dataValues.id,
      name: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
      mobile: user.dataValues.mobile,
    };
    return jwt.sign(payload, doctorTempSecretKey, {
      expiresIn: 900,
    });
  } catch (err) {
    return err?.message;
  }
};

export const getSellerToken = function (user) {
  try {
    const payload = {
      userId: user.dataValues.id,
      name: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
      mobile: user.dataValues.mobile,
      email: user.dataValues.email,
    };
    return jwt.sign(payload, sellerSecretkey, {
      expiresIn: '30d', // 5 day
    });
  } catch (err) {
    return err?.message;
  }
};

export const getDocterRefreshToken = function (user) {
  try {
    const payload = {
      id: user.dataValues.id,
      name: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
      mobile: user.dataValues.mobile,
      email: user.dataValues.email,
    };
    return jwt.sign(payload, refreshTokenKey, {
      expiresIn: '30d', // 30 days
    });
  } catch (err) {
    return err?.message;
  }
};

export const getupdatePasswordToken = function (user) {
  try {
    const payload = {
      userId: user.dataValues.id,
      name: `${user.dataValues.firstName} ${user.dataValues.lastName}`,
      mobile: user.dataValues.mobile,
    };
    return jwt.sign(payload, doctorTempSecretKey, {
      expiresIn: 1800,
    });
  } catch (err) {
    return err?.message;
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: errors.errors[0].msg,
      });
    }

    const user = await AdminDao.findByEmail(req.body.email);

    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Invalid Id & Password',
      });
    }

    if (!user.isEmailVerified) {
      return res.status(400).json({
        status: false,
        message: 'Email not yet verified',
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({
        status: false,
        message: 'Invalid Password',
      });
    }

    const token = getHospitalAdminToken(user);
    user.token = token;
    req.user = user;
    await next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const doctorLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: errors.errors[0].msg,
      });
    }

    const user = await UserDao.findMe(req.body.email);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: 'Invalid Id & Password',
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({
        status: false,
        message: 'Invalid Password',
      });
    }

    const token = getSellerToken(user);
    user.token = token;
    req.user = user;
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const verifyAdminToken = async (req, res, next) => {
  try {
    console.log(req?.headers);
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }

    const authen = async () => {
      if (!req.isAuthenticated) {
        const token = req.headers.authorization;

        console.log('verifyHospitalAdminToken', token);
        await jwt.verify(
          token.split('Bearer ')[1],
          hospitalSecretKey,
          async (err, decoded) => {
            if (!err) {
              const user = await AdminDao.findByEmail(decoded.email);
              if (user) {
                req.isAuthenticated = true;
                req.user = user;
              }
            }
          }
        );
      }
    };
    await authen();
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const verifyAdminTempToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }
    const authen = async () => {
      if (!req.isAuthenticated) {
        const token = req.headers.authorization;
        console.log('verifyAdminTempToken', token);
        await jwt.verify(
          token.split('Bearer ')[1],
          doctorTempSecretKey,
          async (err, decoded) => {
            if (!err) {
              const user = await AdminDao.findByEmail(decoded.email);
              if (user) {
                req.isAuthenticated = true;
                req.user = user;
              }
            }
          }
        );
      }
    };
    await authen();
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const verifySellerToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }

    const authen = async () => {
      if (!req.isAuthenticated) {
        const token = req.headers.authorization;
        console.log('verifySellerToken token', token);
        await jwt.verify(
          token.split('Bearer ')[1],
          sellerSecretkey,
          async (err, decoded) => {
            if (!err) {
              const user = await UserDao.findMe(decoded.email);
              if (!user) {
                return res
                  .status(401)
                  .json({ status: false, message: 'User dose not exist.' });
              }
              const seller = await SellerDao.findMeWithUserId(user?.id);
              if (!seller?.isApproved) {
                return res.status(401).json({
                  status: false,
                  message: 'Request is not approved yet!',
                });
              }
              if (seller) {
                req.isAuthenticated = true;
                req.user = seller;
              }
            }
          }
        );
      }
    };
    await authen();
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const verifyMainMemberRefreshToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json({ status: false, message: 'No token provided.' });
    }

    const authen = async () => {
      if (!req.isAuthenticated) {
        const token = req.headers.authorization;
        console.log('verifyMainMemberRefreshToken token', token);
        await jwt.verify(
          token.split('Bearer ')[1],
          refreshTokenKey,
          async (err, decoded) => {
            if (!err) {
              const user = await UserDao.findMe(decoded.mobile);
              if (user) {
                req.isAuthenticated = true;
                req.user = user;
                user.dataValues.loggedInSanghID = decoded.loggedInSanghID;
              }
            }
          }
        );
      }
    };
    await authen();
    await next();
  } catch (err) {
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

export const invalidtoken = async (req, res, next) => {
  try {
    if (!req.isAuthenticated) {
      console.log(req?.body);
      console.log('invalid token');
      return res.status(401).json({
        status: false,
        message: 'unauthorized',
      });
    }
    await next();
  } catch (err) {
    console.log('err1', err);
    return res.status(400).json({
      status: false,
      message: err?.message,
    });
  }
};

// all chain for token authorization
// export const superAdminAuthCheck = [verifySuperAdminToken, invalidtoken]; // only super admin
export const adminAuthCheck = [verifyAdminToken, invalidtoken]; // only sangh admin
export const hospitalDoctoreCheck = [
  verifyAdminToken,
  verifySellerToken,
  verifyAdminTempToken,
  invalidtoken,
];
export const adminTempAuthCheck = [verifyAdminTempToken, invalidtoken]; // only tempmainmember
export const sellerAuthCheck = [verifySellerToken, invalidtoken]; // only mainmember
export const mainMemberAuthAndTempCheck = [
  verifySellerToken,
  verifyAdminTempToken,
  invalidtoken,
]; // mainmember, temp mainmember
export const mainMemberAuthRefreshTokenCheck = [
  verifyMainMemberRefreshToken,
  invalidtoken,
]; // mainmember refresh token
