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

// @desc    Change password for authenticated admin
// @route   POST /api/auth/change-password
// @access  Private/Admin
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  // Retrieve the full admin document (including password hash)
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Verify current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  // Validate new password rules
  if (newPassword.length < 8) {
    res.status(400);
    throw new Error('New password must be at least 8 characters');
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    res.status(400);
    throw new Error('New passwords do not match');
  }

  if (currentPassword === newPassword) {
    res.status(400);
    throw new Error('New password must be different from current password');
  }

  // Hash & save new password via pre('save') hook
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully. Please log in again.' });
});

// @desc    Send password reset email with secure token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Please enter your email address');
  }

  const genericResponse = {
    message: 'If an account exists for that email, a password reset link has been sent.',
  };

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  // Generic response to prevent account enumeration
  if (!user || user.role !== 'admin') {
    return res.json(genericResponse);
  }

  // Generate cryptographically secure random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Store hashed token and 30-minute expiration
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || req.get('origin') || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/admin/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      senderName: 'Portfolio Admin',
      subject: 'Reset your Admin Panel password',
      message: `You requested a password reset for your Admin Panel account.\n\nPlease open the following link to reset your password:\n${resetUrl}\n\nThis link is valid for 30 minutes. If you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background-color: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid #334155;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #38bdf8; margin: 0; font-size: 24px; font-weight: 800;">Admin Console</h2>
            <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">Password Reset Request</p>
          </div>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Hello,</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">You requested a password reset for your portfolio Admin Panel account.</p>
          <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Click the button below to set a new password. This link is valid for <strong>30 minutes</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #38bdf8; color: #0f172a; padding: 14px 28px; text-decoration: none; font-weight: 700; border-radius: 12px; display: inline-block; box-shadow: 0 4px 14px rgba(56, 189, 248, 0.3);">Reset Password</a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5; word-break: break-all;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${resetUrl}" style="color: #38bdf8;">${resetUrl}</a></p>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">
            <p style="margin: 0;">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('Password reset email failed:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV MODE] Password reset link for ${user.email}: ${resetUrl}`);
    }
  }

  res.json(genericResponse);
});

// @desc    Reset password using valid reset token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token || req.body.token;
  const { password, confirmPassword } = req.body;

  if (!token) {
    res.status(400);
    throw new Error('Reset token is required');
  }

  if (!password || password.length < 8) {
    res.status(400);
    throw new Error('Password must be at least 8 characters');
  }

  if (confirmPassword && password !== confirmPassword) {
    res.status(400);
    throw new Error('Passwords do not match');
  }

  // Hash incoming token to match stored SHA-256 hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Verify token exists and has not expired
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Reset link is invalid or has expired');
  }

  // Set new password & clear/invalidate token so it cannot be reused
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successfully. Please log in with your new password.' });
});

module.exports = {
  authUser,
  getUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
