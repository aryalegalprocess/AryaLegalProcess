// utils/sendEmail.js

const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,     // Your Gmail address
    pass: process.env.MAIL_PASS      // App password (not your actual Gmail password)
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
    html: htmlContent
  });
}

module.exports = sendEmail;