import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';
import { logAudit, AuditActions } from '../services/auditService.js';
import { createNotification } from '../services/notificationService.js';
import { storageService } from '../services/storageService.js';
import { logger } from '../utils/logger.js';

/**
 * Upload supporting document for startup application
 * POST /api/applications/upload-document
 */
export const uploadApplicationDocument = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    const { document_type = 'Technical Proposal' } = req.body;

    if (!file) {
      return ApiResponse.error(res, 'No file uploaded', 422, 'FILE_REQUIRED');
    }

    // 1. Verify startup profile
    let { data: startup } = await supabaseAdmin
      .from('startups')
      .select('id, name')
      .eq('user_id', userId)
      .maybeSingle();

    if (!startup) {
      return ApiResponse.error(res, 'Startup profile required to upload application documents', 403, 'STARTUP_REQUIRED');
    }

    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `applications/${startup.id}/${Date.now()}_${cleanFileName}`;

    const { success, error: uploadErr } = await storageService.uploadFile(
      storageService.BUCKET_STARTUP_DOCS,
      storagePath,
      file.buffer,
      file.mimetype || 'application/octet-stream'
    );

    if (!success || uploadErr) {
      logger.error('Error uploading document to Supabase storage', uploadErr);
      return ApiResponse.error(res, 'Failed to upload document to storage', 500, 'STORAGE_ERROR');
    }

    // Generate signed preview/download URL
    const { signedUrl } = await storageService.getSignedUrl(
      storageService.BUCKET_STARTUP_DOCS,
      storagePath,
      86400 // 24 hours
    );

    return ApiResponse.success(
      res,
      {
        file_name: file.originalname,
        file_url: storagePath,
        downloadUrl: signedUrl || storagePath,
        document_type,
        file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
      },
      'Document uploaded successfully',
      201
    );
  } catch (error) {
    logger.error('Error in uploadApplicationDocument controller', error);
    return ApiResponse.error(res, 'Failed to upload document', 500, 'SERVER_ERROR');
  }
};

/**
 * List applications based on user role and permissions
 * GET /api/applications
 */
export const listApplications = async (req, res) => {
  try {
    const user = req.user;
    const { challenge_id, status, dpiit_verified } = req.query;

    let query = supabaseAdmin
      .from('applications')
      .select('*, challenges(id, title, category, department_id, government_departments(name)), startups(id, name, dpiit_number, sector, verified), evaluations(*)')
      .order('created_at', { ascending: false });

    // Role-based scoping
    if (user.role === 'startup') {
      // Find startup record owned by user
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!startup) {
        return ApiResponse.success(res, { applications: [] }, 'No startup profile found');
      }

      query = query.eq('startup_id', startup.id);
    } else if (user.role === 'expert') {
      // Find applications assigned to this expert
      const { data: expert } = await supabaseAdmin
        .from('experts')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!expert) {
        return ApiResponse.success(res, { applications: [] }, 'No expert profile found');
      }

      const { data: assignments } = await supabaseAdmin
        .from('expert_assignments')
        .select('application_id')
        .eq('expert_id', expert.id);

      const assignedAppIds = (assignments || []).map((a) => a.application_id);

      if (assignedAppIds.length === 0) {
        return ApiResponse.success(res, { applications: [] }, 'No assigned applications');
      }

      query = query.in('id', assignedAppIds);
    }

    if (challenge_id) {
      query = query.eq('challenge_id', challenge_id);
    }
    if (status) {
      query = query.eq('status', status.toLowerCase());
    }
    if (dpiit_verified !== undefined) {
      query = query.eq('dpiit_verified', dpiit_verified === 'true');
    }

    const { data: applications, error } = await query;

    if (error) {
      logger.error('Error fetching applications', error);
      return ApiResponse.error(res, 'Failed to fetch applications', 500, 'SERVER_ERROR');
    }

    // Enrich with application_details, application_documents, and expert_assignments if accessible
    let enriched = applications || [];
    try {
      const appIds = enriched.map((a) => a.id);
      if (appIds.length > 0) {
        const [{ data: detailsList }, { data: docsList }, { data: assignList }] = await Promise.all([
          supabaseAdmin.from('application_details').select('*').in('application_id', appIds),
          supabaseAdmin.from('application_documents').select('*').in('application_id', appIds),
          supabaseAdmin.from('expert_assignments').select('*, experts(id, expertise, organization, profiles(full_name, email))').in('application_id', appIds)
        ]);

        const detailsMap = new Map((detailsList || []).map((d) => [d.application_id, d]));
        const docsMap = new Map();
        (docsList || []).forEach((doc) => {
          if (!docsMap.has(doc.application_id)) docsMap.set(doc.application_id, []);
          docsMap.get(doc.application_id).push(doc);
        });

        const assignMap = new Map();
        (assignList || []).forEach((asg) => {
          if (!assignMap.has(asg.application_id)) assignMap.set(asg.application_id, []);
          assignMap.get(asg.application_id).push(asg);
        });

        enriched = enriched.map((a) => ({
          ...a,
          details: detailsMap.get(a.id) || null,
          documents: docsMap.get(a.id) || [],
          expert_assignments: assignMap.get(a.id) || []
        }));
      }
    } catch (enrichErr) {
      logger.warn('Could not enrich applications with details/documents/assignments', enrichErr);
    }

    return ApiResponse.success(res, { applications: enriched }, 'Applications retrieved successfully');
  } catch (error) {
    logger.error('Error in listApplications controller', error);
    return ApiResponse.error(res, 'Failed to retrieve applications', 500, 'SERVER_ERROR');
  }
};

