# SolutionBridge Backend API Server

Backend server for the **SolutionBridge** National Innovation Procurement Platform, connecting Government Departments, DPIIT-recognized Startups, and Independent Expert Evaluators.

Built with **Node.js**, **Express.js**, and **Supabase PostgreSQL & Storage**.

---

## 🛠 Technology Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: Supabase PostgreSQL (18 RLS-enabled tables)
- **Authentication**: Supabase Auth (JWT Bearer Token verification)
- **File Storage**: Supabase Storage (`pilot-evidence`, `procurement-documents`)
- **Security**: Helmet, CORS, Centralized Error Handling, Role-Based Access Control (RBAC)

---

## 📋 Environment Configuration

Create a `.env` file in the `server/` directory (see `.env.example`):

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Supabase Credentials (from your Supabase Dashboard > Project Settings > API)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_secret_key
```

> ⚠️ **CRITICAL SECURITY RULE**: Never expose `SUPABASE_SERVICE_ROLE_KEY` to frontend code or commit `.env` to Git repositories.

---

## 🚀 Installation & Running

```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Run in development mode with nodemon (auto-reloads on file change)
npm run dev

# Run in production mode
npm start
```

---

## 🔐 Authentication & RBAC Architecture

### 1. Token Flow
1. The frontend logs in with Supabase Auth (`supabase.auth.signInWithPassword(...)`).
2. The frontend attaches the received JWT access token in the `Authorization` header:
   ```http
   Authorization: Bearer <access_token>
   ```
3. The backend middleware (`requireAuth`) verifies the JWT against Supabase Auth, fetches the corresponding profile from `profiles`, and populates `req.user`.

### 2. User Roles & Registration Rules
| Role | Registration Mode | Permitted Actions |
| :--- | :--- | :--- |
| `startup` | **Public Registration** | Register profile, browse challenges, submit applications, manage pilot evidence & telemetry, view procurement & payments. |
| `government` | **Admin Invitation Only** | Create & publish challenges, manage applications, assign expert evaluators, launch pilots, authorize direct procurement orders, release payments, audit logs. |
| `expert` | **Admin Invitation Only** | Review assigned applications, submit 5-criteria weighted evaluations, inspect pilot telemetry & evidence, submit independent pilot validation reports. |

---

## 📊 Evaluation 5-Factor Weighted Score Formula

All evaluation submissions are computed on the backend (0–10 scale):

$$\text{Weighted Score} = (\text{Tech} \times 0.25) + (\text{Innovation} \times 0.20) + (\text{Cost} \times 0.20) + (\text{Scale} \times 0.20) + (\text{Risk} \times 0.15)$$

---

## 📡 REST API Reference

### Health & Auth
- `GET /api/health` — Check server health & Supabase connectivity
- `GET /api/auth/me` — Get current authenticated user profile
- `POST /api/auth/register-startup` — Public startup signup & profile initialization

### User Management (Government Admin)
- `POST /api/users/government` — Provision Government officer accounts
- `POST /api/users/expert` — Provision Independent Expert accounts
- `GET /api/users` — List platform users
- `PATCH /api/users/:id/status` — Activate / Deactivate user account

### Startups
- `GET /api/startups` — List all registered startups
- `GET /api/startups/me` — Get current startup's company profile
- `GET /api/startups/:id` — Get startup profile by ID
- `POST /api/startups` — Create company profile
- `PUT /api/startups/me` — Update company profile
- `PATCH /api/startups/:id/verify` — Government DPIIT verification

### Government Departments
- `GET /api/departments` — List departments
- `GET /api/departments/:id` — Get department by ID
- `POST /api/departments` — Create department (Gov Admin)
- `PUT /api/departments/:id` — Update department details

### Challenges (Problem Statements)
- `GET /api/challenges` — List challenges (`?status=published|draft|closed&department_id=...`)
- `GET /api/challenges/:id` — Get challenge details & applications
- `POST /api/challenges` — Create draft problem statement (Gov)
- `PUT /api/challenges/:id` — Edit problem statement
- `PATCH /api/challenges/:id/publish` — Publish challenge publicly
- `PATCH /api/challenges/:id/close` — Close challenge to new proposals
- `DELETE /api/challenges/:id` — Delete challenge

### Applications & Proposals
- `GET /api/applications` — List applications (filtered by role / ownership)
- `GET /api/applications/:id` — Get application with proposal, evaluations, and assignments
- `GET /api/applications/challenge/:challengeId` — List applications submitted for a challenge
- `POST /api/applications` — Submit solution proposal (Startup only)
- `PUT /api/applications/:id` — Update proposal
- `PATCH /api/applications/:id/status` — Government review (`under_review`, `shortlisted`, `selected`, `rejected`)

### Expert Assignment & Evaluation
- `POST /api/applications/:id/experts` — Assign expert to application (Gov)
- `GET /api/applications/:id/experts` — List assigned experts
- `DELETE /api/applications/:id/experts/:expertId` — Remove expert assignment
- `POST /api/applications/:id/evaluations` — Submit evaluation scoring (Assigned Expert only)
- `GET /api/applications/:id/evaluations` — List submitted evaluations
- `PUT /api/evaluations/:id` — Update evaluation

### Sandbox Pilots
- `GET /api/pilots` — List pilots
- `GET /api/pilots/:id` — Get pilot details, milestones, evidence, and telemetry
- `GET /api/pilots/:id/performance` — Compute real-time performance percentage vs baseline & target
- `POST /api/pilots` — Create pilot deployment for selected application (Gov)
- `PATCH /api/pilots/:id/status` — Update pilot status (`not_started`, `approved`, `in_progress`, `completed`, `failed`)

### Milestones, Evidence & Telemetry
- `GET /api/pilots/:pilotId/milestones` — List milestones
- `POST /api/pilots/:pilotId/milestones` — Add milestone
- `PUT /api/milestones/:id` — Edit milestone
- `PATCH /api/milestones/:id/status` — Update milestone progress / completion
- `GET /api/pilots/:pilotId/evidence` — List uploaded proof & validation documents
- `POST /api/pilots/:pilotId/evidence` — Upload evidence file (multipart form with `file`)
- `PATCH /api/evidence/:id/verify` — Verify / Reject evidence
- `GET /api/pilots/:pilotId/telemetry` — List IoT / test telemetry data points
- `POST /api/pilots/:pilotId/telemetry` — Record real-time telemetry metrics

### Independent Pilot Validation
- `POST /api/pilots/:pilotId/experts` — Appoint expert to pilot audit
- `GET /api/pilots/:pilotId/experts` — List appointed experts
- `DELETE /api/pilots/:pilotId/experts/:expertId` — Revoke appointment
- `POST /api/pilots/:id/validation` — Submit signed validation report (`approved`, `needs_improvement`, `rejected`)
- `GET /api/pilots/:id/validation` — Read validation report
- `PUT /api/validations/:id` — Update validation report

### Direct Procurement (GFR Rule 194)
- `GET /api/procurements` — List procurement orders
- `GET /api/procurements/:id` — Get procurement order with payment schedule
- `POST /api/procurements` — Create procurement order (Requires approved validation)
- `PUT /api/procurements/:id` — Update procurement terms
- `PATCH /api/procurements/:id/status` — Update status (`pending`, `approved`, `in_progress`, `completed`)
- `POST /api/procurements/:id/documents` — Upload exemption certificate file

### Payments & Milestones
- `GET /api/procurements/:id/payments` — List payment milestones
- `POST /api/procurements/:id/payments` — Add payment tranche
- `PATCH /api/payments/:id/status` — Approve or release payment milestone

### Notifications & Audit Trail
- `GET /api/notifications` — List authenticated user's notifications
- `PATCH /api/notifications/:id/read` — Mark notification read
- `PATCH /api/notifications/read-all` — Mark all notifications read
- `GET /api/audit` — List platform audit trail (Government & Admin)
- `GET /api/audit/:id` — View audit entry details
