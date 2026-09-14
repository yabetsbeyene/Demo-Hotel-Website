import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { randomBytes, scryptSync } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import pg from 'pg';

const envFile = resolve('.env.local');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

const rl = createInterface({ input, output });
const email = (await rl.question('Admin email: ')).trim().toLowerCase();
const fullName = (await rl.question('Full name: ')).trim();
const role = ((await rl.question('Role (admin/staff) [admin]: ')).trim() || 'admin');
const password = await rl.question('Password (8+ characters): ', { mask: '*' });
rl.close();
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
if (!['admin', 'staff'].includes(role)) throw new Error('Role must be admin or staff');
if (password.length < 8) throw new Error('Password must be at least 8 characters');
const salt = randomBytes(16); const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
const stored = `scrypt$16384$8$1$${salt.toString('base64url')}$${hash.toString('base64url')}`;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
await pool.query(`INSERT INTO admin_users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) ON CONFLICT (lower(email)) DO UPDATE SET password_hash = EXCLUDED.password_hash, full_name = EXCLUDED.full_name, role = EXCLUDED.role, is_active = true`, [email, stored, fullName, role]);
await pool.end();
console.log(`Admin ${email} is ready.`);
