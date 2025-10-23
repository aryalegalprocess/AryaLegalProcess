// utils/sendEmail.js

const axios = require("axios");
require("dotenv").config();

/**
 * Sends an email using Brevo (Sendinblue) API.
 * 
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML body content
 * @returns {Promise} - Resolves on success, rejects on failure
 */
async function sendEmail(to, subject, htmlContent) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { 
          name: "ARYA LEGAL PROCESS", 
          email: process.env.MAIL_USER 
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          "accept": "application/json"
        }
      }
    );

    console.log("✅ Email sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("❌ Error sending email:", err.response ? err.response.data : err.message);
    throw err;
  }
}

module.exports = sendEmail;
