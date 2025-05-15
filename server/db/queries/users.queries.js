/**
 * SQL queries for the users table
 */

const findUserByEmail = 'SELECT * FROM users WHERE email = ?';
const findUserByUsername = 'SELECT * FROM users WHERE username = ?';
const findUserById = 'SELECT * FROM users WHERE id = ?';
const createUser = 'INSERT INTO users (username, name, email, password_hash) VALUES (?, ?, ?, ?)';
const updateUserProfile = 'UPDATE users SET name = ?, avatar = ? WHERE id = ?';
const updateUserPassword = 'UPDATE users SET password_hash = ? WHERE id = ?';
const deleteUser = 'DELETE FROM users WHERE id = ?';

module.exports = {
  findUserByEmail,
  findUserByUsername,
  findUserById,
  createUser,
  updateUserProfile,
  updateUserPassword,
  deleteUser
};