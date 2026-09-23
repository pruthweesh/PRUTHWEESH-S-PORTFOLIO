const crypto = require('crypto');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized as an admin');
    }
    
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private/Admin
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Change admin password
// @route   POST /api/auth/change-password
// @access  Private/Admin
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400);
    throw new Error('All fields are required');
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error('New password and confirm password do not match');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  if (currentPassword === newPassword) {
    res.status(400);
    throw new Error('New password must be different from current password');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Incorrect current password');
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});

// @desc    Request password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please provide an email address');
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    throw new Error('Please enter a valid email address');
  }

  const genericSuccessMessage = 'If an account exists with this email, a password reset link has been sent.';

  const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'admin' });

  // If no user or not admin, return generic success message to prevent user enumeration
  if (!user) {
    return res.status(200).json({ message: genericSuccessMessage });
  }

  // Generate reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/admin/reset-password/${resetToken}`;

  const message = `You are receiving this email because a password reset was requested for your Admin account.\n\nPlease reset your password by visiting the following link:\n\n${resetUrl}\n\nThis link will expire in 15 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0f172a; color: #e2e8f0; border-radius: 16px; border: 1px solid #334155;">
      <h2 style="color: #38bdf8; margin-top: 0;">Password Reset Request</h2>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.5;">You are receiving this email because a password reset was requested for your Admin account.</p>
      <p style="color: #cbd5e1; font-size: 15px; line-height: 1.5;">Click the button below to reset your password. This link is valid for <strong>15 minutes</strong> and can only be used once.</p>
      <div style="margin: 32px 0; text-align: center;">
        <a href="${resetUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; display: inline-block; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #94a3b8; line-height: 1.4;">If the button above does not work, copy and paste this link into your browser:</p>
      <p style="font-size: 12px; color: #38bdf8; word-break: break-all;">${resetUrl}</p>
      <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;">
      <p style="font-size: 12px; color: #64748b;">If you did not request this password reset, please ignore this email. Your password will remain safe and unchanged.</p>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      senderName: 'Portfolio Admin Security',
      subject: 'Admin Password Reset Request',
      message,
      html,
    });

    res.status(200).json({ message: genericSuccessMessage });
  } catch (error) {
    console.error('Password reset email failed to send:', error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('Failed to send password reset email. Please check server email configuration.');
  }
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Reset token is required');
  }

  if (!password || !confirmPassword) {
    res.status(400);
    throw new Error('Password and confirmation are required');
  }

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error('New password and confirm password do not match');
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters long');
  }

  // Hash incoming raw token to compare against stored hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  // Set new password
  user.password = password;
  // Clear reset token fields (single-use)
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    message: 'Password reset successfully. You can now log in with your new password.',
  });
});

module.exports = {
  authUser,
  getUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
