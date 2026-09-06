import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();
// SolutionBridge Backend API Server

import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

// Route Imports
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import startupsRoutes from './routes/startups.routes.js';
import departmentsRoutes from './routes/departments.routes.js';
import challengesRoutes from './routes/challenges.routes.js';
import applicationsRoutes from './routes/applications.routes.js';
import evaluationsRoutes from './routes/evaluations.routes.js';
import assignmentsRoutes from './routes/assignments.routes.js';
import pilotsRoutes from './routes/pilots.routes.js';
import milestonesRoutes from './routes/milestones.routes.js';
import evidenceRoutes from './routes/evidence.routes.js';
import telemetryRoutes from './routes/telemetry.routes.js';
import validationsRoutes from './routes/validations.routes.js';
import procurementsRoutes from './routes/procurements.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import auditRoutes from './routes/audit.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Security & Core Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive in dev mode for flexibility
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing with safe size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
}

// 2. API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/startups', startupsRoutes);
app.use('/api/departments', departmentsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/evaluations', evaluationsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/pilots', pilotsRoutes);
app.use('/api/milestones', milestonesRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/validations', validationsRoutes);
app.use('/api/procurements', procurementsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/audit', auditRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'SolutionBridge National Innovation Procurement Platform API',
    version: '1.0.0',
    status: 'ACTIVE',
    documentation: '/api/health'
  });
});

// 3. Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// 4. Server Start
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`==================================================`);
    logger.info(`  SolutionBridge Backend Server Running`);
    logger.info(`  Port: http://localhost:${PORT}`);
    logger.info(`  Health check: http://localhost:${PORT}/api/health`);
    logger.info(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`==================================================`);
  });
}

export default app;
