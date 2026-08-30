
INSERT INTO users (id, public_id, email, name, password_hash, role, is_active, must_change_password, email_verified, created_at, updated_at)
VALUES (
  'admin-uuid-1',
  'STY-ADM-000001',
  'admin@staysure.in',
  'Super Admin',
  'pbkdf2:100000:e1d670cdb75acac9c75796f3ece585f8:b973abab11c8f0f3151ff67b6871d477359759eebb71611ceac4c5cdb836accc',
  'SUPER_ADMIN',
  1,
  0,
  1,
  1788112296463,
  1788112296463
) ON CONFLICT(email) DO NOTHING;
