import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { getSellerToken } from '../config/authenticate.js';
import { UserDao } from '../dao/user.dao.js';
import { addOrUpdateAddress } from '../utils/commonUtils.js';
import {
  UserForgotPasswordOTP,
  userRegisteredMail,
  userSendOTP,
} from '../utils/mailUtils.js';

export const userController = {
  registerUser: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const { email } = req.body;
        const checkEmail = await UserDao.findMe(email);
        if (checkEmail) {
          return res.status(302).json({
            status: false,
            message: 'Email  already registered!',
          });
        }
        if (req.body.address) {
          const addUpdateAddress = await addOrUpdateAddress(req.body.address);
          if (!addUpdateAddress.status) {
            return res.status(400).json(addUpdateAddress);
          }
          req.body.addressID = addUpdateAddress.addressID;
        }

        // otp generation
        const otp = Math.floor(100000 + Math.random() * 900000);

        req.body.otp = otp;
        const otpSent = await userSendOTP(req.body.email, otp);

        if (!otpSent) {
          return res.status(400).json({
            status: false,
            message: 'Invalid Email Address',
          });
        }

        req.body.isApproved = false;
        req.body.isMobileVerified = false;
        const checkUserDeleted = await UserDao.userDeletedByMobile(email);

        if (checkUserDeleted) {
          // change flag and request
          const salt = await bcrypt.genSalt(10);
          const hash = await bcrypt.hash(req?.body?.password, salt);
          const updateData = {
            password: hash,
            isDeleted: false,
          };
          await UserDao.updateMember(updateData, checkUserDeleted.id);
        } else {
          const createdUser = await UserDao.create(req.body);
          console.log(createdUser);
        }

        // const requested = await UserDao.createRequest(data);
        // if (!requested) {
        //   return res.status(400).json({
        //     status: true,
        //     message: 'Unable to request to Hospital, Please contact Admin.',
        //   });
        // }
        return res.status(200).json({
          status: true,
          otp: otp,
          message: 'You have  registered successfully',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  getUser: [
    async (req, res) => {
      try {
        const id = req?.params?.id;
        const getOneUser = await UserDao?.findById(id);
        if (!getOneUser) {
          return res.status(400).json({
            status: false,
            message: 'Data not found!',
          });
        }
        return res.status(200).json({
          status: true,
          data: getOneUser,
          message: 'Data fetched successfully',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  loginUser: [
    async (req, res) => {
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
        return res.status(200).json({
          status: true,
          token: token,
          message: 'logged in  successfully',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  forgotPassword: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }

        const email = req.body?.email;
        const checkEmail = await UserDao.findByEmail(email);
        if (!checkEmail) {
          return res.status(400).json({
            status: false,
            message: 'No Account found, please register first',
          });
        }
        const userId = checkEmail?.dataValues?.id;
        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpSent = await UserForgotPasswordOTP(email, otp);

        if (!otpSent) {
          return res.status(400).json({
            status: false,
            message: 'Invalid email',
          });
        }

        const setOtp = await UserDao.updateUser({ otp }, userId);
        if (!setOtp) {
          return res.status(400).json({
            status: false,
            message: 'Something Went Wrong!!',
          });
        }

        return res.status(200).json({
          status: true,
          message: 'Otp sent to your mail.',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  updateForgotPassword: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const email = req?.body?.email;
        const otp = req?.body?.otp;
        let newPassword = req?.body?.newPassword;

        const getRegisterdDetail = await UserDao.findByEmail(email);

        if (Number(getRegisterdDetail?.dataValues?.otp) !== Number(otp)) {
          return res.status(400).json({
            status: false,
            message: 'Invalid OTP!!',
          });
        }

        const userId = getRegisterdDetail?.dataValues?.id;
        await bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPassword, salt, async (err, hash) => {
            newPassword = hash;

            const data = {
              password: newPassword,
              otp: null,
              isEmailVerified: true,
            };
            const updateHospitalPassword = UserDao.updateUser(data, userId);
            if (!updateHospitalPassword) {
              return res.status(400).json({
                status: false,
                message: 'Something went wrong!!',
              });
            }

            return res.status(200).json({
              status: true,
              message: 'Password updated successfully!!',
            });
          });
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  verifyEmail: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const email = req?.body?.email;
        const otp = req?.body?.otp;

        const checkEmail = await UserDao.findByEmail(email);
        if (!checkEmail) {
          return res.status(400).json({
            status: false,
            message: 'No user exist with this email',
          });
        }
        if (checkEmail?.dataValues?.isEmailVerified) {
          return res.status(400).json({
            status: false,
            message: 'Email is already verified!',
          });
        }

        if (Number(checkEmail.dataValues?.otp) !== Number(otp)) {
          return res.status(400).json({
            status: false,
            message: 'Invalid OTP',
          });
        }
        await UserDao.deleteOtp(checkEmail.dataValues.id);
        const isEmailSent = userRegisteredMail(checkEmail?.dataValues);
        if (!isEmailSent) {
          return res.status(400).json({
            status: false,
            message: 'Invalid Email Address',
          });
        }
        return res.status(200).json({
          status: true,
          message: 'Email verified!!',
        });
      } catch (error) {
        return res.status(400).json({
          status: false,
          message: error.message,
        });
      }
    },
  ],
};
