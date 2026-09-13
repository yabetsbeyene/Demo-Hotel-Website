import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query, withTransaction } from '@/lib/server/db';

const activeStatuses = ['pending', 'confirmed'];
const validDate = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const url = new URL(request.url); const status = url.searchParams.get('status');
    const values: unknown[] = []; const filter = status ? `WHERE b.status = $1` : ''; if (status) values.push(status);
    const result = await query(`SELECT b.*, rt.name AS room_type_name FROM bookings b JOIN room_types rt ON rt.id = b.room_type_id ${filter} ORDER BY b.created_at DESC LIMIT 100`, values);
    return NextResponse.json({ bookings: result.rows });
  } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'FORBIDDEN' ? 'Forbidden' : 'Unable to load bookings.' }, { status: error instanceof Error && error.message === 'FORBIDDEN' ? 403 : 500 }); }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin(); const body = await request.json();
    const roomTypeId = typeof body.roomTypeId === 'string' ? body.roomTypeId : '';
    const checkIn = body.checkIn; const checkOut = body.checkOut;
    const roomsRequested = Number(body.roomsRequested ?? 1); const guestsCount = Number(body.guestsCount ?? 1);
    if (!roomTypeId || !validDate(checkIn) || !validDate(checkOut) || checkOut <= checkIn || roomsRequested < 1 || guestsCount < 1 || typeof body.guestFullName !== 'string' || typeof body.guestEmail !== 'string') return NextResponse.json({ error: 'Please provide valid guest, room, and stay details.' }, { status: 400 });
    const booking = await withTransaction(async (client) => {
      await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [roomTypeId]);
      const availability = await client.query<{ total_rooms: number; reserved: number }>(`SELECT rt.total_rooms, COALESCE(SUM(b.rooms_requested) FILTER (WHERE b.status = ANY($4::text[])), 0)::int AS reserved FROM room_types rt LEFT JOIN bookings b ON b.room_type_id = rt.id AND b.check_in < $3::date AND b.check_out > $2::date WHERE rt.id = $1 GROUP BY rt.id`, [roomTypeId, checkIn, checkOut, activeStatuses]);
      const stock = availability.rows[0]; if (!stock || Number(stock.total_rooms) - Number(stock.reserved) < roomsRequested) throw new Error('NO_AVAILABILITY');
      const code = `AZ-${Date.now().toString().slice(-8)}`;
      const inserted = await client.query(`INSERT INTO bookings (confirmation_code, room_type_id, guest_full_name, guest_email, guest_phone, guest_country, check_in, check_out, rooms_requested, guests_count, status, special_requests, total_amount, currency) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending',$11,$12,$13) RETURNING *`, [code, roomTypeId, body.guestFullName.trim(), body.guestEmail.trim().toLowerCase(), body.guestPhone ?? null, body.guestCountry ?? null, checkIn, checkOut, roomsRequested, guestsCount, body.specialRequests ?? null, body.totalAmount ?? null, body.currency ?? 'ETB']);
      return inserted.rows[0];
    });
    await audit(admin.id, 'booking.created', 'booking', booking.id, { confirmationCode: booking.confirmation_code });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) { const message = error instanceof Error ? error.message : ''; if (message === 'NO_AVAILABILITY') return NextResponse.json({ error: 'Those dates no longer have enough rooms available.' }, { status: 409 }); return NextResponse.json({ error: message === 'FORBIDDEN' ? 'Forbidden' : 'Unable to create booking.' }, { status: message === 'FORBIDDEN' ? 403 : 500 }); }
}
