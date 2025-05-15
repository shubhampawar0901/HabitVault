/**
 * Format a log message with timestamp
 * @param {string} message - The message to log
 * @returns {string} - Formatted log message
 */
const formatLogMessage = (message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${message}`;
};

/**
 * Log API request details
 * @param {Object} req - Express request object
 */
const logRequest = (req) => {
  const { method, originalUrl, headers, body } = req;

  // Create log message
  let message = `\n----- API REQUEST -----\n`;
  message += `${method} ${originalUrl}\n`;
  message += `Headers: ${JSON.stringify(headers, null, 2)}\n`;

  // Don't log passwords in plain text
  const sanitizedBody = { ...body };
  if (sanitizedBody.password) {
    sanitizedBody.password = '[REDACTED]';
  }
  if (sanitizedBody.confirmPassword) {
    sanitizedBody.confirmPassword = '[REDACTED]';
  }

  message += `Body: ${JSON.stringify(sanitizedBody, null, 2)}\n`;

  // Log to console
  console.log(formatLogMessage(message));

  return message;
};

/**
 * Log API response details
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} duration - Request duration in ms
 */
const logResponse = (req, res, duration, responseBody) => {
  const { method, originalUrl } = req;
  const { statusCode } = res;

  // Create log message
  let message = `\n----- API RESPONSE -----\n`;
  message += `${method} ${originalUrl} - Status: ${statusCode} - ${duration}ms\n`;

  if (responseBody) {
    // Sanitize response body if it contains sensitive data
    const sanitizedResponse = { ...responseBody };
    if (sanitizedResponse.token) {
      sanitizedResponse.token = '[REDACTED]';
    }
    message += `Response: ${JSON.stringify(sanitizedResponse, null, 2)}\n`;
  }

  // Log to console
  console.log(formatLogMessage(message));

  return message;
};

/**
 * Log error details
 * @param {Error} error - Error object
 * @param {Object} req - Express request object (optional)
 */
const logError = (error, req = null) => {
  // Create log message
  let message = `\n----- ERROR -----\n`;

  if (req) {
    message += `${req.method} ${req.originalUrl}\n`;
  }

  message += `${error.stack || error.message || error}\n`;

  // Log to console
  console.error(formatLogMessage(message));

  return message;
};

module.exports = {
  logRequest,
  logResponse,
  logError
};
