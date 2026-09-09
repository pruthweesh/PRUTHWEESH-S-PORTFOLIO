const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Google App Passwords are shown with spaces for readability (e.g. "xxxx xxxx xxxx xxxx")
  // but must be sent to SMTP without spaces. Strip them defensively.
  const appPassword = (process.env.EMAIL_PASS || '').replace(/\s/g, '');

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: appPassword,
    },
  });

  // Define the email options
  const mailOptions = {
    from: `"${options.senderName || 'Portfolio Contact'}" <${process.env.EMAIL_USER}>`,
    replyTo: options.replyTo,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html, // Optional HTML template
  };

  // Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
