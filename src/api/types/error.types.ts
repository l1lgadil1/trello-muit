/**
 * Base API error class
 */
export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Network connection error
 */
export class NetworkError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error for invalid data
 */
export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error
 */
export class AuthError extends ApiError {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
} 