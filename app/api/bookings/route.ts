import { NextResponse } from 'next/server';
import { query, withTransaction } from '@/lib/server/db';

const validDate = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const roomTypeSlug = typeof body.roomTypeSlug === 'string' ? body.roomTypeSlug : '';
    const checkIn = body.checkIn;
    const checkOut = body.checkOut;
    const guestsCount = Number(body.guestsCount ?? 1);
    if (!roomTypeSlug || !validDate(checkIn) || !validDate(checkOut) || checkOut <= checkIn || guestsCount < 1 || typeof body.guestFullName !== 'string' || typeof body.guestEmail !== 'string' || !body.guestFullName.trim() || !body.guestEmail.trim()) {
      return NextResponse.json({ error: 'Please provide valid guest, room, and stay details.' }, { status: 400 });
    }
    const booking = await withTransaction(async (client) => {
      const room = await client.query<{ id: string; name: string; base_price: number; currency: string; max_guests: number }>('SELECT id, name, base_price, currency, max_guests FROM room_types WHERE slug = $1 AND is_active = true', [roomTypeSlug]);
      const roomType = room.rows[0];
      if (!roomType) throw new Error('ROOM_NOT_FOUND');
      if (guestsCount > Number(roomType.max_guests)) throw new Error('GUEST_LIMIT');
      await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [roomType.id]);
      const availability = await client.query<{ total_rooms: number; reserved: number }>(`SELECT rt.total_rooms, COALESCE(SUM(b.rooms_requested) FILTER (WHERE b.status = ANY($4::text[])), 0)::int AS reserved FROM room_types rt LEFT JOIN bookings b ON b.room_type_id = rt.id AND b.check_in < $3::date AND b.check_out > $2::date WHERE rt.id = $1 GROUP BY rt.id`, [roomType.id, checkIn, checkOut, ['pending', 'confirmed']]);
      const stock = availability.rows[0];
      if (!stock || Number(stock.total_rooms) - Number(stock.reserved) < 1) throw new Error('NO_AVAILABILITY');
      const nights = Math.max(1, Math.round((Date.parse(`${checkOut}T00:00:00Z`) - Date.parse(`${checkIn}T00:00:00Z`)) / 86400000));
      const code = `AZ-${Date.now().toString().slice(-8)}`;
      const inserted = await client.query(`INSERT INTO bookings (confirmation_code, room_type_id, guest_full_name, guest_email, guest_phone, check_in, check_out, rooms_requested, guests_count, status, special_requests, total_amount, currency) VALUES ($1,$2,$3,$4,$5,$6,$7,1,$8,'pending',$9,$10,$11) RETURNING id, confirmation_code, guest_full_name, guest_email, check_in, check_out, status, total_amount, currency`, [code, roomType.id, body.guestFullName.trim(), body.guestEmail.trim().toLowerCase(), typeof body.guestPhone === 'string' ? body.guestPhone.trim() : null, checkIn, checkOut, guestsCount, typeof body.specialRequests === 'string' ? body.specialRequests.trim() : null, Number(roomType.base_price) * nights, roomType.currency]);
      return { ...inserted.rows[0], room_name: roomType.name };
    });
    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'NO_AVAILABILITY') return NextResponse.json({ error: 'Those dates are no longer available. Please choose another stay.' }, { status: 409 });
    if (message === 'ROOM_NOT_FOUND') return NextResponse.json({ error: 'That room type is no longer available.' }, { status: 404 });
    if (message === 'GUEST_LIMIT') return NextResponse.json({ error: 'That room cannot accommodate the requested number of guests.' }, { status: 400 });
    if (message === 'DATABASE_URL is not configured') return NextResponse.json({ error: 'Booking service is not configured yet.' }, { status: 503 });
    console.error('public booking failed', error);
    return NextResponse.json({ error: 'Unable to create your booking request right now.' }, { status: 500 });
  }
}
