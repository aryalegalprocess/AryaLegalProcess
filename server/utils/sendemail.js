const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // TLS: false for port 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

function sendEmail(to, subject, htmlContent) {
  return transporter.sendMail({
    from: `"ARYA LEGAL PROCESS" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: htmlContent
  });
}

module.exports = sendEmail;
