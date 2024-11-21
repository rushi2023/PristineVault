import { validationResult } from 'express-validator';
import { AdminDao } from '../dao/admin.dao.js';
import { SellerDao } from '../dao/seller.dao.js';
import { deleteAddress } from '../utils/commonUtils.js';

export const adminController = {
  registerAdmin: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }

        const checkEmail = await AdminDao.findByEmail(req.body?.email);
        if (checkEmail) {
          return res.status(400).json({
            status: false,
            message: 'Email already registered, please try other!',
          });
        }

        req.body.isEmailVerified = true;

        // otp generation
        // const otp = Math.floor(100000 + Math.random() * 900000);

        // req.body.otp = otp;
        // const otpSent = await hospitalSendOTP(req.body.email, otp);

        // if (!otpSent) {
        //   return res.status(400).json({
        //     status: false,
        //     message: 'Invalid Email Address',
        //   });
        // }

        const adminCreated = await AdminDao.create(req.body);
        if (!adminCreated) {
          deleteAddress(req.body.addressID);
          return res.status(400).json({
            status: false,
            message: 'Admin not registered!!!',
          });
        }

        return res.status(200).json({
          status: true,
          message: 'Admin registered Successfully!!',
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
  approveSeller: [
    async (req, res) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            status: false,
            message: errors.errors[0].msg,
          });
        }

        const { id } = req.params;
        console.log(id);

        const checkRequest = await SellerDao.pendingRequestById(id);

        if (!checkRequest) {
          return res.status(400).json({
            status: false,
            message: 'Request not found to approve',
          });
        }
        const { approveStatus } = req.body;

        if (approveStatus == true) {
          const reqAccepted = await SellerDao.acceptRequest(
            checkRequest?.dataValues?.id
          );
          if (reqAccepted) {
            return res.status(200).json({
              status: true,
              message: 'Seller Joining Request Accepted!',
            });
          }
        }
        if (!approveStatus) {
          return res.status(200).json({
            status: true,
            message: 'Seller Joining Request Disapproved!',
          });
        }
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
        const hospitalStatus = req.user?.dataValues?.isEmailVerified;
        console.log(req.user?.dataValues?.isEmailVerified);

        if (hospitalStatus == true) {
          return res.status(200).json({
            status: true,
            token: req.user.token,
          });
        }
        if (hospitalStatus == false) {
          return res.status(400).json({
            status: false,
            message: req.user.dataValues.reasonDisapproval,
          });
        }
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err?.message,
        });
      }
    },
  ],
};
