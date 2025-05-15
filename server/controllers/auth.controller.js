const bcrypt = require('bcrypt');
const { pool } = require('../config/database');
const userQueries = require('../db/queries/users.queries');
const tokenService = require('../services/token.service');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/email');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, username, email, password } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password) {
      console.log('Missing required fields:', { name, username, email, password: !!password });
      return res.status(400).json({
        message: 'All fields are required',
        errors: {
          name: !name ? 'Name is required' : undefined,
          username: !username ? 'Username is required' : undefined,
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined
        }
      });
    }

    console.log('Checking if email already exists:', email);
    // Check if email already exists
    const [existingEmailUsers] = await pool.execute(userQueries.findUserByEmail, [email]);
    if (existingEmailUsers.length > 0) {
      console.log('Email already exists:', email);
      return res.status(400).json({
        message: 'Email already in use',
        errors: { email: 'Email already in use' }
      });
    }

    console.log('Checking if username already exists:', username);
    // Check if username already exists
    const [existingUsernameUsers] = await pool.execute(userQueries.findUserByUsername, [username]);
    if (existingUsernameUsers.length > 0) {
      console.log('Username already exists:', username);
      return res.status(400).json({
        message: 'Username already taken',
        errors: { username: 'Username already taken' }
      });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Password hashed successfully');

    // Start transaction
    console.log('Starting database transaction...');
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      console.log('Transaction started');

      // Create user
      console.log('Creating user with query:', userQueries.createUser);
      console.log('Parameters:', [username, name, email, hashedPassword]);
      const [result] = await connection.execute(
        userQueries.createUser,
        [username, name, email, hashedPassword]
      );

      const userId = result.insertId;
      console.log('User created successfully with ID:', userId);

      // User created successfully

      console.log('Committing transaction...');
      await connection.commit();
      console.log('Transaction committed successfully');

      // Prepare user object (without password)
      const user = {
        id: userId,
        username,
        name,
        email
      };

      // Generate access token
      const accessToken = tokenService.generateToken(user);

      // Set user ID in cookie
      console.log(`Setting userId cookie with value: ${userId}`);

      // Basic approach
      res.cookie('userId', userId);

      // More specific approach
      res.cookie('userId', userId, {
        httpOnly: true,
        secure: false, // Set to false for development
        path: '/',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      // Return user data with access token
      res.status(201).json({
        user,
        accessToken
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Registration error:', error);

    // Provide more detailed error messages
    if (error.code === 'ER_DUP_ENTRY') {
      // MySQL duplicate entry error
      if (error.message.includes('email')) {
        return res.status(409).json({
          message: 'Email already in use',
          errors: { email: 'Email already in use' }
        });
      } else if (error.message.includes('username')) {
        return res.status(409).json({
          message: 'Username already taken',
          errors: { username: 'Username already taken' }
        });
      }
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({
        message: 'Database table not found. Please run migrations.',
        error: error.message
      });
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({
        message: 'Database schema mismatch. Please check column names.',
        error: error.message
      });
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ECONNREFUSED') {
      return res.status(500).json({
        message: 'Database connection error. Please check database credentials.',
        error: error.message
      });
    }

    // Generic error
    res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    console.log('Login request received:');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    const { email, password } = req.body;

    // Find user by email
    const [users] = await pool.execute(userQueries.findUserByEmail, [email]);
    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials',
        errors: { email: 'Email not found' }
      });
    }

    const user = users[0];

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid credentials',
        errors: { password: 'Invalid password' }
      });
    }

    // Prepare user object (without password)
    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Generate access token
    const accessToken = tokenService.generateToken(userData);

    // Set user ID in cookie
    console.log(`Setting userId cookie with value: ${user.id}`);

    // Basic approach
    res.cookie('userId', user.id);

    // More specific approach
    res.cookie('userId', user.id, {
      httpOnly: true,
      secure: false, // Set to false for development
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return user data with access token
    res.json({
      user: userData,
      accessToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    // Log all cookies for debugging
    console.log('All cookies:', req.cookies);

    // Get user ID from cookie
    const userId = req.cookies.userId;
    console.log(`Attempting to logout user. Cookie userId: ${userId}`);

    // Clear the userId cookie - try multiple approaches to ensure it works
    res.clearCookie('userId');

    // Also try with specific options
    res.clearCookie('userId', {
      path: '/'
    });

    // Try with more specific options
    res.clearCookie('userId', {
      httpOnly: true,
      secure: false,
      path: '/'
    });

    // Log the response headers for debugging
    console.log('Response headers:', res.getHeaders());

    // Return success response
    res.status(200).json({
      message: 'Logged out successfully',
      cookieCleared: true
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

// Refresh token functionality removed as per requirements

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
const getMe = async (req, res) => {
  try {
    // User is attached to request by auth middleware
    const user = req.user;

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Request password reset
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:');
    console.log('Request URL:', req.originalUrl);
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user by email
    const [users] = await pool.execute(userQueries.findUserByEmail, [email]);

    // Don't reveal if user exists or not for security reasons
    if (users.length === 0) {
      return res.status(200).json({
        message: 'If a user with that email exists, a password reset link has been sent'
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiry (1 hour)
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    // Save reset token to database
    await pool.execute(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetTokenHash, resetTokenExpiry, user.id]
    );

    // Create reset URL - using the client URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password`;

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken, resetUrl);

    res.status(200).json({
      message: 'Password reset link sent to email address'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

/**
 * Verify reset token
 * @route POST /api/auth/reset-password/verify
 */
const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Hash token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [resetTokenHash]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    res.status(200).json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ message: 'Server error during token verification' });
  }
};

/**
 * Reset password
 * @route POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    // Hash token
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
      [resetTokenHash]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = users[0];

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user password and clear reset token
    await pool.execute(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  verifyResetToken,
  resetPassword
};