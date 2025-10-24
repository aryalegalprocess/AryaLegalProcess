// utils/sendEmail.js

require("dotenv").config();
const { Resend } = require("resend");

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an email using Resend API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML body
 * @returns {Promise}
 */
async function sendEmail(to, subject, htmlContent) {
  try {
    const response = await resend.emails.send({
      from: "ARYA LEGAL PROCESS <aryalegalprocess@gmail.com>", // you can later replace with your domain email
      to,
      subject,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully:", response.id);
    return response;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}

module.exports = sendEmail;
