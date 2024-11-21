import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { getSellerToken } from '../config/authenticate.js';
import { SellerDao } from '../dao/seller.dao.js';
import { UserDao } from '../dao/user.dao.js';
import { sellerRegisteredMail } from '../utils/mailUtils.js';
export const sellerController = {
  registerSeller: [
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

        const checkEmail = await SellerDao.findMeInUser(email);

        if (checkEmail) {
          const checkSeller = await SellerDao.findMeWithUserId(checkEmail?.id);

          if (checkSeller) {
            return res.status(302).json({
              status: false,
              message: 'Email  already registered!',
            });
          } else {
            const otp = Math.floor(100000 + Math.random() * 900000);

            req.body.otp = otp;
            const otpSent = await sellerRegisteredMail(req.body, otp);

            if (!otpSent) {
              return res.status(400).json({
                status: false,
                message: 'Invalid Email Address',
              });
            }
            const data = {
              userId: checkEmail?.id,
              isApproved: false,
            };
            await SellerDao.create(data);
          }
        } else {
          // otp generation
          const otp = Math.floor(100000 + Math.random() * 900000);

          req.body.otp = otp;
          const otpSent = await sellerRegisteredMail(req.body, otp);

          if (!otpSent) {
            return res.status(400).json({
              status: false,
              message: 'Invalid Email Address',
            });
          }

          req.body.isApproved = false;
          req.body.isMobileVerified = false;
          const checkUserDeleted = await UserDao.userDeletedByMobile(email);
          console.log(checkUserDeleted);

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
            await UserDao.create(req.body);
          }

          const getUserDetails = await SellerDao.findMeInUser(email);

          const data = {
            userId: getUserDetails?.id,
            isApproved: false,
          };
          await SellerDao.create(data);
        }
        return res.status(200).json({
          status: true,
          message: 'You have registered successfully',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  login: [
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
        const checkSeller = await SellerDao.findMeWithUserId(user?.id);
        if (!checkSeller) {
          return res.status(400).json({
            status: false,
            message: 'You have to Reigster First',
          });
        }
        if (!checkSeller?.isApproved) {
          return res.status(400).json({
            status: false,
            message: 'Your Request is not approved yet!',
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
  getAllRequest: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }
        const allrequest = await SellerDao.pendingRequest();
        return res.status(200).json({
          status: true,
          data: allrequest,
          message: 'data fetch  successfully',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
};
