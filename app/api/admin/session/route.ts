import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/server/auth';

export async function GET() { return NextResponse.json({ admin: await getCurrentAdmin() }); }
