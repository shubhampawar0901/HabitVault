const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

class AuthService {
  static generateAccessToken(user) {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Short-lived access token
    );
  }

  // Refresh token functionality removed

  static async register(userData) {
    const { username, email, password } = userData;

    // Check if user already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      throw new Error('Email already in use');
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Create new user
    const userId = await User.create({ username, email, password });
    const user = await User.findById(userId);

    // Generate access token
    const accessToken = this.generateAccessToken(user);

    return {
      user,
      accessToken
    };
  }

  static async login(email, password) {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await User.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate access token
    const accessToken = this.generateAccessToken(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken
    };
  }

  // Refresh token functionality removed

  static async logout() {
    // No refresh token to revoke
    return true;
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = AuthService;
