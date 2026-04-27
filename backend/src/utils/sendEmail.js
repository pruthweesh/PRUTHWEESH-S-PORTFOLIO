const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
