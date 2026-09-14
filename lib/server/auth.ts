import { cookies, headers } from 'next/headers';
import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'crypto';
import { query } from './db';

function deriveKey(password: string, salt: Buffer, keyLength: number, options: { N: number; r: number; p: number }) {
  return new Promise<Buffer>((resolve, reject) => nodeScrypt(password, salt, keyLength, options, (error, derived) => error ? reject(error) : resolve(derived as Buffer)));
}
const COOKIE = 'az_admin_session';
const SESSION_DAYS = 7;
export type AdminRole = 'admin' | 'staff';
export type Admin = { id: string; email: string; fullName: string; role: AdminRole; isActive: boolean };

function tokenHash(token: string) { return createHash('sha256').update(token).digest('hex'); }

export async function hashPassword(password: string) {
  if (password.length < 8) throw new Error('Password must be at least 8 characters');
  const salt = randomBytes(16);
  const derived = await deriveKey(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString('base64url')}$${derived.toString('base64url')}`;
}

export async function verifyPassword(password: string, stored: string) {
  try {
    const [, n, r, p, saltText, hashText] = stored.split('$');
    const expected = Buffer.from(hashText, 'base64url');
    const actual = await deriveKey(password, Buffer.from(saltText, 'base64url'), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch { return false; }
}

export async function signIn(email: string, password: string) {
  const result = await query<{ id: string; email: string; full_name: string; role: AdminRole; is_active: boolean; password_hash: string }>(
    'SELECT id, email, full_name, role, is_active, password_hash FROM admin_users WHERE lower(email) = lower($1) LIMIT 1', [email.trim()]
  );
  const user = result.rows[0];
  if (!user || !user.is_active || !(await verifyPassword(password, user.password_hash))) return null;
  const token = randomBytes(32).toString('base64url');
  const requestHeaders = headers();
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000);
  await query('INSERT INTO admin_sessions (admin_user_id, token_hash, expires_at, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5)', [user.id, tokenHash(token), expires, requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null, requestHeaders.get('user-agent')]);
  await query('UPDATE admin_users SET last_login_at = now() WHERE id = $1', [user.id]);
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', expires });
  return { id: user.id, email: user.email, fullName: user.full_name, role: user.role, isActive: user.is_active } satisfies Admin;
}

export async function getCurrentAdmin(): Promise<Admin | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const result = await query<{ id: string; email: string; full_name: string; role: AdminRole; is_active: boolean }>(
    `SELECT u.id, u.email, u.full_name, u.role, u.is_active
       FROM admin_sessions s JOIN admin_users u ON u.id = s.admin_user_id
      WHERE s.token_hash = $1 AND s.expires_at > now() AND u.is_active = true`, [tokenHash(token)]
  );
  const user = result.rows[0];
  if (!user) { cookies().delete(COOKIE); return null; }
  await query('UPDATE admin_sessions SET last_seen_at = now() WHERE token_hash = $1', [tokenHash(token)]);
  return { id: user.id, email: user.email, fullName: user.full_name, role: user.role, isActive: user.is_active };
}

export async function requireAdmin(role?: AdminRole) {
  const admin = await getCurrentAdmin();
  if (!admin || (role && admin.role !== role)) throw new Error('FORBIDDEN');
  return admin;
}

export async function signOut() {
  const token = cookies().get(COOKIE)?.value;
  if (token) await query('DELETE FROM admin_sessions WHERE token_hash = $1', [tokenHash(token)]);
  cookies().delete(COOKIE);
}

export async function audit(adminId: string | null, action: string, entityType?: string, entityId?: string, metadata: Record<string, unknown> = {}) {
  const requestHeaders = headers();
  await query('INSERT INTO audit_logs (admin_user_id, action, entity_type, entity_id, metadata, ip_address) VALUES ($1, $2, $3, $4, $5, $6)', [adminId, action, entityType ?? null, entityId ?? null, JSON.stringify(metadata), requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null]);
}
