import { query } from './db';

export async function getDashboardData() {
  const [roomTypes, arrivals, departures, revenue, activity] = await Promise.all([
    query<any>(`SELECT id, name, total_rooms, base_price, currency, COALESCE((SELECT SUM(b.rooms_requested) FROM bookings b WHERE b.room_type_id = rt.id AND b.status IN ('pending','confirmed') AND b.check_in <= CURRENT_DATE AND b.check_out > CURRENT_DATE), 0)::int AS occupied FROM room_types rt WHERE is_active = true ORDER BY name`),
    query<any>(`SELECT b.confirmation_code, b.guest_full_name, b.check_in, b.status, rt.name AS room_type_name FROM bookings b JOIN room_types rt ON rt.id = b.room_type_id WHERE b.check_in = CURRENT_DATE AND b.status IN ('pending','confirmed') ORDER BY b.created_at LIMIT 8`),
    query<any>(`SELECT count(*)::int AS count FROM bookings WHERE check_out = CURRENT_DATE AND status IN ('confirmed','completed')`),
    query<any>(`SELECT COALESCE(SUM(total_amount), 0)::numeric AS total FROM bookings WHERE created_at >= CURRENT_DATE`),
    query<any>(`SELECT action, entity_type, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 5`)
  ]);
  const totalRooms = roomTypes.rows.reduce((sum: number, row: any) => sum + Number(row.total_rooms), 0); const occupiedRooms = roomTypes.rows.reduce((sum: number, row: any) => sum + Number(row.occupied), 0);
  return { roomTypes: roomTypes.rows, arrivals: arrivals.rows, departures: Number(departures.rows[0]?.count ?? 0), revenue: revenue.rows[0]?.total ?? 0, activity: activity.rows, occupancy: totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0, totalRooms, occupiedRooms };
}
