const validator = require('validator');

/**
 * Validates an email address format.
 * Returns an error message string, or null if valid.
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'Email is required.';
  }
  const trimmed = email.trim();
  if (!validator.isEmail(trimmed)) {
    return 'Please provide a valid email address.';
  }
  if (trimmed.length > 254) {
    return 'Email address is too long.';
  }
  return null;
}

/**
 * Validates a password for signup.
 * Returns an error message string, or null if valid.
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'Password is required.';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (password.length > 128) {
    return 'Password must not exceed 128 characters.';
  }
  return null;
}

/**
 * Sanitizes a plain text string — trims and limits length.
 */
function sanitizeText(value, maxLength = 500) {
  if (!value || typeof value !== 'string') return '';
  return validator.escape(value.trim()).slice(0, maxLength);
}

/**
 * Validates a search query string.
 * Returns an error message string, or null if valid.
 */
function validateQuery(query) {
  if (!query || typeof query !== 'string') {
    return 'Search query is required.';
  }
  const trimmed = query.trim();
  if (trimmed.length === 0) {
    return 'Search query cannot be empty.';
  }
  if (trimmed.length > 1000) {
    return 'Search query is too long (max 1000 characters).';
  }
  return null;
}

module.exports = { validateEmail, validatePassword, sanitizeText, validateQuery };
