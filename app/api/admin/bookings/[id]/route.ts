import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

const ALLOWED_STATUSES = new Set(['pending', 'confirmed', 'cancelled', 'completed', 'no_show']);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin();
    const body = await request.json();

    if (typeof body.status !== 'string' || !ALLOWED_STATUSES.has(body.status)) {
      return NextResponse.json({ error: 'Invalid booking status.' }, { status: 400 });
    }

    const result = await query(
      `UPDATE bookings
       SET status = $1,
           confirmed_at = CASE WHEN $1 = 'confirmed' THEN COALESCE(confirmed_at, now()) ELSE confirmed_at END,
           cancelled_at = CASE WHEN $1 = 'cancelled' THEN COALESCE(cancelled_at, now()) ELSE cancelled_at END
       WHERE id = $2
       RETURNING *`,
      [body.status, params.id]
    );

    if (!result.rows[0]) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    await audit(admin.id, `booking.${body.status}`, 'booking', params.id);
    return NextResponse.json({ booking: result.rows[0] });
  } catch (error) {
    const forbidden = error instanceof Error && error.message === 'FORBIDDEN';
    return NextResponse.json({ error: forbidden ? 'Forbidden' : 'Unable to update booking.' }, { status: forbidden ? 403 : 500 });
  }
}
