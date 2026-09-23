import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export async function GET() {
  try {
    await requireAdmin();
    const result = await query(`
      SELECT rt.*,
             COALESCE((
               SELECT SUM(b.rooms_requested)
               FROM bookings b
               WHERE b.room_type_id = rt.id
                 AND b.status IN ('pending', 'confirmed')
                 AND b.check_in <= CURRENT_DATE
                 AND b.check_out > CURRENT_DATE
             ), 0)::int AS occupied
      FROM room_types rt
      ORDER BY rt.name
    `);
    return NextResponse.json({ roomTypes: result.rows });
  } catch (error) {
    const notConfigured = error instanceof Error && error.message === 'DATABASE_URL is not configured';
    return NextResponse.json({ error: notConfigured ? 'Database is not configured.' : 'Unable to load room types.' }, { status: notConfigured ? 503 : 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await requireAdmin('admin');
    const body = await request.json();
    if (typeof body.id !== 'string') return NextResponse.json({ error: 'Room type id is required.' }, { status: 400 });

    const result = await query(
      `UPDATE room_types
       SET name = COALESCE($1, name),
           base_price = COALESCE($2, base_price),
           total_rooms = COALESCE($3, total_rooms),
           max_guests = COALESCE($4, max_guests),
           is_active = COALESCE($5, is_active)
       WHERE id = $6
       RETURNING *`,
      [body.name ?? null, body.basePrice ?? null, body.totalRooms ?? null, body.maxGuests ?? null, body.isActive ?? null, body.id]
    );

    if (!result.rows[0]) return NextResponse.json({ error: 'Room type not found.' }, { status: 404 });
    await audit(admin.id, 'room_type.updated', 'room_type', body.id, { fields: Object.keys(body) });
    return NextResponse.json({ roomType: result.rows[0] });
  } catch (error) {
    const forbidden = error instanceof Error && error.message === 'FORBIDDEN';
    return NextResponse.json({ error: forbidden ? 'Only administrators can edit room types.' : 'Unable to update room type.' }, { status: forbidden ? 403 : 500 });
  }
}
