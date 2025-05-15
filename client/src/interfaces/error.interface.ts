/**
 * Interface for API error responses
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string>;
  error?: string;
  statusCode?: number;
}

/**
 * Interface for field-specific validation errors
 */
export interface ValidationErrors {
  [field: string]: string;
}

/**
 * Interface for error state in forms
 */
export interface FormErrors {
  message?: string;
  fieldErrors?: ValidationErrors;
}
