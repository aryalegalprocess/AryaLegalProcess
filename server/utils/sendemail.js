// utils/sendEmail.js

const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter with Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,       // smtp-relay.brevo.com
  port: process.env.BREVO_SMTP_PORT,       // 587 (TLS) or 465 (SSL)
  secure: false,                            // true if port 465
  auth: {
    user: process.env.BREVO_SMTP_USER,     // your Brevo SMTP email
    pass: process.env.BREVO_SMTP_PASS      // your Brevo SMTP password
  },
});

/**
 * Sends an email using Brevo SMTP via Nodemailer.
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Subject of the email
 * @param {string} htmlContent - HTML body content
 * @returns {Promise} - Resolves on success, rejects on failure
 */
function sendEmail(to, subject, htmlContent) {
  return transporter.sendMail({
    from: `"ARYA LEGAL PROCESS" <${process.env.BREVO_SMTP_USER}>`,
    to,
    subject,
    html: htmlContent
  });
}

module.exports = sendEmail;
