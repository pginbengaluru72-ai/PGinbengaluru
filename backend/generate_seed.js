import { hashPassword } from './src/lib/crypto.js';
import fs from 'fs';

async function generateSeed() {
  const passwordHash = await hashPassword('StaySureAdmin2026!');
  const now = Date.now();
  
  const sql = `
-- Seed Super Admin
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
}

generateSeed().catch(console.error);
