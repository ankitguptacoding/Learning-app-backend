const nodemailer = require('nodemailer')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

var transport = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS
  }
});
/* istanbul ignore next */

transport.verify()
  .then(() => console.log('Connected to email server'))
  .catch(() => console.log('Unable to connect to email server. Make sure you have configured the SMTP options in .env'))

const sendVerificationEmailResetPwd = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Reset Your Password',
    html: `<p>Please reset your password by entering the otp ${otp} </p>`
  }
  return transport.sendMail(mailOptions)
}

const sendVerificationLinkByEmail = async (email, verificationToken) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Verify your email',
    html: `<p>Please click the following link to verify your email address:</p>
    <a href="${process.env.API_BASE_URL}/email/verifyEmail/${verificationToken}">Verify Email</a>`
  }
  console.log("email",mailOptions)
  return transport.sendMail(mailOptions)
}

/**
 * 
 * @param {any} toMail : EMAIL ADDRESS FOR SEND MAIL. 
 * @param {*} subject : SUBJECT FOR MAIL.
 * @param {*} body : HTML FILE FOR MAIL BODY.
 * @param {*} text : TEXT FOR MAIL ADDITIONAL.
 * @returns 
 */
const sendMail = async (toMail, subject, body, text) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  let send_email = await transporter.sendMail({
    from: process.env.SMTP_USERNAME, // sender address
    to: toMail, // list of receivers
    subject: subject, // Subject line
    text: text && text, // plain text body
    html: body && body, // html body
  });

  if (send_email.messageId) {
    console.log("Message sent: %s", send_email.messageId);
    return send_email.messageId
  }
}

module.exports = {
  sendVerificationEmailResetPwd,
  sendVerificationLinkByEmail,
  sendMail
}