/**
 * Get applications for a specific challenge (Government / Evaluator)
 * GET /api/challenges/:challengeId/applications
 */
export const getApplicationsByChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const { data: applications, error } = await supabaseAdmin
      .from('applications')
      .select('*, startups(*), evaluations(*)')
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching challenge applications', error);
      return ApiResponse.error(res, 'Failed to fetch challenge applications', 500, 'SERVER_ERROR');
    }

    return ApiResponse.success(res, { applications: applications || [] }, 'Challenge applications retrieved');
  } catch (error) {
    logger.error('Error in getApplicationsByChallenge controller', error);
    return ApiResponse.error(res, 'Failed to fetch applications', 500, 'SERVER_ERROR');
  }
};

/**
 * Get application details by ID
 * GET /api/applications/:id
 */
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select('*, challenges(*, government_departments(name)), startups(*, profiles(full_name, email, phone)), evaluations(*, experts(id, expertise, organization, profiles(full_name, email)))')
      .eq('id', id)
      .single();

    if (error || !application) {
      return ApiResponse.error(res, 'Application not found', 404, 'NOT_FOUND');
    }

    // Authorization check for startup
    if (user.role === 'startup') {
      const { data: startup } = await supabaseAdmin
        .from('startups')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!startup || startup.id !== application.startup_id) {
        return ApiResponse.error(res, 'Access forbidden to this proposal', 403, 'FORBIDDEN');
      }
    }

    // Fetch details, documents & assignments
    let details = null;
    let documents = [];
    let expertAssignments = [];

    try {
      const { data: det } = await supabaseAdmin
        .from('application_details')
        .select('*')
        .eq('application_id', id)
        .maybeSingle();
      details = det;
    } catch (e) {
      logger.warn('Failed to fetch application_details', e);
    }

    try {
      const { data: asgs } = await supabaseAdmin
        .from('expert_assignments')
        .select('*, experts(id, expertise, organization, profiles(full_name, email))')
        .eq('application_id', id);
      expertAssignments = asgs || [];
    } catch (e) {
      logger.warn('Failed to fetch expert_assignments', e);
    }

    try {
      const { data: docs } = await supabaseAdmin
        .from('application_documents')
        .select('*')
        .eq('application_id', id)
        .order('created_at', { ascending: true });

      if (Array.isArray(docs)) {
        documents = await Promise.all(
          docs.map(async (d) => {
            let downloadUrl = d.file_url;
            if (d.file_url && !d.file_url.startsWith('http')) {
              try {
                const { signedUrl } = await storageService.getSignedUrl(
                  storageService.BUCKET_STARTUP_DOCS,
                  d.file_url,
                  86400
                );
                if (signedUrl) downloadUrl = signedUrl;
              } catch {}
            }
            return {
              ...d,
              downloadUrl
            };
          })
        );
      }
    } catch (e) {
      logger.warn('Failed to fetch application_documents', e);
    }

    return ApiResponse.success(
      res,
      {
        application: {
          ...application,
          details,
          documents,
          expert_assignments: expertAssignments
        }
      },
      'Application details retrieved'
    );
  } catch (error) {
    logger.error('Error in getApplicationById controller', error);
    return ApiResponse.error(res, 'Failed to retrieve application', 500, 'SERVER_ERROR');
  }
};

/**
 * Submit a proposal application (Startup Only)
 * POST /api/applications
 */
