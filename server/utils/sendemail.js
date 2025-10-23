const nodemailer = require('nodemailer');

// Use Brevo SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com', // Brevo SMTP server
    port: 587, // TLS port
    secure: false, // true for 465, false for 587
    auth: {
        user: '99ecb4001@smtp-brevo.com', // Brevo SMTP username
        pass: '5U2rYxmJZ7HdgBhp'          // Brevo SMTP password
    }
}));

async function sendEmail(to, subject, htmlContent) {
    try {
        const info = await transporter.sendMail({
            from: '"ARYA LEGAL PROCESS" <aryalegalprocess@gmail.com>', // Gmail sender
            to,
            subject,
            html: htmlContent
        });
        console.log('✅ Email sent:', info.messageId);
    } catch (err) {
        console.error('❌ Error sending email:', err);
    }
}

module.exports = sendEmail;
