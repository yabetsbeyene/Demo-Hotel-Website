import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

const ALLOWED_STATUSES = new Set(['pending', 'contacted', 'quoted', 'confirmed', 'declined', 'completed']);

export async function GET() {
  try {
    await requireAdmin();
    const result = await query('SELECT * FROM meeting_inquiries ORDER BY created_at DESC LIMIT 100');
    return NextResponse.json({ inquiries: result.rows });
  } catch {
    return NextResponse.json({ error: 'Unable to load inquiries.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    if (typeof body.id !== 'string' || typeof body.status !== 'string' || !ALLOWED_STATUSES.has(body.status)) {
      return NextResponse.json({ error: 'A valid inquiry and status are required.' }, { status: 400 });
    }

    const result = await query(
      `UPDATE meeting_inquiries
       SET status = $1, admin_notes = COALESCE($2, admin_notes)
       WHERE id = $3
       RETURNING *`,
      [body.status, body.adminNotes ?? null, body.id]
    );

    if (!result.rows[0]) return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    await audit(admin.id, `meeting_inquiry.${body.status}`, 'meeting_inquiry', body.id);
    return NextResponse.json({ inquiry: result.rows[0] });
  } catch (error) {
    const forbidden = error instanceof Error && error.message === 'FORBIDDEN';
    return NextResponse.json({ error: forbidden ? 'Forbidden' : 'Unable to update inquiry.' }, { status: forbidden ? 403 : 500 });
  }
}
