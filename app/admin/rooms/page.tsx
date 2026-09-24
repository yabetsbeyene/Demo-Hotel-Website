'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { Icon } from '@/components/icon';

type RoomImage = { id: string; image_url: string; alt_text: string; title: string | null };
type Room = { id: string; name: string; slug: string; description: string | null; bed_type: string | null; base_price: number; currency: string; total_rooms: number; max_guests: number; occupied?: number; images: RoomImage[] };
type RoomForm = { name: string; description: string; bedType: string; maxGuests: string; totalRooms: string; basePrice: string; amenities: string };

const emptyForm: RoomForm = { name: '', description: '', bedType: '', maxGuests: '2', totalRooms: '1', basePrice: '', amenities: '' };

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState<RoomForm>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadRooms() {
    setLoading(true);
    const response = await fetch('/api/admin/rooms');
    const data = await response.json();
    if (!response.ok) setError(data.error || 'Unable to load room inventory.');
    else setRooms(data.roomTypes);
    setLoading(false);
  }

  useEffect(() => { loadRooms(); }, []);

  async function createRoom(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    const response = await fetch('/api/admin/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, maxGuests: Number(form.maxGuests), totalRooms: Number(form.totalRooms), basePrice: Number(form.basePrice), amenities: form.amenities.split(',') })
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || 'Unable to create room type.');
    else { setRooms((current) => [...current, data.roomType]); setForm(emptyForm); setShowForm(false); }
    setSaving(false);
  }

  async function uploadImages(roomId: string, files: FileList | null) {
    if (!files?.length) return;
    setError('');
    const uploaded: RoomImage[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.set('file', file);
      formData.set('roomTypeId', roomId);
      formData.set('category', 'rooms');
      formData.set('title', file.name.replace(/\.[^/.]+$/, ''));
      formData.set('altText', `View of ${rooms.find((room) => room.id === roomId)?.name ?? 'room'}`);
      const response = await fetch('/api/admin/gallery', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) { setError(data.error || `Unable to upload ${file.name}.`); continue; }
      uploaded.push(data.image);
    }
    if (uploaded.length) setRooms((current) => current.map((room) => room.id === roomId ? { ...room, images: [...room.images, ...uploaded] } : room));
  }

  return <AdminShell><div className="page-wrap">
    <div className="page-heading"><div><p className="eyebrow">Inventory</p><h1>Room types<span>.</span></h1><p className="lede">Create room categories, manage inventory, and publish as many room images as you need.</p></div><button className="primary-button" onClick={() => setShowForm((open) => !open)}><Icon name="plus" size={17} /> {showForm ? 'Close form' : 'Add room type'}</button></div>
    {error && <p className="form-error admin-inline-error" role="alert">{error}</p>}
    {showForm && <section className="panel room-create-panel"><form className="room-create-form" onSubmit={createRoom}><label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Bed type<input value={form.bedType} onChange={(event) => setForm({ ...form, bedType: event.target.value })} placeholder="King bed" /></label><label>Max guests<input required type="number" min="1" value={form.maxGuests} onChange={(event) => setForm({ ...form, maxGuests: event.target.value })} /></label><label>Total rooms<input required type="number" min="1" value={form.totalRooms} onChange={(event) => setForm({ ...form, totalRooms: event.target.value })} /></label><label>Nightly price<input required type="number" min="0" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: event.target.value })} /></label><label>Amenities <span className="field-hint">comma separated</span><input value={form.amenities} onChange={(event) => setForm({ ...form, amenities: event.target.value })} placeholder="Wi-Fi, breakfast, city view" /></label><label className="room-description-field">Description<textarea required rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><button className="primary-button" disabled={saving}>{saving ? 'Creating…' : 'Create room type'}</button></form></section>}
    {loading ? <div className="panel empty-state">Loading live room inventory…</div> : <div className="room-grid">{rooms.map((room) => { const occupied = Number(room.occupied ?? 0); const available = Math.max(Number(room.total_rooms) - occupied, 0); const percent = room.total_rooms ? Math.round(occupied / Number(room.total_rooms) * 100) : 0; const cover = room.images[0]?.image_url; return <section className="room-card" key={room.id}><div className="room-photo" style={cover ? { backgroundImage: `url(${cover})` } : undefined}><span>{room.images.length} image{room.images.length === 1 ? '' : 's'}</span></div><div className="room-card-body"><div><h2>{room.name}</h2><p>{room.currency} {Number(room.base_price).toLocaleString()} / night · {room.max_guests} guests</p></div><label className="room-upload-button"><Icon name="image" size={15} /> Add images<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => uploadImages(room.id, event.target.files)} /></label><div className="room-card-meta"><span><b>{available}</b> available</span><span><b>{occupied}</b> occupied</span></div><div className="inventory-bar"><div style={{ width: `${percent}%` }} /></div></div></section>; })}</div>}
  </div></AdminShell>;
}
