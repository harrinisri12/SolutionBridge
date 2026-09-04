/**
 * Lightweight Safe Logger for SolutionBridge Backend
 * Automatically redacts sensitive fields like passwords, authorization tokens, and API keys.
 */

const SENSITIVE_KEYS = ['password', 'authorization', 'token', 'secret', 'service_role_key'];

const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(sanitizeData);

  const clean = {};
  for (const [key, val] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some((k) => key.toLowerCase().includes(k))) {
      clean[key] = '[REDACTED]';
    } else if (typeof val === 'object') {
      clean[key] = sanitizeData(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
};

export const logger = {
  info: (message, meta = null) => {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.log(`[${timestamp}] [INFO] ${message}`, sanitizeData(meta));
    } else {
      console.log(`[${timestamp}] [INFO] ${message}`);
    }
  },

  warn: (message, meta = null) => {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.warn(`[${timestamp}] [WARN] ${message}`, sanitizeData(meta));
    } else {
      console.warn(`[${timestamp}] [WARN] ${message}`);
    }
  },

  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    if (error) {
      console.error(`[${timestamp}] [ERROR] ${message}`, error?.message || error);
    } else {
      console.error(`[${timestamp}] [ERROR] ${message}`);
    }
  }
};

export default logger;
