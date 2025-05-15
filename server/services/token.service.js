const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const config = require('../config/app');
const sessionQueries = require('../db/queries/sessions.queries');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name
  };
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

/**
 * Save a token to the database
 * @param {number} userId - User ID
 * @param {string} token - JWT token
 * @returns {Promise<Object>} Session record
 */
const saveToken = async (userId, token) => {
  // Calculate expiry date
  const jwtPayload = jwt.decode(token);
  const expiresAt = new Date(jwtPayload.exp * 1000); // Convert from seconds to milliseconds
  
  // Save token to database
  const [result] = await pool.execute(
    sessionQueries.createSession,
    [userId, token, expiresAt]
  );
  
  return {
    id: result.insertId,
    userId,
    token,
    expiresAt
  };
};

/**
 * Verify a token is valid
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return null;
  }
};

/**
 * Remove a token from the database
 * @param {string} token - JWT token
 * @returns {Promise<boolean>} Success
 */
const removeToken = async (token) => {
  const [result] = await pool.execute(sessionQueries.deleteSession, [token]);
  return result.affectedRows > 0;
};

/**
 * Clean up expired tokens
 * @returns {Promise<number>} Number of tokens removed
 */
const cleanupExpiredTokens = async () => {
  const [result] = await pool.execute(sessionQueries.deleteExpiredSessions);
  return result.affectedRows;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  removeToken,
  cleanupExpiredTokens
}; 