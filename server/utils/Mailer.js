const nodemailer = require("nodemailer");
const dotenv = require('dotenv');

dotenv.config();

module.exports.transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE , // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // your SMTP user
      pass: process.env.SMTP_PASS, // your SMTP password
    },
});

