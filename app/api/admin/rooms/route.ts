import { NextResponse } from 'next/server';
import { audit, requireAdmin } from '@/lib/server/auth';
import { query } from '@/lib/server/db';

export async function GET() { try { await requireAdmin(); const result = await query('SELECT * FROM room_types ORDER BY name'); return NextResponse.json({ roomTypes: result.rows }); } catch { return NextResponse.json({ error: 'Unable to load room types.' }, { status: 500 }); } }

export async function PATCH(request: Request) {
  try { const admin = await requireAdmin('admin'); const body = await request.json(); const id = body.id; if (typeof id !== 'string') return NextResponse.json({ error: 'Room type id is required.' }, { status: 400 }); const result = await query('UPDATE room_types SET name = COALESCE($1, name), base_price = COALESCE($2, base_price), total_rooms = COALESCE($3, total_rooms), max_guests = COALESCE($4, max_guests), is_active = COALESCE($5, is_active) WHERE id = $6 RETURNING *', [body.name ?? null, body.basePrice ?? null, body.totalRooms ?? null, body.maxGuests ?? null, body.isActive ?? null, id]); if (!result.rows[0]) return NextResponse.json({ error: 'Room type not found.' }, { status: 404 }); await audit(admin.id, 'room_type.updated', 'room_type', id, { fields: Object.keys(body) }); return NextResponse.json({ roomType: result.rows[0] }); } catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'FORBIDDEN' ? 'Only administrators can edit room types.' : 'Unable to update room type.' }, { status: error instanceof Error && error.message === 'FORBIDDEN' ? 403 : 500 }); }
}
