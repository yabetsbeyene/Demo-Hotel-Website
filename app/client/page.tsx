import Link from 'next/link';
import { Icon } from '@/components/icon';

const stay = {
  hotel: 'Abebe Zeleke International Hotel',
  room: 'Deluxe Suite',
  confirmation: 'AZ-20481',
  dates: '24 - 27 October 2026',
  nights: '3 nights',
  guests: '2 guests',
  arrival: 'Saturday, 24 October',
  departure: 'Tuesday, 27 October'
};

const itinerary = [
  { date: '24', month: 'OCT', title: 'Check-in', detail: 'From 14:00 · Front desk', active: true },
  { date: '25', month: 'OCT', title: 'Your stay', detail: 'Breakfast included · 07:00 - 10:30', active: false },
  { date: '27', month: 'OCT', title: 'Check-out', detail: 'Before 12:00 · We hope to see you again', active: false }
];

export default function ClientDashboard() {
  return <div className="client-portal">
    <aside className="client-sidebar">
      <Link href="/client" className="client-brand"><span className="client-brand-mark">AZ</span><span><strong>Abebe Zeleke</strong><small>Guest portal</small></span></Link>
      <nav className="client-nav" aria-label="Guest navigation">
        <Link className="client-nav-item active" href="/client"><Icon name="grid" size={17} /> Overview</Link>
        <Link className="client-nav-item" href="#reservation"><Icon name="calendar" size={17} /> My reservation</Link>
        <Link className="client-nav-item" href="#itinerary"><Icon name="bed" size={17} /> Stay details</Link>
        <Link className="client-nav-item" href="#concierge"><Icon name="meeting" size={17} /> Concierge</Link>
      </nav>
      <div className="client-sidebar-footer"><div className="client-help-mark">?</div><div><strong>Need a hand?</strong><span>Our team is here 24/7</span></div><Icon name="arrow" size={15} /></div>
    </aside>

    <main className="client-main">
      <header className="client-topbar"><div className="client-mobile-brand"><span className="client-brand-mark">AZ</span><strong>Guest portal</strong></div><div className="client-topbar-actions"><button className="client-icon-button" aria-label="Notifications"><Icon name="bell" size={18} /><i /></button><div className="client-profile"><div className="client-avatar">MK</div><span>Meron Kebede</span><Icon name="more" size={16} /></div></div></header>
      <div className="client-content">
        <div className="client-welcome"><div><p className="eyebrow">Your guest dashboard</p><h1>Welcome back, Meron<span>.</span></h1><p className="lede">Everything you need for a relaxed stay, in one place.</p></div><button className="client-outline-button"><Icon name="meeting" size={16} /> Contact hotel</button></div>

        <section className="client-hero" id="reservation"><div className="client-hero-art"><div className="client-sun" /><div className="client-horizon" /><span className="client-location"><Icon name="grid" size={13} /> Addis Ababa · Ethiopia</span><span className="client-hero-caption">A quiet welcome awaits.</span></div><div className="client-hero-info"><div className="client-hero-top"><span className="client-confirmed"><i /> Confirmed reservation</span><span className="client-code">{stay.confirmation}</span></div><div><p className="client-kicker">Your next stay</p><h2>{stay.room}</h2><p className="client-hero-hotel">{stay.hotel}</p></div><div className="client-stay-meta"><div><span>DATES</span><strong>{stay.dates}</strong><small>{stay.nights}</small></div><div><span>GUESTS</span><strong>{stay.guests}</strong><small>1 room</small></div></div><div className="client-hero-actions"><button className="client-primary-button">Manage reservation <Icon name="arrow" size={16} /></button><button className="client-quiet-button" aria-label="More reservation actions"><Icon name="more" size={18} /></button></div></div></section>

        <div className="client-grid">
          <section className="client-panel" id="itinerary"><div className="client-panel-heading"><div><p className="client-section-label">Your itinerary</p><h2>Make yourself at home</h2></div><button className="client-text-button">View details <Icon name="arrow" size={14} /></button></div><div className="client-timeline">{itinerary.map((item) => <div className={`client-timeline-item ${item.active ? 'active' : ''}`} key={item.title}><div className="client-date"><strong>{item.date}</strong><span>{item.month}</span></div><div className="client-timeline-line" /><div className="client-timeline-copy"><strong>{item.title}</strong><span>{item.detail}</span></div>{item.active && <span className="client-today">Next up</span>}</div>)}</div></section>
          <section className="client-panel client-preferences"><div className="client-panel-heading"><div><p className="client-section-label">Before you arrive</p><h2>Set the mood</h2></div><Icon name="settings" size={18} /></div><div className="client-preference-row"><div className="client-preference-icon"><Icon name="bed" size={16} /></div><div><strong>Room preferences</strong><span>Tell us how you like to stay</span></div><Icon name="arrow" size={15} /></div><div className="client-preference-row"><div className="client-preference-icon warm"><Icon name="meeting" size={16} /></div><div><strong>Airport transfer</strong><span>Arrive with ease from Bole Airport</span></div><Icon name="arrow" size={15} /></div><div className="client-preference-row"><div className="client-preference-icon blue"><Icon name="calendar" size={16} /></div><div><strong>Book an experience</strong><span>Explore dining, wellness, and more</span></div><Icon name="arrow" size={15} /></div></section>
        </div>

        <section className="client-concierge" id="concierge"><div><p className="client-section-label">The personal touch</p><h2>Our concierge is ready.</h2><p>From a table for two to a car across the city, send us a note and we will take care of the details.</p></div><button className="client-primary-button">Ask the concierge <Icon name="arrow" size={16} /></button></section>
        <footer className="client-footer"><span>Abebe Zeleke International Hotel</span><span>© 2026 · Addis Ababa, Ethiopia</span></footer>
      </div>
    </main>
  </div>;
}
