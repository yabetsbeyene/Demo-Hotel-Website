import { NextResponse } from 'next/server';
import { signIn } from '@/lib/server/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    const admin = await signIn(email, password);
    if (!admin) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    return NextResponse.json({ admin });
  } catch (error) {
    console.error('admin login failed', error);
    return NextResponse.json({ error: error instanceof Error && error.message === 'DATABASE_URL is not configured' ? 'Database is not configured. Add DATABASE_URL to .env.local first.' : 'Unable to sign in right now.' }, { status: error instanceof Error && error.message === 'DATABASE_URL is not configured' ? 503 : 500 });
  }
}
