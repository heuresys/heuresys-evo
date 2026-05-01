import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { logger } from './middleware/log.js';
import { errorHandler } from './middleware/error.js';
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
import './types.js';

const app = express();
const PORT = Number(process.env.PORT ?? 8200);

const corsOrigins = (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean);

// Disable Express's "X-Powered-By" header (also done by helmet but explicit).
app.disable('x-powered-by');

// Trust the loopback proxy when running behind nginx (production).
app.set('trust proxy', 'loopback');

app.use(logger);
app.use(hardenedHelmet);
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

// 404 catch-all (must be before errorHandler).
app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api-gateway] listening on :${PORT}`);
});
