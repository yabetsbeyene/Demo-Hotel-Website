import { NextResponse } from 'next/server';
import { query } from '@/lib/server/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT rt.id, rt.slug, rt.name, rt.description, rt.bed_type, rt.max_guests,
             rt.total_rooms, rt.base_price, rt.currency, rt.amenities,
             COALESCE(json_agg(gi ORDER BY gi.sort_order, gi.created_at)
               FILTER (WHERE gi.id IS NOT NULL), '[]') AS images
      FROM room_types rt
      LEFT JOIN gallery_images gi ON gi.room_type_id = rt.id
      WHERE rt.is_active = true
      GROUP BY rt.id
      ORDER BY rt.name
    `);
    return NextResponse.json({ rooms: result.rows });
  } catch (error) {
    const notConfigured = error instanceof Error && error.message === 'DATABASE_URL is not configured';
    return NextResponse.json({ error: notConfigured ? 'Database is not configured.' : 'Unable to load rooms.' }, { status: notConfigured ? 503 : 500 });
  }
}
