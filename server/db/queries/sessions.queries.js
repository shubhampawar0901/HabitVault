/**
 * SQL queries for the sessions table
 */

const createSession = 'INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)';
const findSessionByToken = 'SELECT * FROM sessions WHERE token = ? AND expires_at > NOW()';
const deleteSession = 'DELETE FROM sessions WHERE token = ?';
const deleteUserSessions = 'DELETE FROM sessions WHERE user_id = ?';
const deleteExpiredSessions = 'DELETE FROM sessions WHERE expires_at <= NOW()';

module.exports = {
  createSession,
  findSessionByToken,
  deleteSession,
  deleteUserSessions,
  deleteExpiredSessions
}; 