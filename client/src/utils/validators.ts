/**
 * Validate email format
 * @param email - Email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Boolean indicating if password is strong enough
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Check if passwords match
 * @param password - Password
 * @param confirmPassword - Confirmation password
 * @returns Boolean indicating if passwords match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validate required field
 * @param value - Field value
 * @returns Boolean indicating if field is not empty
 */
export const isRequired = (value: string): boolean => {
  return value.trim() !== '';
};

/**
 * Validate minimum length
 * @param value - Field value
 * @param minLength - Minimum length required
 * @returns Boolean indicating if field meets minimum length
 */
export const hasMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param value - Field value
 * @param maxLength - Maximum length allowed
 * @returns Boolean indicating if field is within maximum length
 */
export const hasMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};
