import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { requestId } from './lib/middleware';
import authRouter from './routes/auth';
import ownerRouter from './routes/owner';
import adminRouter from './routes/admin';
import publicRouter from './routes/public';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from './db/schema';

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

app.use('*', secureHeaders());
app.use('*', requestId());

app.use('*', cors({
  origin: (origin) => {
    if (!origin) return 'https://pginbengaluru.pages.dev';
    const allowed = [
      'https://pginbengaluru.pages.dev',
      'https://hsrpg.in',
      'https://staysure.in',
      'http://localhost:5173',
      'http://localhost:3000',
    ];
    if (allowed.includes(origin)) return origin;
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
app.get('/', (c) => c.json({ status: 'ok', service: 'StaySure API', version: '3.0.0' }));

// Auth (public + protected)
app.route('/api/auth', authRouter);

// Public APIs (no auth — search, listings, leads)
app.route('/api/public', publicRouter);

// Owner APIs (requires OWNER role)
app.route('/api/owner', ownerRouter);

// Admin APIs (requires SUPER_ADMIN role)
app.route('/api/admin', adminRouter);

// Public Broadcast API
app.get('/api/broadcast', async (c) => {
  const db = drizzle(c.env.DB, { schema });
  const [setting] = await db.select().from(schema.platformSettings).where(eq(schema.platformSettings.key, 'global_broadcast')).limit(1);
  if (!setting || !setting.value) return c.json({ success: true, broadcast: null });
  try {
    const broadcast = JSON.parse(setting.value);
    return c.json({ success: true, broadcast });
  } catch (e) {
    return c.json({ success: true, broadcast: null });
  }
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================

app.onError((err, c) => {
  const rid = c.get('requestId') || 'unknown';
  console.error(`[${rid}] Unhandled error:`, err.message);
  
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      requestId: rid,
    }
  }, 500);
});

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
