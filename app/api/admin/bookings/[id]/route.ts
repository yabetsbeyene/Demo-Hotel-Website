import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

const allowed = new Set(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']);
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(); const body = await request.json(); const status = body.status;
    if (!allowed.has(status)) return NextResponse.json({ error: 'Invalid booking status.' }, { status: 400 });
    const result = await query(`UPDATE bookings SET status = $1, confirmed_at = CASE WHEN $1 = 'confirmed' THEN COALESCE(confirmed_at, now()) ELSE confirmed_at END, cancelled_at = CASE WHEN $1 = 'cancelled' THEN COALESCE(cancelled_at, now()) ELSE cancelled_at END WHERE id = $2 RETURNING *`, [status, params.id]);
    if (!result.rows[0]) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    await audit(admin.id, `booking.${status}`, 'booking', params.id); return NextResponse.json({ booking: result.rows[0] });
  } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'FORBIDDEN' ? 'Forbidden' : 'Unable to update booking.' }, { status: error instanceof Error && error.message === 'FORBIDDEN' ? 403 : 500 }); }
}
