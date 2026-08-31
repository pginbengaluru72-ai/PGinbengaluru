import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { requestId } from './lib/middleware';
import authRouter from './routes/auth';
import ownerRouter from './routes/owner';
import superadminRouter from './routes/superadmin';
import tenantRouter from './routes/tenant';

type Bindings = {
  DB: D1Database;
  BUCKET: R2Bucket;
};

type Variables = {
  user: import('./lib/middleware').AuthUser;
  requestId: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ============================================================
// GLOBAL MIDDLEWARE
// ============================================================

// Security headers
app.use('*', secureHeaders());

// Request ID for tracing
app.use('*', requestId());

// CORS — dynamic origin to support Pages preview URLs
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return 'https://pginbengaluru.pages.dev';
    const allowed = [
      'https://pginbengaluru.pages.dev',
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    if (allowed.includes(origin)) return origin;
    // Allow all Cloudflare Pages preview subdomains
    if (origin.endsWith('.pginbengaluru.pages.dev')) return origin;
    return 'https://pginbengaluru.pages.dev';
  },
  allowHeaders: ['Content-Type'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  maxAge: 86400,
}));

// ============================================================
// ROUTES
// ============================================================

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'StaySure API', version: '2.0.0' }));

// Auth (public + protected)
app.route('/api/auth', authRouter);

// Owner APIs (requires OWNER role)
app.route('/api/owner', ownerRouter);

// Admin APIs (requires SUPER_ADMIN role)
app.route('/api/admin', superadminRouter);

// Customer/Tenant APIs
app.route('/api/customer', tenantRouter);

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.onError((err, c) => {
  const requestId = c.get('requestId') || 'unknown';
  console.error(`[${requestId}] Unhandled error:`, err.message);
  
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      requestId,
    }
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested endpoint does not exist.',
    }
  }, 404);
});

export default app;
