// utils/sendEmail.js

require("dotenv").config();
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Configure the API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Create transactional email API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Sends an email using the Brevo API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML body
 * @returns {Promise}
 */
async function sendEmail(to, subject, htmlContent) {
  const sender = {
    name: "ARYA LEGAL PROCESS",
    email: "aryalegalprocess@gmail.com", // verified sender in Brevo
  };

  const receivers = [{ email: to }];

  try {
    const response = await apiInstance.sendTransacEmail({
      sender,
      to: receivers,
      subject,
      htmlContent,
    });
    console.log("✅ Email sent successfully:", response.messageId || response);
    return response;
  } catch (error) {
    console.error("❌ Error sending email:", error.message || error);
    throw error;
  }
}

module.exports = sendEmail;
