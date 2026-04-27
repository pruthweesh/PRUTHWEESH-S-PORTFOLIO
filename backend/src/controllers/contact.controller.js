const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');

// @desc    Send a message
// @route   POST /api/contact
// @access  Public
const sendMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please fill all fields');
  }

  // Strict email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  // Domain existence check using DNS MX records
  const domain = email.split('@')[1];
  const dns = require('dns');
  const util = require('util');
  const resolveMx = util.promisify(dns.resolveMx);
  
  try {
    const mxRecords = await resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) {
      throw new Error('Domain has no mail servers');
    }
  } catch (err) {
    res.status(400);
    throw new Error('This email domain does not exist or cannot receive mail. Please use a real email.');
  }

  try {
    // Send email to admin first to ensure credentials work
    await sendEmail({
      email: process.env.EMAIL_USER, // Send to yourself
      senderName: `${name} (Via Portfolio)`,
      replyTo: email, // This allows you to hit "Reply" and email the visitor directly
      subject: `New Portfolio Message from ${name}`,
      message: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // If email sends successfully, save to DB
    const newMessage = await Message.create({
      name,
      email,
      message,
    });

    if (newMessage) {
      res.status(201).json({ message: 'Message sent successfully' });
    } else {
      res.status(400);
      throw new Error('Invalid message data');
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500);
    throw new Error('Failed to send email. Please ensure your email credentials are correct.');
  }
});

// @desc    Get all messages
// @route   GET /api/contact
// @access  Private/Admin
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({}).sort({ createdAt: -1 });
  res.json(messages);
});

module.exports = { sendMessage, getMessages };
