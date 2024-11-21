import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  sendMail: true,
  host: process.env.SMTP_HOST,
  secure: true,
  port: process.env.SMTP_PORT,
  auth: {
    user: `${process.env.SMTP_MAIL}`,
    pass: `${process.env.SMTP_PASSWORD}`,
  },
});

const sendMail = async (mailObject) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: mailObject.to,
    subject: mailObject.subject,
    text: mailObject.text,
    html: mailObject.html,
  };

  try {
    await transporter.sendMail(mailOptions, (err, res) => res);
  } catch (err) {
    console.log('Error ::', err?.message);
    return err;
  }
};

export const wrapedAsyncSendMail = (mailOptions) =>
  new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`error is ${error}`);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(true);
      }
    });
  });

export const sellerRegisteredMail = async (sellerDetails, otp) => {
  const mailObject = {
    from: process.env.SMTP_MAIL,
    to: sellerDetails.email,
    subject: `Welcome ${sellerDetails.firstName} to PristineVault`,
    text: 'Thanks for Registering on PristineVault.',
    html: `<h1>Thanks for Registering, ${sellerDetails.firstName}!</h1><h1>Your Otp is , ${otp} !</h1> Your Process is under Approval. We will notify you soon. <footer>Copyright © 2024 PristineVault. All Rights Reserved</footer><h5>Thanks Team PristineVault</h5>`,
  };

  const resp = await wrapedAsyncSendMail(mailObject);
  // log or process resp;
  return resp;
};
export const sellerApprovedMail = (seller) => {
  const mailObject = {
    email: seller.email,
    subject: `${seller.firstName} has been Approved`,
    text: 'Thanks for Registering on PristineVault.',
    html: `<h1>Hello, ${seller.firstName}!</h1><p>kindly <a href="https://localhost:3000/seller/login">click here</a> and Login with your Registered Credential.</p><p>Your Account has been Approved by Admin you can login & add product now.</p><footer>Copyright © 2024 PristineVault. All Rights Reserved</footer>`,
  };
  sendMail(mailObject);
};
export const userRegisteredMail = async (sellerDetails) => {
  console.log(sellerDetails);

  const mailObject = {
    from: process.env.SMTP_MAIL,
    to: sellerDetails.email,
    subject: `Welcome ${sellerDetails?.firstName} to PristineVault`,
    text: 'Thanks for Registering on PristineVault.',
    html: `<h1>Thanks for Registering, ${sellerDetails.firstName}!</h1>  <footer>Copyright © 2024 PristineVault. All Rights Reserved</footer><h5>Thanks Team PristineVault</h5>`,
  };

  const resp = await wrapedAsyncSendMail(mailObject);
  // log or process resp;
  return resp;
};

export const hospitalSendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Verification OTP to CareConnect.',
    text: 'This is a test message, Thanks for Registering on CareConnect.',
    html: `<h1>Your Otp is , ${otp} !</h1><footer>Copyright © 2024 CareConnect. All Rights Reserved</footer>`,
  };

  const resp = await wrapedAsyncSendMail(mailOptions);
  // log or process resp;
  return resp;
};
export const userSendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Verification OTP to PristineVault.',
    text: 'This is a test message, Thanks for Registering on PristineVault.',
    html: `<h1>Your Otp is , ${otp} !</h1><footer>Copyright © 2024 PristineVault. All Rights Reserved</footer>`,
  };

  const resp = await wrapedAsyncSendMail(mailOptions);

  // log or process resp;
  return resp;
};

export const UserForgotPasswordOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Forgot Password Request Verification OTP to PristineVault',
    text: 'This is a test message,Please enter the given otp to reset your  Account password.',
    html: `<h4>This is a test message,Please enter the given OTP to reset your  Account password.</h4><h1>Your Otp is , ${otp} !</h1><footer>Copyright © 2024 PristineVault. All Rights Reserved</footer>`,
  };

  const resp = await wrapedAsyncSendMail(mailOptions);
  // log or process resp;
  return resp;
};
export const DoctorForgotPasswordOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject: 'Your Forgot Password Request Verification OTP to PristineVault',
    text: 'This is a test message,Please enter the given otp to reset your Account password.',
    html: `<h4>This is a test message,Please enter the given OTP to reset your Account password.</h4><h1>Your Otp is , ${otp} !</h1><footer>Copyright © 2024 PristineVault. All Rights Reserved</footer>`,
  };

  const resp = await wrapedAsyncSendMail(mailOptions);
  // log or process resp;
  return resp;
};
