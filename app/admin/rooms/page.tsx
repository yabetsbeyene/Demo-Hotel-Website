'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Icon } from '@/components/icon';

type Room = { id: string; name: string; base_price: number; currency: string; total_rooms: number; occupied?: number; is_active: boolean };

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => { fetch('/api/admin/rooms').then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setRooms(data.roomTypes); }).catch((reason) => setError(reason.message || 'Unable to load rooms.')).finally(() => setLoading(false)); }, []);
  async function updateRoom(room: Room) { const response = await fetch('/api/admin/rooms', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: room.id, basePrice: room.base_price, totalRooms: room.total_rooms }) }); const data = await response.json(); if (!response.ok) return setError(data.error || 'Unable to save room type.'); setRooms((current) => current.map((item) => item.id === room.id ? { ...item, ...data.roomType } : item)); }
  return <AdminShell><div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">Inventory</p><h1>Room types<span>.</span></h1><p className="lede">Keep rates, capacity, and availability accurate for every room category.</p></div><button className="primary-button" onClick={() => setError('Create a room type in the database seed or management workflow.') }><Icon name="plus" size={17} /> Add room type</button></div>{error && <p className="form-error admin-inline-error" role="alert">{error}</p>}{loading ? <div className="panel empty-state">Loading live room inventory…</div> : <div className="room-grid">{rooms.map((room) => { const occupied = Number(room.occupied ?? 0); const available = Math.max(Number(room.total_rooms) - occupied, 0); const percent = room.total_rooms ? Math.round(occupied / Number(room.total_rooms) * 100) : 0; return <section className="room-card" key={room.id}><div className="room-photo"><Icon name="bed" size={28} /><span>{room.total_rooms} rooms total</span></div><div className="room-card-body"><div><h2>{room.name}</h2><p>{room.currency} {Number(room.base_price).toLocaleString()} / night</p></div><button className="row-more" aria-label={`Save ${room.name}`} onClick={() => updateRoom(room)}><Icon name="check" /></button><div className="room-card-meta"><span><b>{available}</b> available</span><span><b>{occupied}</b> occupied</span></div><div className="inventory-bar"><div style={{ width: `${percent}%` }} /></div></div></section>; })}</div>}</div></AdminShell>;
}
