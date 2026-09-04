import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { storageService } from '../services/storageService.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { logger } from '../utils/logger.js';

/**
 * Upload Pilot Evidence document/data (Startup Only)
 * POST /api/pilots/:pilotId/evidence
 */
export const uploadEvidence = async (req, res) => {
  try {
    const { pilotId } = req.params;
    const userId = req.user.id;
    const { milestone_id, file_name, file_url, evidence_type, description } = req.body;
    const file = req.file; // From multer if direct file upload

    // 1. Verify pilot ownership
    const { data: pilot, error: pilotError } = await supabaseAdmin
      .from('pilots')
      .select('id, startup_id, startups(profile_id, name), challenges(title)')
      .eq('id', pilotId)
      .single();

    if (pilotError || !pilot) {
      return ApiResponse.error(res, 'Pilot not found', 404, 'NOT_FOUND');
    }

    if (req.user.role === 'startup' && pilot.startups?.profile_id !== userId) {
      return ApiResponse.error(res, 'You do not have permission to upload evidence for this pilot', 403, 'FORBIDDEN');
    }

    let finalFileUrl = file_url || '';
    const finalFileName = file?.originalname || file_name || 'evidence_document.pdf';

    // 2. Upload file buffer to Supabase Storage if file is present
    if (file) {
      const storagePath = `${pilotId}/${Date.now()}_${finalFileName.replace(/\s+/g, '_')}`;
      await storageService.uploadFile(
        storageService.BUCKET_EVIDENCE,
        storagePath,
        file.buffer,
        file.mimetype || 'application/octet-stream'
      );
      finalFileUrl = storagePath;
    }

    // 3. Create evidence record in 'pilot_evidence'
    const { data: evidence, error: evidenceError } = await supabaseAdmin
      .from('pilot_evidence')
      .insert([
        {
          pilot_id: pilotId,
          milestone_id: milestone_id || null,
          uploaded_by: userId,
          file_name: finalFileName,
          file_url: finalFileUrl,
          evidence_type: evidence_type || 'Test Report',
          description: description || null,
          verification_status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (evidenceError) {
      logger.error('Error creating pilot evidence record', evidenceError);
      return ApiResponse.error(res, 'Failed to save evidence record', 500, 'SERVER_ERROR');
    }

    // 4. Audit Log
    await logAudit({
      userId,
      action: AuditActions.EVIDENCE_UPLOADED,
      entityType: 'pilot_evidence',
      entityId: evidence.id,
      description: `Uploaded evidence '${finalFileName}' for pilot '${pilot.challenges?.title}'`
    });

    // 5. Notify Government & Assigned Experts
    await createNotification({
      role: 'government',
      title: 'New Pilot Evidence Uploaded',
      message: `${pilot.startups?.name} uploaded evidence '${finalFileName}' for review.`,
      type: 'info'
    });

    return ApiResponse.success(res, { evidence }, 'Evidence uploaded successfully for verification', 201);
  } catch (error) {
    logger.error('Error in uploadEvidence controller', error);
    return ApiResponse.error(res, 'Failed to upload evidence', 500, 'SERVER_ERROR');
  }
};

/**
 * List evidence files for a pilot with signed URLs
 * GET /api/pilots/:pilotId/evidence
 */
export const listPilotEvidence = async (req, res) => {
  try {
    const { pilotId } = req.params;

    const { data: evidenceList, error } = await supabaseAdmin
      .from('pilot_evidence')
      .select('*, profiles(full_name, email)')
      .eq('pilot_id', pilotId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching pilot evidence', error);
      return ApiResponse.error(res, 'Failed to fetch evidence list', 500, 'SERVER_ERROR');
    }

    // Generate signed download URLs for private files
    const enriched = await Promise.all(
      (evidenceList || []).map(async (ev) => {
        let signedUrl = ev.file_url;
        if (ev.file_url && !ev.file_url.startsWith('http')) {
          try {
            signedUrl = await storageService.getSignedUrl(storageService.BUCKET_EVIDENCE, ev.file_url);
          } catch {
            signedUrl = ev.file_url;
          }
        }
        return {
          ...ev,
          downloadUrl: signedUrl
        };
      })
    );

    return ApiResponse.success(res, { evidence: enriched }, 'Pilot evidence files retrieved');
  } catch (error) {
    logger.error('Error in listPilotEvidence controller', error);
    return ApiResponse.error(res, 'Failed to retrieve evidence', 500, 'SERVER_ERROR');
  }
};

/**
 * Verify / Reject evidence (Government or Assigned Expert Only)
 * PATCH /api/evidence/:id/verify
 */
export const verifyEvidence = async (req, res) => {
  try {
    const { id } = req.params;
    const { status = 'verified', verification_comments } = req.body;

    const validStatuses = ['pending', 'verified', 'rejected'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return ApiResponse.error(res, `Status must be one of: ${validStatuses.join(', ')}`, 422, 'VALIDATION_ERROR');
    }

    const { data: evidence, error } = await supabaseAdmin
      .from('pilot_evidence')
      .update({
        verification_status: status.toLowerCase(),
        verification_comments: verification_comments || null,
        verified_by: req.user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, pilots(startup_id, startups(name, profile_id), challenges(title))')
      .single();

    if (error || !evidence) {
      return ApiResponse.error(res, 'Evidence record not found or update failed', 404, 'NOT_FOUND');
    }

    // Audit Log
    await logAudit({
      userId: req.user.id,
      action: AuditActions.EVIDENCE_VERIFIED,
      entityType: 'pilot_evidence',
      entityId: id,
      description: `Evidence '${evidence.file_name}' marked as '${status}' by ${req.user.email}`
    });

    // Notify Startup Founder
    if (evidence.pilots?.startups?.profile_id) {
      await createNotification({
        userId: evidence.pilots.startups.profile_id,
        role: 'startup',
        title: `Evidence ${status.toUpperCase()}`,
        message: `Your uploaded file '${evidence.file_name}' was marked as '${status}' by the verification team.`,
        type: status === 'verified' ? 'success' : 'warning'
      });
    }

    return ApiResponse.success(res, { evidence }, `Evidence marked as ${status}`);
  } catch (error) {
    logger.error('Error in verifyEvidence controller', error);
    return ApiResponse.error(res, 'Failed to verify evidence', 500, 'SERVER_ERROR');
  }
};

export default {
  uploadEvidence,
  listPilotEvidence,
  verifyEvidence
};
