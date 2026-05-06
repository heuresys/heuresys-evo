import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { logger } from './middleware/log.js';
import { errorHandler } from './middleware/error.js';
import { metricsMiddleware, metricsHandler } from './middleware/metrics.js';
import {
  hardenedHelmet,
  rateLimitGeneral,
  rateLimitAuth,
  csrfHmac,
  csrfTokenHandler,
} from './middleware/security.js';
import { healthRouter } from './routes/health.js';
import { employeesRouter } from './routes/employees.js';
import { authRouter } from './routes/auth.js';
import { leavesRouter } from './routes/leaves.js';
import { performanceReviewsRouter } from './routes/performance-reviews.js';
import { auditLogsRouter } from './routes/audit-logs.js';
import { escoRouter } from './routes/esco.js';
import { adminTenantSchemaRouter } from './routes/admin-tenant-schema.js';
import { rolesRouter } from './routes/roles.js';
import { tenantsRouter } from './routes/tenants.js';
import { setRBPCache, RBPCacheService } from './services/rbp-cache.js';
import { prisma } from './db/pool.js';
import './types.js';

// Initialize RBP cache singleton at boot — backed by the Prisma client.
// Routes that call requirePermission / getScopeCondition use this instance.
setRBPCache(new RBPCacheService(prisma));

const app = express();
const PORT = Number(process.env.PORT ?? 8200);

const corsOrigins = (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean);

// Disable Express's "X-Powered-By" header (also done by helmet but explicit).
app.disable('x-powered-by');

// Trust the loopback proxy when running behind nginx (production).
app.set('trust proxy', 'loopback');

app.use(logger);
app.use(metricsMiddleware);
app.use(hardenedHelmet);

// Prometheus exposition (no auth, no rate limit — scraped by Prometheus).
app.get('/metrics', metricsHandler);
app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(rateLimitGeneral);

// IMPORTANT: Auth.js mounts its own raw body parser internally; mount the
// router BEFORE express.json() to avoid double-parsing. /auth/* gets its own
// stricter rate limit.
app.use('/auth', rateLimitAuth, authRouter);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// CSRF endpoints + middleware. csrfHmac protects state-changing routes;
// csrfTokenHandler issues the binding cookie + returns the derived token.
app.get('/csrf', csrfTokenHandler);
app.use(csrfHmac);

app.use('/health', healthRouter);
app.use('/employees', employeesRouter);
app.use('/leaves', leavesRouter);
app.use('/performance-reviews', performanceReviewsRouter);
app.use('/audit-logs', auditLogsRouter);
app.use('/esco', escoRouter);
app.use('/admin/tenant-schema-version', adminTenantSchemaRouter);
app.use('/roles', rolesRouter);
app.use('/tenants', tenantsRouter);

// 404 catch-all (must be before errorHandler).
app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api-gateway] listening on :${PORT}`);
});
