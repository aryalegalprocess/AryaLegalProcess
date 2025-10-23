// utils/sendEmail.js
const axios = require('axios');
require('dotenv').config();

async function sendEmail(to, subject, htmlContent) {
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: { name: "ARYA LEGAL PROCESS", email: "aryalegalprocess@gmail.com" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending email via Brevo API:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = sendEmail;
