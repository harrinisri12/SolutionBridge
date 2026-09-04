import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { ApiResponse } from '../utils/response.js';

const router = Router();

router.get('/', async (req, res) => {
  let dbStatus = 'connected';

  try {
    const { error } = await supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      console.log('SUPABASE HEALTH ERROR:', error);
      dbStatus = `degraded: ${error.message || error.code || 'Unknown Supabase error'}`;
    }
  } catch (err) {
    dbStatus = `offline: ${err.message}`;
  }

  return ApiResponse.success(
    res,
    {
      server: 'online',
      platform: 'SolutionBridge National Innovation Procurement Platform',
      version: '1.0.0',
      database: dbStatus,
      timestamp: new Date().toISOString()
    },
    'SolutionBridge API is running'
  );
});

export default router;
