const crypto = require('crypto');
const fs = require('fs');

const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const derivedKey = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
  
  const saltHex = salt.toString('hex');
  const hashHex = derivedKey.toString('hex');
  
  return `pbkdf2:${ITERATIONS}:${saltHex}:${hashHex}`;
}

const passwordHash = hashPassword('StaySureAdmin2026!');
const now = Date.now();

const sql = `
INSERT INTO users (id, public_id, email, name, password_hash, role, is_active, must_change_password, email_verified, created_at, updated_at)
VALUES (
  'admin-uuid-1',
  'STY-ADM-000001',
  'admin@staysure.in',
  'Super Admin',
  '${passwordHash}',
  'SUPER_ADMIN',
  1,
  0,
  1,
  ${now},
  ${now}
) ON CONFLICT(email) DO NOTHING;
`;

fs.writeFileSync('seed.sql', sql);
console.log('seed.sql generated');
