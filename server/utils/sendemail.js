// utils/sendEmail.js

const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter using Gmail SMTP explicitly
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // use 465 for SSL
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.MAIL_USER, // Your Gmail address
    pass: process.env.MAIL_PASS, // App password (not your Gmail login password)
  },
});

/**
 * Sends an email using Gmail via Nodemailer.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject of the email
 * @param {string} htmlContent - HTML body content
 * @returns {Promise} - Resolves on success, rejects on failure
 */
function sendEmail(to, subject, htmlContent) {
  return transporter.sendMail({
    from: `"ARYA LEGAL PROCESS" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  });
}

module.exports = sendEmail;
