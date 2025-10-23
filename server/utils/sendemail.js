// utils/sendEmail.js
const axios = require('axios');
require('dotenv').config();

async function sendEmail(to, subject, htmlContent) {
  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not set in environment variables");
  }

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

    console.log(`Email successfully sent to ${to}`);
    return response.data;

  } catch (error) {
    console.error('Error sending email via Brevo API:');
    if (error.response) {
      // API responded with an error (like 401)
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      // Network or other errors
      console.error(error.message);
    }
    throw error;
  }
}

module.exports = sendEmail;
