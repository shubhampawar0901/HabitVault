const validator = require('validator');

/**
 * Validation middleware factory
 * @param {Function} validationFn - Validation function
 * @returns {Function} Express middleware
 */
const validate = (validationFn) => {
  return (req, res, next) => {
    console.log('Validation middleware: Validating request body:', {
      ...req.body,
      password: req.body.password ? '[REDACTED]' : undefined
    });

    const { errors, isValid } = validationFn(req.body);

    console.log('Validation result:', { isValid, errors });

    if (!isValid) {
      console.log('Validation failed, returning 400 response');
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    console.log('Validation passed, proceeding to next middleware');
    next();
  };
};

/**
 * Validate registration input
 */
const validateRegisterInput = (data) => {
  const errors = {};

  // Sanitize and validate name
  data.name = !data.name ? '' : data.name.trim();
  if (validator.isEmpty(data.name)) {
    errors.name = 'Name is required';
  }

  // Sanitize and validate username
  data.username = !data.username ? '' : data.username.trim();
  if (validator.isEmpty(data.username)) {
    errors.username = 'Username is required';
  } else if (!validator.isAlphanumeric(data.username)) {
    errors.username = 'Username must contain only letters and numbers';
  } else if (!validator.isLength(data.username, { min: 3, max: 30 })) {
    errors.username = 'Username must be between 3 and 30 characters';
  }

  // Sanitize and validate email
  data.email = !data.email ? '' : data.email.trim();
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Sanitize and validate password
  data.password = !data.password ? '' : data.password;
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  } else if (!validator.isLength(data.password, { min: 8, max: 30 })) {
    errors.password = 'Password must be between 8 and 30 characters';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

/**
 * Validate login input
 */
const validateLoginInput = (data) => {
  const errors = {};

  // Sanitize and validate email
  data.email = !data.email ? '' : data.email.trim();
  if (validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  // Sanitize and validate password
  data.password = !data.password ? '' : data.password;
  if (validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = {
  validate,
  validateRegisterInput,
  validateLoginInput
};