/**
 * Application configuration
 */

const config = {
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d' // 30 days expiration
  },

  // CORS has been completely removed from the project

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Server port
  port: process.env.PORT || 3001
};

module.exports = config;