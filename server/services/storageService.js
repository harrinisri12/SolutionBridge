import { supabaseAdmin } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export const BUCKET_EVIDENCE = process.env.STORAGE_BUCKET_EVIDENCE || 'pilot-evidence';
export const BUCKET_PROCUREMENT = process.env.STORAGE_BUCKET_PROCUREMENT || 'procurement-documents';
export const BUCKET_STARTUP_DOCS = process.env.STORAGE_BUCKET_STARTUP_DOCS || 'startup-documents';

/**
 * Upload file to Supabase Storage Bucket
 * @param {string} bucket - 'pilot-evidence' | 'procurement-documents' | 'startup-documents'
 * @param {string} filePath - Storage destination path (e.g. pilot_id/filename)
 * @param {Buffer} fileBuffer - Binary file content
 * @param {string} contentType - MIME type (e.g. 'application/pdf')
 */
export const uploadFile = async (bucket, filePath, fileBuffer, contentType) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: true
      });

    if (error) {
      logger.error(`Storage upload error in bucket '${bucket}' at path '${filePath}'`, error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    logger.error('Unexpected error in storage uploadFile', err);
    return { success: false, error: err };
  }
};

/**
 * Generate a secure, time-limited signed URL for private document download
 * @param {string} bucket - Bucket name
 * @param {string} filePath - Path within bucket
 * @param {number} expiresIn - Expiry time in seconds (default: 3600 = 1 hour)
 */
export const getSignedUrl = async (bucket, filePath, expiresIn = 3600) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      logger.error(`Failed to generate signed URL for '${filePath}' in bucket '${bucket}'`, error);
      return { success: false, error };
    }

    return { success: true, signedUrl: data.signedUrl };
  } catch (err) {
    logger.error('Unexpected error in storage getSignedUrl', err);
    return { success: false, error: err };
  }
};

export const storageService = {
  uploadFile,
  getSignedUrl,
  BUCKET_EVIDENCE,
  BUCKET_PROCUREMENT,
  BUCKET_STARTUP_DOCS
};

export default storageService;
