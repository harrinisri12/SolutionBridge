/**
 * Standardized API Response Utilities for SolutionBridge
 */

export class ApiResponse {
  /**
   * Send a successful JSON response
   * @param {import('express').Response} res
   * @param {any} data - Result payload
   * @param {string} message - Human-readable success message
   * @param {number} statusCode - HTTP status (200, 201)
   */
  static success(res, data = {}, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Send an error JSON response
   * @param {import('express').Response} res
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP error code (400, 401, 403, 404, 409, 422, 500)
   * @param {string|null} errorCode - Machine-readable error code
   * @param {any} details - Additional validation error details
   */
  static error(res, message = 'An error occurred', statusCode = 500, errorCode = 'SERVER_ERROR', details = null) {
    const payload = {
      success: false,
      message,
      error: errorCode
    };

    if (details) {
      payload.details = details;
    }

    return res.status(statusCode).json(payload);
  }
}

export default ApiResponse;
