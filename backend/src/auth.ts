// This file has been replaced by the custom auth system in routes/auth.ts
// The old better-auth integration has been removed in favor of custom
// session-based auth with PBKDF2 hashing and HttpOnly cookies.
//
// See:
// - src/routes/auth.ts (login, register, logout, change-password)
// - src/lib/crypto.ts (password hashing, session tokens)
// - src/lib/middleware.ts (requireAuth, requireRole, RBAC)
export {};
