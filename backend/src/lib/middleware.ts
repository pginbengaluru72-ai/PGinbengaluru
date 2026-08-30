import { Context, Next } from 'hono';
import { getCookie } from 'hono/cookie';
import { drizzle } from 'drizzle-orm/d1';
import { eq, and, gt } from 'drizzle-orm';
import * as schema from '../db/schema';
import { hashSessionToken } from './crypto';

export type UserRole = 'CUSTOMER' | 'OWNER' | 'SUPER_ADMIN';

export type AuthUser = {
  id: string;
  publicId: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
};

type AuthEnv = {
  Bindings: { DB: D1Database };
  Variables: { user: AuthUser; requestId: string };
};

// Generate unique request ID for tracing
function generateRequestId(): string {
  return crypto.randomUUID().split('-')[0];
}

/**
 * Middleware: Attach request ID to every request
 */
export function requestId() {
  return async (c: Context<AuthEnv>, next: Next) => {
    const id = generateRequestId();
    c.set('requestId', id);
    c.header('X-Request-Id', id);
    await next();
  };
}

/**
 * Middleware: Require authenticated session via HttpOnly cookie
 * Sets c.var.user with the authenticated user
 */
export function requireAuth() {
  return async (c: Context<AuthEnv>, next: Next) => {
    const sessionToken = getCookie(c, 'staysure_session');
    if (!sessionToken) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } }, 401);
    }

    const tokenHash = await hashSessionToken(sessionToken);
    const db = drizzle(c.env.DB, { schema });

    const sessionRows = await db
      .select({
        sessionId: schema.sessions.id,
        userId: schema.sessions.userId,
        expiresAt: schema.sessions.expiresAt,
      })
      .from(schema.sessions)
      .where(
        and(
          eq(schema.sessions.tokenHash, tokenHash),
          gt(schema.sessions.expiresAt, new Date())
        )
      )
      .limit(1);

    if (sessionRows.length === 0) {
      return c.json({ success: false, error: { code: 'SESSION_EXPIRED', message: 'Session expired. Please login again.' } }, 401);
    }

    const session = sessionRows[0];

    const userRows = await db
      .select({
        id: schema.users.id,
        publicId: schema.users.publicId,
        email: schema.users.email,
        name: schema.users.name,
        role: schema.users.role,
        isActive: schema.users.isActive,
        mustChangePassword: schema.users.mustChangePassword,
      })
      .from(schema.users)
      .where(and(eq(schema.users.id, session.userId), eq(schema.users.isActive, true)))
      .limit(1);

    if (userRows.length === 0) {
      return c.json({ success: false, error: { code: 'ACCOUNT_DISABLED', message: 'Account is disabled.' } }, 403);
    }

    c.set('user', userRows[0] as AuthUser);
    await next();
  };
}

/**
 * Middleware: Require specific role(s)
 * Must be used AFTER requireAuth()
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return async (c: Context<AuthEnv>, next: Next) => {
    const user = c.get('user');
    if (!user) {
      return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } }, 401);
    }

    if (!allowedRoles.includes(user.role)) {
      return c.json({ success: false, error: { code: 'FORBIDDEN', message: 'You do not have permission to access this resource.' } }, 403);
    }

    await next();
  };
}

/**
 * Helper: Verify that the authenticated OWNER owns a specific property.
 * Returns the property or null. Does NOT send a response — caller decides.
 */
export async function verifyPropertyOwnership(
  db: ReturnType<typeof drizzle>,
  userId: string,
  propertyId: string
) {
  const rows = await db
    .select({ id: schema.properties.id })
    .from(schema.properties)
    .where(and(eq(schema.properties.id, propertyId), eq(schema.properties.ownerId, userId)))
    .limit(1);

  return rows.length > 0 ? rows[0] : null;
}

/**
 * Standard error response helper
 */
export function apiError(c: Context, status: number, code: string, message: string) {
  return c.json({ success: false, error: { code, message } }, status as any);
}

/**
 * Standard success response helper
 */
export function apiSuccess(c: Context, data: any, status: number = 200) {
  return c.json({ success: true, data }, status as any);
}
