import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema';
import { hashPassword, verifyPassword, generateSessionToken, hashSessionToken } from '../lib/crypto';
import { requireAuth, apiError, apiSuccess, type AuthUser } from '../lib/middleware';

type Bindings = { DB: D1Database };
type Variables = { user: AuthUser; requestId: string };

const authRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Public ID generators
let userCounter = 0;
function generatePublicId(prefix: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}${random}`.toUpperCase();
}

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function setSessionCookie(c: any, token: string, maxAge: number) {
  setCookie(c, 'staysure_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: Math.floor(maxAge / 1000),
  });
}

// ============================================================
// POST /api/auth/register — Customer self-registration
// ============================================================
authRouter.post('/register', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const { email, password, name, phone, role } = body;

  if (!email || !password || !name) {
    return apiError(c, 400, 'MISSING_FIELDS', 'Email, password, and name are required.');
  }

  const userRole = role === 'OWNER' ? 'OWNER' : 'CUSTOMER';

  if (typeof email !== 'string' || !email.includes('@') || email.length > 254) {
    return apiError(c, 400, 'INVALID_EMAIL', 'Please provide a valid email address.');
  }

  if (typeof password !== 'string' || password.length < 8) {
    return apiError(c, 400, 'WEAK_PASSWORD', 'Password must be at least 8 characters.');
  }

  if (typeof name !== 'string' || name.trim().length < 2) {
    return apiError(c, 400, 'INVALID_NAME', 'Name must be at least 2 characters.');
  }

  const db = drizzle(c.env.DB, { schema });

  // Check if email already exists
  const existing = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim())).limit(1);
  if (existing.length > 0) {
    return apiError(c, 409, 'EMAIL_EXISTS', 'An account with this email already exists.');
  }

  const userId = crypto.randomUUID();
  const publicId = generatePublicId('STY-USR');
  const passwordHash = await hashPassword(password);
  const now = new Date();

  await db.insert(schema.users).values({
    id: userId,
    publicId,
    email: email.toLowerCase().trim(),
    phone: phone || null,
    name: name.trim(),
    passwordHash,
    role: userRole,
    isActive: true,
    mustChangePassword: false,
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  });

  if (userRole === 'OWNER') {
    await db.insert(schema.ownerProfiles).values({
      id: crypto.randomUUID(),
      userId,
      publicId: generatePublicId('STY-OWN'),
      city: 'Bengaluru',
      createdAt: now,
      updatedAt: now,
    });
  } else {
    await db.insert(schema.customerProfiles).values({
      id: crypto.randomUUID(),
      userId,
      publicId: generatePublicId('STY-CUS'),
      createdAt: now,
      updatedAt: now,
    });
  }

  // Create session
  const sessionToken = generateSessionToken();
  const tokenHash = await hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(schema.sessions).values({
    id: crypto.randomUUID(),
    userId,
    tokenHash,
    expiresAt,
    ipAddress: c.req.header('CF-Connecting-IP') || null,
    userAgent: c.req.header('User-Agent')?.substring(0, 256) || null,
    createdAt: now,
  });

  setSessionCookie(c, sessionToken, SESSION_DURATION_MS);

  return apiSuccess(c, {
    user: { id: publicId, email: email.toLowerCase().trim(), name: name.trim(), role: 'CUSTOMER' }
  }, 201);
});

// ============================================================
// POST /api/auth/login
// ============================================================
authRouter.post('/login', async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const { email, password } = body;

  if (!email || !password) {
    return apiError(c, 400, 'MISSING_FIELDS', 'Email and password are required.');
  }

  const db = drizzle(c.env.DB, { schema });

  const userRows = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase().trim()))
    .limit(1);

  if (userRows.length === 0) {
    return apiError(c, 401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  const user = userRows[0];

  if (!user.isActive) {
    return apiError(c, 403, 'ACCOUNT_DISABLED', 'Your account has been disabled. Contact support.');
  }

  const passwordValid = await verifyPassword(password, user.passwordHash);
  if (!passwordValid) {
    return apiError(c, 401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  }

  // Create session
  const sessionToken = generateSessionToken();
  const tokenHash = await hashSessionToken(sessionToken);
  const now = new Date();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await db.insert(schema.sessions).values({
    id: crypto.randomUUID(),
    userId: user.id,
    tokenHash,
    expiresAt,
    ipAddress: c.req.header('CF-Connecting-IP') || null,
    userAgent: c.req.header('User-Agent')?.substring(0, 256) || null,
    createdAt: now,
  });

  setSessionCookie(c, sessionToken, SESSION_DURATION_MS);

  return apiSuccess(c, {
    user: {
      id: user.publicId,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    }
  });
});

// ============================================================
// POST /api/auth/logout
// ============================================================
authRouter.post('/logout', requireAuth(), async (c) => {
  deleteCookie(c, 'staysure_session', { path: '/' });
  return apiSuccess(c, { message: 'Logged out successfully.' });
});

// ============================================================
// GET /api/auth/me — Get current session user
// ============================================================
authRouter.get('/me', requireAuth(), async (c) => {
  const user = c.get('user');
  return apiSuccess(c, {
    user: {
      id: user.publicId,
      email: user.email,
      name: user.name,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    }
  });
});

// ============================================================
// POST /api/auth/change-password
// ============================================================
authRouter.post('/change-password', requireAuth(), async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!body) return apiError(c, 400, 'INVALID_BODY', 'Invalid request body.');

  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return apiError(c, 400, 'MISSING_FIELDS', 'Current and new password are required.');
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return apiError(c, 400, 'WEAK_PASSWORD', 'New password must be at least 8 characters.');
  }

  const user = c.get('user');
  const db = drizzle(c.env.DB, { schema });

  const userRows = await db.select({ passwordHash: schema.users.passwordHash }).from(schema.users).where(eq(schema.users.id, user.id)).limit(1);
  if (userRows.length === 0) return apiError(c, 404, 'USER_NOT_FOUND', 'User not found.');

  const valid = await verifyPassword(currentPassword, userRows[0].passwordHash);
  if (!valid) return apiError(c, 401, 'WRONG_PASSWORD', 'Current password is incorrect.');

  const newHash = await hashPassword(newPassword);
  await db.update(schema.users).set({
    passwordHash: newHash,
    mustChangePassword: false,
    updatedAt: new Date(),
  }).where(eq(schema.users.id, user.id));

  return apiSuccess(c, { message: 'Password changed successfully.' });
});

export default authRouter;
