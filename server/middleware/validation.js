import { ApiResponse } from '../utils/response.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Request Validation Helper Middleware
 * Validates request parameters and bodies against defined validation rules.
 */
export const validate = (rules) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, constraints] of Object.entries(rules)) {
      // Determine value from body or params or query
      const source = constraints.in === 'params' ? req.params : constraints.in === 'query' ? req.query : req.body;
      const value = source ? source[field] : undefined;

      // 1. Required check
      if (constraints.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }

      // If optional and not provided, skip further checks
      if (value === undefined || value === null || value === '') {
        continue;
      }

      // 2. Type checks
      if (constraints.type === 'uuid' && !UUID_REGEX.test(value)) {
        errors.push({ field, message: `${field} must be a valid UUID` });
      }

      if (constraints.type === 'email' && !EMAIL_REGEX.test(value)) {
        errors.push({ field, message: `${field} must be a valid email address` });
      }

      if (constraints.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push({ field, message: `${field} must be a valid number` });
        } else {
          if (constraints.min !== undefined && num < constraints.min) {
            errors.push({ field, message: `${field} must be at least ${constraints.min}` });
          }
          if (constraints.max !== undefined && num > constraints.max) {
            errors.push({ field, message: `${field} cannot exceed ${constraints.max}` });
          }
        }
      }

      if (constraints.type === 'string') {
        if (typeof value !== 'string') {
          errors.push({ field, message: `${field} must be a string` });
        } else {
          if (constraints.minLength && value.length < constraints.minLength) {
            errors.push({ field, message: `${field} must be at least ${constraints.minLength} characters` });
          }
        }
      }

      // 3. Enum check
      if (constraints.enum && !constraints.enum.includes(value)) {
        errors.push({
          field,
          message: `${field} must be one of: ${constraints.enum.join(', ')}`
        });
      }
    }

    if (errors.length > 0) {
      return ApiResponse.error(
        res,
        'Validation failed for incoming request data',
        422,
        'VALIDATION_ERROR',
        errors
      );
    }

    next();
  };
};

export default validate;