export const submitApplication = async (req, res) => {
  let createdAppId = null;
  try {
    const userId = req.user.id;
    const {
      challenge_id,
      proposal,
      technical_solution,
      estimated_cost,
      details = {},
      documents = []
    } = req.body;

    if (!challenge_id) {
      return ApiResponse.error(res, 'Challenge ID is required', 422, 'VALIDATION_ERROR');
    }

    const proposalSummary = proposal || details?.proposal || '';
    if (!proposalSummary || !proposalSummary.trim()) {
      return ApiResponse.error(res, 'Executive summary / proposal is required', 422, 'VALIDATION_ERROR');
    }

    // 1. Verify startup ownership
    let { data: startup, error: startupError } = await supabaseAdmin
      .from('startups')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!startup) {
      // Auto-create startup record if user registered as startup role
      const { data: userProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (userProfile && userProfile.role === 'startup') {
        const { data: createdStartup } = await supabaseAdmin
          .from('startups')
          .insert([
            {
              user_id: userId,
              name: userProfile.organization || userProfile.full_name || 'My Startup',
              dpiit_number: 'DPIIT' + Math.floor(100000 + Math.random() * 900000),
              sector: 'Technology',
              verified: false,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();
        startup = createdStartup;
      }
    }

    if (!startup) {
      return ApiResponse.error(res, 'You must register a startup profile before applying to challenges', 403, 'STARTUP_REQUIRED');
    }

    // 2. Verify challenge exists and is open
    const { data: challenge, error: challengeError } = await supabaseAdmin
      .from('challenges')
      .select('id, title, status, department_id')
      .eq('id', challenge_id)
      .single();

    if (challengeError || !challenge) {
      return ApiResponse.error(res, 'Challenge not found', 404, 'NOT_FOUND');
    }

    if (challenge.status !== 'published') {
      return ApiResponse.error(res, 'This challenge is closed or in draft status and not accepting proposals', 400, 'CHALLENGE_NOT_OPEN');
    }

    // 3. Prevent duplicate application
    const { data: existingApp } = await supabaseAdmin
      .from('applications')
      .select('id')
      .eq('challenge_id', challenge_id)
      .eq('startup_id', startup.id)
      .maybeSingle();

    if (existingApp) {
      return ApiResponse.error(res, 'You have already submitted an application for this challenge.', 409, 'ALREADY_APPLIED');
    }

    // Format estimated cost as numeric
    const rawCost = estimated_cost !== undefined ? estimated_cost : details?.estimated_cost;
    const numericCost = Number(String(rawCost || '0').replace(/[^0-9.-]+/g, '')) || 0;

    const fullTechSolution = (technical_solution || details?.technical_solution || details?.technology_used || proposalSummary).trim();

    // 4. Insert into applications table
    const { data: newApp, error: appError } = await supabaseAdmin
      .from('applications')
      .insert([
        {
          challenge_id,
          startup_id: startup.id,
          proposal: proposalSummary.trim(),
          technical_solution: fullTechSolution,
          estimated_cost: numericCost,
          dpiit_verified: Boolean(startup.verified),
          status: 'under_review',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select('*, challenges(id, title, department_id, government_departments(name)), startups(id, name, dpiit_number, sector, verified)')
      .single();

    if (appError || !newApp) {
      logger.error('Error inserting application', appError);
      return ApiResponse.error(res, 'Failed to submit application', 500, 'SERVER_ERROR');
    }

    createdAppId = newApp.id;

    // 5. Insert into application_details table
    let savedDetails = null;
    try {
      const detailsRow = {
        application_id: newApp.id,
        solution_title: (details.solution_title || details.solutionTitle || newApp.challenges?.title || 'Proposed Innovation Solution').trim(),
        problem_understanding: (details.problem_understanding || details.problemUnderstanding || '').trim(),
        technology_used: (details.technology_used || details.technologyUsed || details.proposedTechnology || '').trim(),
        innovation_usp: (details.innovation_usp || details.innovationUsp || '').trim(),
        expected_outcome: (details.expected_outcome || details.expectedOutcome || details.expectedImpact || '').trim(),
        implementation_plan: (details.implementation_plan || details.implementationPlan || '').trim(),
        implementation_timeline: (details.implementation_timeline || details.implementationTimeline || '').trim(),
        infrastructure_requirements: (details.infrastructure_requirements || details.infrastructureRequirements || '').trim(),
        team_resources: (details.team_resources || details.teamResources || (Array.isArray(details.team) ? JSON.stringify(details.team) : '')).trim(),
        cost_breakdown: (details.cost_breakdown || details.costBreakdown || (Array.isArray(details.costProposal) ? JSON.stringify(details.costProposal) : '')).trim(),
        maintenance_cost: Number(details.maintenance_cost || details.maintenanceCost || 0) || 0,
        pilot_duration_days: parseInt(details.pilot_duration_days || details.pilotDurationDays || 180, 10) || 180,
        kpis: (details.kpis || '').trim(),
        previous_experience: (details.previous_experience || details.previousExperience || details.experience || '').trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: detData, error: detErr } = await supabaseAdmin
        .from('application_details')
        .insert([detailsRow])
        .select()
        .single();

      if (detErr) {
        logger.warn('Warning inserting application_details', detErr);
      } else {
        savedDetails = detData;
      }
    } catch (detException) {
      logger.warn('Exception during application_details insertion', detException);
    }

    // 6. Insert into application_documents table if documents provided
    let savedDocuments = [];
    if (Array.isArray(documents) && documents.length > 0) {
      try {
        const docRows = documents.map((doc) => ({
          application_id: newApp.id,
          file_name: doc.file_name || doc.name || 'document.pdf',
          file_url: doc.file_url || doc.url || '',
          document_type: doc.document_type || doc.type || 'Technical Proposal',
          created_at: new Date().toISOString()
        }));

        const { data: docData, error: docErr } = await supabaseAdmin
          .from('application_documents')
          .insert(docRows)
          .select();

        if (docErr) {
          logger.warn('Warning inserting application_documents', docErr);
        } else {
          savedDocuments = docData || [];
        }
      } catch (docException) {
        logger.warn('Exception during application_documents insertion', docException);
      }
    }

    // 7. Audit Log
    await logAudit({
      userId,
      action: AuditActions.APPLICATION_SUBMITTED,
      entityType: 'application',
      entityId: newApp.id,
      description: `Startup '${startup.name}' submitted proposal for '${challenge.title}'`
    });

    // 8. Notify Government Officers
    await createNotification({
      role: 'government',
      title: 'New Application Received',
      message: `${startup.name} submitted a proposal for '${challenge.title}'.`,
      type: 'info'
    });

    return ApiResponse.success(
      res,
      {
        application: {
          ...newApp,
          details: savedDetails,
          documents: savedDocuments
        }
      },
      'Application submitted successfully',
      201
    );
  } catch (error) {
    logger.error('Error in submitApplication controller', error);

    // Rollback if application row was created but uncaught error occurred
    if (createdAppId) {
      try {
        await supabaseAdmin.from('applications').delete().eq('id', createdAppId);
      } catch (cleanupErr) {
        logger.error('Error rolling back application creation', cleanupErr);
      }
    }

    return ApiResponse.error(res, 'Failed to submit application. Please try again.', 500, 'SERVER_ERROR');
  }
};

/**
 * Update application status & recommendation (Government Only)
 * PATCH /api/applications/:id/status
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['under_review', 'shortlisted', 'selected', 'rejected'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return ApiResponse.error(
        res,
        `Status must be one of: ${validStatuses.join(', ')}`,
        422,
        'VALIDATION_ERROR'
      );
    }

    const normalizedStatus = status.toLowerCase();

    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .update({
        status: normalizedStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, challenges(title), startups(name, user_id)')
      .single();

    if (error || !application) {
      logger.error('Error updating application status', error);
      return ApiResponse.error(res, 'Failed to update application status', 500, 'SERVER_ERROR');
    }

    // Audit Log
    await logAudit({
      userId: req.user.id,
      action: AuditActions.APPLICATION_STATUS_UPDATED,
      entityType: 'application',
      entityId: id,
      description: `Proposal by ${application.startups?.name} marked as '${normalizedStatus}' by ${req.user.email}`
    });

    // Notify Startup
    if (application.startups?.user_id) {
      await createNotification({
        userId: application.startups.user_id,
        role: 'startup',
        title: `Proposal Status: ${normalizedStatus.toUpperCase()}`,
        message: `Your application for '${application.challenges?.title}' has been moved to '${normalizedStatus}'.`,
        type: normalizedStatus === 'selected' ? 'success' : normalizedStatus === 'rejected' ? 'warning' : 'info'
      });
    }

    return ApiResponse.success(res, { application }, `Application status updated to ${normalizedStatus}`);
  } catch (error) {
    logger.error('Error in updateApplicationStatus controller', error);
    return ApiResponse.error(res, 'Failed to update application status', 500, 'SERVER_ERROR');
  }
};

export default {
  uploadApplicationDocument,
  listApplications,
  getApplicationsByChallenge,
  getApplicationById,
  submitApplication,
  updateApplicationStatus
};
