export type BookingStatus = 'Confirmed' | 'Pending' | 'Checked in';

export const kpis = [
  { label: 'Occupancy', value: '74%', detail: '+8.2% from last week', tone: 'green', icon: 'occupancy' },
  { label: 'Today’s arrivals', value: '12', detail: '4 rooms ready now', tone: 'blue', icon: 'arrival' },
  { label: 'Today’s departures', value: '8', detail: 'All checkout by 12:00', tone: 'amber', icon: 'departure' },
  { label: 'Est. revenue', value: 'ETB 184,600', detail: '+12.4% vs. yesterday', tone: 'violet', icon: 'revenue' }
];

export const arrivals = [
  { initials: 'MK', name: 'Meron Kebede', room: 'Deluxe Suite · 204', time: '09:30', status: 'Confirmed' as BookingStatus, color: 'rose' },
  { initials: 'DA', name: 'Daniel Abebe', room: 'Executive King · 311', time: '10:15', status: 'Checked in' as BookingStatus, color: 'blue' },
  { initials: 'SA', name: 'Sara Alemu', room: 'Classic Twin · 108', time: '11:00', status: 'Pending' as BookingStatus, color: 'gold' },
  { initials: 'JN', name: 'James Njoroge', room: 'Deluxe Suite · 206', time: '12:45', status: 'Confirmed' as BookingStatus, color: 'green' }
];

export const activities = [
  { title: 'New booking received', detail: 'Liya Tesfaye · Deluxe Suite', time: '12 min ago', type: 'booking' },
  { title: 'Booking confirmed', detail: 'Daniel Abebe · #AZ-20481', time: '38 min ago', type: 'confirmed' },
  { title: 'Meeting inquiry updated', detail: 'Ethiopian Airlines · 60 guests', time: '1 hr ago', type: 'meeting' },
  { title: 'Room marked ready', detail: 'Deluxe Suite · Room 204', time: '2 hrs ago', type: 'room' }
];

export const roomInventory = [
  { name: 'Deluxe Suite', total: 18, occupied: 14, rate: 'ETB 6,500' },
  { name: 'Executive King', total: 12, occupied: 8, rate: 'ETB 5,800' },
  { name: 'Classic Twin', total: 20, occupied: 12, rate: 'ETB 4,200' },
  { name: 'Standard Double', total: 24, occupied: 16, rate: 'ETB 3,500' }
];
