import Link from 'next/link';
import { AdminShell } from '@/components/admin-shell';
import { Icon } from '@/components/icon';

const bookings = [
  ['AZ-20481', 'Meron Kebede', 'Deluxe Suite', '12 Sep — 15 Sep', '2 guests', 'Confirmed'],
  ['AZ-20480', 'Daniel Abebe', 'Executive King', '13 Sep — 16 Sep', '1 guest', 'Checked in'],
  ['AZ-20479', 'Sara Alemu', 'Classic Twin', '13 Sep — 15 Sep', '2 guests', 'Pending'],
  ['AZ-20478', 'James Njoroge', 'Deluxe Suite', '13 Sep — 18 Sep', '3 guests', 'Confirmed'],
  ['AZ-20477', 'Liya Tesfaye', 'Standard Double', '14 Sep — 16 Sep', '2 guests', 'Pending']
];

export default function BookingsPage() { return <AdminShell><div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">Reservations</p><h1>Bookings<span>.</span></h1><p className="lede">Track arrivals, stays, and guest requests in one place.</p></div><Link href="/admin/bookings?new=true" className="primary-button"><Icon name="plus" size={17} /> New booking</Link></div><section className="panel table-panel"><div className="table-toolbar"><div className="filter-tabs"><button className="filter active">All bookings <b>28</b></button><button className="filter">Pending <b>5</b></button><button className="filter">Confirmed <b>19</b></button></div><div className="table-actions"><button className="secondary-button"><Icon name="calendar" size={15} /> Date range</button><button className="secondary-button"><Icon name="search" size={15} /> Search</button></div></div><div className="table-scroll"><table><thead><tr><th>Booking</th><th>Guest</th><th>Room type</th><th>Stay dates</th><th>Guests</th><th>Status</th><th /></tr></thead><tbody>{bookings.map((booking) => <tr key={booking[0]}><td><strong className="booking-code">{booking[0]}</strong></td><td>{booking[1]}</td><td>{booking[2]}</td><td>{booking[3]}</td><td>{booking[4]}</td><td><span className={`status ${booking[5].toLowerCase().replace(' ', '-')}`}>{booking[5]}</span></td><td><button className="row-more" aria-label={`Actions for ${booking[0]}`}><Icon name="more" size={16} /></button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing 5 of 28 bookings</span><div><button className="pagination disabled">←</button><button className="pagination active">1</button><button className="pagination">2</button><button className="pagination">3</button><button className="pagination">→</button></div></div></section></div></AdminShell> }
