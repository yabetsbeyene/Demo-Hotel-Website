import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export async function GET() {
  try {
    await requireAdmin();
    const result = await query(`
      SELECT rt.*,
             COALESCE(json_agg(gi ORDER BY gi.sort_order, gi.created_at)
               FILTER (WHERE gi.id IS NOT NULL), '[]') AS images,
             COALESCE((
               SELECT SUM(b.rooms_requested)
               FROM bookings b
               WHERE b.room_type_id = rt.id
                 AND b.status IN ('pending', 'confirmed')
                 AND b.check_in <= CURRENT_DATE
                 AND b.check_out > CURRENT_DATE
             ), 0)::int AS occupied
      FROM room_types rt
      LEFT JOIN gallery_images gi ON gi.room_type_id = rt.id
      GROUP BY rt.id
      ORDER BY rt.name
    `);
    return NextResponse.json({ roomTypes: result.rows });
  } catch (error) {
    const notConfigured = error instanceof Error && error.message === 'DATABASE_URL is not configured';
    return NextResponse.json({ error: notConfigured ? 'Database is not configured.' : 'Unable to load room types.' }, { status: notConfigured ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin('admin');
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const maxGuests = Number(body.maxGuests ?? 2);
    const totalRooms = Number(body.totalRooms ?? 1);
    const basePrice = Number(body.basePrice ?? 0);
    const amenities = Array.isArray(body.amenities) ? body.amenities.filter((item: unknown): item is string => typeof item === 'string' && Boolean(item.trim())).map((item: string) => item.trim()) : [];

    if (!name || !slug || maxGuests < 1 || totalRooms < 1 || basePrice < 0) {
      return NextResponse.json({ error: 'Name, capacity, inventory, and a valid price are required.' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO room_types (slug, name, description, bed_type, max_guests, total_rooms, base_price, currency, amenities)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [slug, name, body.description ?? null, body.bedType ?? null, maxGuests, totalRooms, basePrice, body.currency || 'ETB', JSON.stringify(amenities)]
    );

    await audit(admin.id, 'room_type.created', 'room_type', result.rows[0].id, { name });
    return NextResponse.json({ roomType: { ...result.rows[0], images: [] } }, { status: 201 });
  } catch (error) {
    const forbidden = error instanceof Error && error.message === 'FORBIDDEN';
    const duplicate = error instanceof Error && error.message.includes('room_types_slug_key');
    return NextResponse.json({ error: forbidden ? 'Only administrators can create room types.' : duplicate ? 'That room slug already exists.' : 'Unable to create room type.' }, { status: forbidden ? 403 : duplicate ? 409 : 500 });
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
