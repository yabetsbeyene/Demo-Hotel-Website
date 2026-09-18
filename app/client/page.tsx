'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Icon } from '@/components/icon';

const rooms = [
  {
    name: 'Classic Twin',
    detail: 'Two beds · 2 guests',
    price: '4,200',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1100&q=85',
    tag: 'Best value',
    description: 'A calm, beautifully proportioned room for easy city stays and restful nights.',
    amenities: ['Twin beds', 'Rain shower', 'Breakfast for two']
  },
  {
    name: 'Executive King',
    detail: 'King bed · City view',
    price: '5,800',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1100&q=85',
    tag: 'Most loved',
    description: 'A generous king room with a considered workspace and wide views over Addis.',
    amenities: ['King bed', 'City view', 'Espresso station']
  },
  {
    name: 'Deluxe Suite',
    detail: 'Lounge · 3 guests',
    price: '6,500',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1100&q=85',
    tag: 'Signature stay',
    description: 'A separate lounge and bedroom made for longer stays, celebrations, and slow mornings.',
    amenities: ['Separate lounge', 'Soaking tub', 'Airport transfer']
  },
  {
    name: 'Garden Terrace',
    detail: 'Private terrace · 2 guests',
    price: '7,200',
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85',
    tag: 'Slow mornings',
    description: 'Open the doors to your own terrace and let the morning light set the pace.',
    amenities: ['Private terrace', 'King bed', 'Garden access']
  },
  {
    name: 'AZ Residence',
    detail: 'Two bedrooms · 5 guests',
    price: '11,800',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85',
    tag: 'For longer stays',
    description: 'A private two-bedroom residence with space to settle in, work, and gather together.',
    amenities: ['Two bedrooms', 'Kitchenette', 'Living room']
  },
  {
    name: 'Presidential Suite',
    detail: 'Panoramic view · 4 guests',
    price: '16,500',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85',
    tag: 'The grand stay',
    description: 'Our most expansive suite, with panoramic city views and room for every special detail.',
    amenities: ['Panoramic view', 'Dining area', 'Private host']
  }
];

const galleryPreview = [
  { label: 'Poolside mornings', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85' },
  { label: 'A table for the evening', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=85' },
  { label: 'The lobby lounge', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85' },
  { label: 'Addis in the morning', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1000&q=85' }
];

const highlights = [
  ['24/7', 'Concierge desk'],
  ['Wi-Fi', 'Across the hotel'],
  ['Bole', 'Prime location']
];

const services = [
  { title: 'Restaurant & Bar', icon: 'restaurant', description: 'Open 24 hours for authentic Ethiopian cuisine, international dishes, and drinks in a warm family atmosphere.', label: 'Taste the city' },
  { title: 'Event & Meeting Rooms', icon: 'meeting', description: 'State-of-the-art spaces for meetings, workshops, and celebrations from 20 to 200 guests, with full AV equipment.', label: 'Gather beautifully' },
  { title: 'Airport Transfer', icon: 'car', description: 'Comfortable 24/7 transportation to and from Hawassa Airport. Book your ride in advance and arrive at ease.', label: 'Arrive with ease' },
  { title: '24/7 Room Service', icon: 'room-service', description: 'Whatever you need, whenever you need it. Our dedicated team is always ready for in-room dining and assistance.', label: 'At your service' },
  { title: 'Spa & Wellness', icon: 'spa', description: 'Refresh with massages, facials, and wellness therapies combining expert care and restorative technology.', label: 'Make time for you' },
  { title: 'Fitness Center', icon: 'fitness', description: 'Keep your routine moving in our fully equipped gym, with city views to make every session feel lighter.', label: 'Move your way' },
  { title: 'Laundry Service', icon: 'laundry', description: 'Freshly pressed linens, perfectly laundered towels, and a thoughtful laundry team for every length of stay.', label: 'Fresh by morning' },
  { title: 'Swimming Pool', icon: 'pool', description: 'Slip into a slower rhythm beside the water, with open skies, comfortable loungers, and space to unwind.', label: 'Take a dip' }
];

const testimonials = [
  { name: 'Maya Thompson', location: 'London, United Kingdom', stay: 'Stayed in the Executive King', quote: 'From the airport pickup to the last coffee, every detail felt warm, thoughtful, and completely effortless.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=85' },
  { name: 'Daniel Okafor', location: 'Lagos, Nigeria', stay: 'Stayed in the Deluxe Suite', quote: 'The suite gave us a quiet place to land after busy days in Addis. The team remembered our names and our breakfast order.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=85' },
  { name: 'Sara Alemu', location: 'Nairobi, Kenya', stay: 'Stayed in the Garden Terrace', quote: 'It feels like a real sense of place, not a hotel that could be anywhere. I left rested and already planning my return.', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=85' },
  { name: 'Elias Morgan', location: 'Toronto, Canada', stay: 'Stayed in the AZ Residence', quote: 'We had space to settle in and a team that made a long stay feel wonderfully easy. The residence became our Addis home.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=85' },
  { name: 'Nadia Hassan', location: 'Cairo, Egypt', stay: 'Stayed in the Classic Twin', quote: 'The food, the light, the calm in the middle of the city. Abebe Zeleke made our weekend feel much longer than it was.', image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=240&q=85' },
  { name: 'Jonas Meyer', location: 'Berlin, Germany', stay: 'Stayed in the Presidential Suite', quote: 'A beautiful base for discovering Addis, with generous hospitality at every turn. The view from the suite was unforgettable.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=85' }
];

export default function ClientPage() {
  const [checkIn, setCheckIn] = useState('2026-10-04');
  const [checkOut, setCheckOut] = useState('2026-10-07');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [companyName, setCompanyName] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(rooms[1]);
  const [roomDetails, setRoomDetails] = useState<typeof rooms[number] | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [message, setMessage] = useState('');

  function handleBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`Thank you${firstName ? `, ${firstName}` : ''}. Your ${selectedRoom.name} request is ready. Our concierge will confirm it shortly.`);
  }

  function chooseRoom(room: typeof rooms[number]) {
    setSelectedRoom(room);
    setRoomDetails(null);
    setBookingOpen(true);
  }

  useEffect(() => {
    if (bookingOpen) {
      requestAnimationFrame(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }));
    }
  }, [bookingOpen]);

  return (
    <div className="hotel-site">
      <header className="hotel-nav">
        <a className="hotel-brand" href="#top" aria-label="Abebe Zeleke Hotel home">
          <span className="hotel-brand-mark">AZ</span>
          <span><strong>Abebe Zeleke</strong><small>International Hotel</small></span>
        </a>
        <nav className="hotel-links" aria-label="Hotel navigation">
          <a href="#rooms">Stay</a>
          <a href="#experience">Experience</a>
          <a href="#services">Services</a>
          <a href="#about">About</a>
          <a href="/client/gallery">Gallery</a>
        </nav>
        <a className="hotel-nav-action" href="#rooms">Book a room <Icon name="arrow" size={15} /></a>
      </header>

      <main id="top">
        <section className="hotel-hero">
          <div className="hotel-hero-overlay" />
          <div className="hotel-hero-content">
            <p className="hotel-eyebrow">Addis Ababa · Ethiopia</p>
            <h1>A quieter way to<br /><em>arrive.</em></h1>
            <p className="hotel-hero-copy">Thoughtful rooms, warm Ethiopian hospitality, and a front-row seat to the energy of Bole.</p>
            <a className="hotel-hero-button" href="#rooms">Plan your stay <Icon name="arrow" size={17} /></a>
          </div>
          <div className="hotel-hero-note"><span className="hero-line" /> <span>Since 1998 · Made for meaningful stays</span></div>
          <a className="hero-scroll" href="#rooms" aria-label="Scroll to rooms">Scroll to explore <span>↓</span></a>
        </section>

        {bookingOpen && <section className="booking-strip" id="booking">
          <div className="booking-intro"><span className="booking-dot" /><div><strong>Complete booking</strong><small>Room: {selectedRoom.name} · ETB {selectedRoom.price} / night</small></div></div>
          <form className="booking-form complete-booking-form" onSubmit={handleBooking}>
            <div className="booking-form-grid">
              <label>First name *<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} placeholder="Your first name" /></label>
              <label>Last name *<input required value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Your last name" /></label>
              <label>Email *<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
              <label>Phone *<input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+251 ..." /></label>
              <label>Check-in *<input required type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} /></label>
              <label>Check-out *<input required type="date" value={checkOut} onChange={(event) => setCheckOut(event.target.value)} /></label>
              <label>Adults<select value={adults} onChange={(event) => setAdults(event.target.value)}><option value="1">1 adult</option><option value="2">2 adults</option><option value="3">3 adults</option><option value="4">4 adults</option></select></label>
              <label>Children<select value={children} onChange={(event) => setChildren(event.target.value)}><option value="0">No children</option><option value="1">1 child</option><option value="2">2 children</option><option value="3">3 children</option></select></label>
              <label>Company name<input value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="Optional" /></label>
              <label className="booking-request">Special requests<textarea value={specialRequests} onChange={(event) => setSpecialRequests(event.target.value)} placeholder="Tell us anything that would make your stay better" rows={3} /></label>
            </div>
            <button className="booking-submit" type="submit">Request this stay <Icon name="arrow" size={16} /></button>
          </form>
        </section>}

        <section className="hotel-section" id="rooms">
          <div className="section-heading"><div><p className="hotel-eyebrow">Stay your way</p><h2>Rooms with room<br /><em>to breathe.</em></h2></div><p>Every detail is considered for deep rest, easy mornings, and the kind of welcome that stays with you.</p></div>
          <div className="room-cards">
            {rooms.map((room) => <article className={`stay-card ${selectedRoom.name === room.name ? 'selected' : ''}`} key={room.name}>
              <button className="stay-image" type="button" onClick={() => setRoomDetails(room)} style={{ backgroundImage: `url(${room.image})` }} aria-label={`View details for ${room.name}`}><span>{room.tag}</span><span className="stay-arrow"><Icon name="arrow" size={17} /></span></button>
              <div className="stay-card-body"><div><h3>{room.name}</h3><p>{room.detail}</p></div><strong><small>from</small> ETB {room.price}<i>/ night</i></strong></div>
              <button className="stay-select" type="button" onClick={() => setRoomDetails(room)}>View room details <Icon name="arrow" size={14} /></button>
            </article>)}
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="experience-photo" />
          <div className="experience-copy"><p className="hotel-eyebrow">The AZ feeling</p><h2>Good days begin<br /><em>gently.</em></h2><p>Start with coffee and a sunrise over the city. Come home to cool linens, local flavors, and a team who remembers how you take your tea.</p><a className="text-arrow" href="#concierge">Discover the experience <Icon name="arrow" size={16} /></a></div>
        </section>

        <section className="services-section" id="services">
          <div className="services-heading"><div><p className="hotel-eyebrow">What we offer</p><h2>Everything you need,<br /><em>beautifully handled.</em></h2></div><p>From the first coffee to the last swim, our services are designed to make your time at Abebe Zeleke feel effortless.</p></div>
          <div className="service-grid">{services.map((service, index) => <article className={`service-card ${index === services.length - 1 ? 'service-card-featured' : ''}`} key={service.title}><div className="service-icon"><Icon name={service.icon} size={22} /></div><p className="service-label">{service.label}</p><h3>{service.title}</h3><p>{service.description}</p><a href="#rooms" aria-label={`Ask about ${service.title}`}>Explore service <Icon name="arrow" size={14} /></a></article>)}</div>
        </section>

        <section className="hotel-section essentials-section" id="concierge">
          <div className="section-heading compact"><div><p className="hotel-eyebrow">A little more</p><h2>The essentials,<br /><em>beautifully handled.</em></h2></div></div>
          <div className="highlight-grid">{highlights.map(([title, detail]) => <a className="highlight" href="#rooms" key={title}><strong>{title}</strong><span>{detail}</span><Icon name="arrow" size={15} /></a>)}</div>
        </section>

        <section className="testimonials-section" id="stories">
          <div className="testimonials-heading"><div><p className="hotel-eyebrow">Words from the house</p><h2>They stayed.<br /><em>They remember.</em></h2></div><p>A few notes from guests who found a little more than a room in the heart of Addis.</p></div>
          <div className="testimonial-grid">{testimonials.map((testimonial) => <article className="testimonial-card" key={testimonial.name}><div className="testimonial-top"><span className="testimonial-quote"><Icon name="quote" size={18} /></span><span className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</span></div><blockquote>“{testimonial.quote}”</blockquote><div className="testimonial-person"><span className="testimonial-avatar" style={{ backgroundImage: `url(${testimonial.image})` }} /><span><strong>{testimonial.name}</strong><small>{testimonial.location}</small><em>{testimonial.stay}</em></span></div></article>)}</div>
        </section>

        <section className="about-section" id="about">
          <div className="about-image" />
          <div className="about-copy"><p className="hotel-eyebrow">A sense of place</p><h2>Rooted in Addis.<br /><em>Open to the world.</em></h2><p>Abebe Zeleke is a small pause in a lively city. Since 1998, we have welcomed curious travelers, familiar faces, and every in-between with a distinctly Ethiopian warmth.</p><a className="text-arrow" href="#location">Meet us in Bole <Icon name="arrow" size={16} /></a></div>
        </section>

        <section className="gallery-preview hotel-section" id="gallery">
          <div className="section-heading"><div><p className="hotel-eyebrow">See the stay</p><h2>A glimpse of<br /><em>Abebe Zeleke.</em></h2></div><a className="text-arrow" href="/client/gallery">View full gallery <Icon name="arrow" size={16} /></a></div>
          <div className="gallery-mosaic">{galleryPreview.map((item) => <a className="gallery-tile" href="/client/gallery" key={item.label} style={{ backgroundImage: `url(${item.image})` }}><span>{item.label}</span></a>)}</div>
        </section>

        <section className="location-section" id="location">
          <div className="location-copy"><p className="hotel-eyebrow">Find your way here</p><h2>Close to the city.<br /><em>Far from ordinary.</em></h2><p>In the heart of Bole, twenty minutes from Bole International Airport and close to the city&apos;s best cafés, galleries, and restaurants.</p><a className="text-arrow" href="https://maps.google.com/?q=Bole+Addis+Ababa" target="_blank" rel="noreferrer">Open in maps <Icon name="arrow" size={16} /></a></div><div className="location-map"><span className="map-pin">AZ</span><span className="map-label">Bole · Addis Ababa</span></div>
        </section>
      </main>

      <footer className="hotel-footer">
        <div className="footer-main"><a className="hotel-brand" href="#top"><span className="hotel-brand-mark">AZ</span><span><strong>Abebe Zeleke</strong><small>International Hotel</small></span></a><p>Thoughtful stays in the heart of Addis Ababa.</p><a className="footer-book" href="#rooms">Make a reservation <Icon name="arrow" size={15} /></a></div>
        <div className="footer-columns"><div><strong>Explore</strong><a href="#about">About us</a><a href="/client/gallery">Gallery</a><a href="#rooms">Rooms & suites</a></div><div><strong>Visit</strong><span>Bole, Addis Ababa</span><span>Open every day</span><a href="https://maps.google.com/?q=Bole+Addis+Ababa" target="_blank" rel="noreferrer">Get directions</a></div><div><strong>Contact</strong><a href="tel:+251116620000">+251 11 662 0000</a><a href="mailto:stay@abebelezeke.com">stay@abebelezeke.com</a><a href="#concierge">Ask our concierge</a></div></div>
        <div className="footer-bottom"><span>© 2026 Abebe Zeleke International Hotel</span><span>Made with care in Addis Ababa</span></div>
      </footer>
      {roomDetails && <div className="room-detail-backdrop" role="presentation" onClick={() => setRoomDetails(null)}>
        <section className="room-detail-panel" role="dialog" aria-modal="true" aria-labelledby="room-detail-title" onClick={(event) => event.stopPropagation()}>
          <button className="room-detail-close" type="button" onClick={() => setRoomDetails(null)} aria-label="Close room details">×</button>
          <div className="room-detail-image" style={{ backgroundImage: `url(${roomDetails.image})` }} />
          <div className="room-detail-copy"><p className="hotel-eyebrow">{roomDetails.tag}</p><h2 id="room-detail-title">{roomDetails.name}</h2><p>{roomDetails.description}</p><div className="room-amenities">{roomDetails.amenities.map((amenity) => <span key={amenity}>{amenity}</span>)}</div><div className="room-detail-footer"><strong>ETB {roomDetails.price}<small>/ night</small></strong><button className="booking-submit" type="button" onClick={() => chooseRoom(roomDetails)}>Book now <Icon name="arrow" size={16} /></button></div></div>
        </section>
      </div>}
      {message && <button className="booking-toast" type="button" onClick={() => setMessage('')}>{message}<span>×</span></button>}
    </div>
  );
}
