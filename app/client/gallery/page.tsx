import Link from 'next/link';
import { Icon } from '@/components/icon';

const gallery = [
  { title: 'The first welcome', category: 'Arrival', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=88' },
  { title: 'Blue hour', category: 'Pool & garden', image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1400&q=88' },
  { title: 'A room to exhale', category: 'Suites', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=88' },
  { title: 'Morning light', category: 'Rooms', image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=88' },
  { title: 'Dinner, slowly', category: 'Dining', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=88' },
  { title: 'A quiet corner', category: 'Lounge', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=88' },
  { title: 'Addis beyond', category: 'The neighbourhood', image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1400&q=88' },
  { title: 'Details that stay', category: 'The AZ feeling', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=88' }
];

export default function GalleryPage() {
  return (
    <div className="hotel-site gallery-page">
      <header className="hotel-nav">
        <Link className="hotel-brand" href="/client" aria-label="Abebe Zeleke Hotel home"><span className="hotel-brand-mark">AZ</span><span><strong>Abebe Zeleke</strong><small>International Hotel</small></span></Link>
        <nav className="hotel-links" aria-label="Hotel navigation"><Link href="/client#rooms">Stay</Link><Link href="/client#experience">Experience</Link><Link href="/client#about">About</Link><Link className="active" href="/client/gallery">Gallery</Link></nav>
        <Link className="hotel-nav-action" href="/client#rooms">Book a room <Icon name="arrow" size={15} /></Link>
      </header>

      <main>
        <section className="gallery-hero"><div className="gallery-hero-content"><p className="hotel-eyebrow">A visual diary</p><h1>Come in.<br /><em>Stay awhile.</em></h1><p>Spaces for slow mornings, long conversations, and the little details that make a stay feel like yours.</p></div></section>
        <section className="gallery-page-content">
          <div className="gallery-page-heading"><div><p className="hotel-eyebrow">Abebe Zeleke in frames</p><h2>The house,<br /><em>as it feels.</em></h2></div><p>From the first cup of coffee to the last city light, take a closer look at the places and moments waiting for you in Bole.</p></div>
          <div className="gallery-grid-large">{gallery.map((item, index) => <a className={`gallery-large-tile tile-${index + 1}`} href={item.image} target="_blank" rel="noreferrer" key={item.title} style={{ backgroundImage: `url(${item.image})` }}><span><small>{item.category}</small><strong>{item.title}</strong></span></a>)}</div>
        </section>
        <section className="gallery-cta"><p className="hotel-eyebrow">Ready when you are</p><h2>Make the picture<br /><em>your own.</em></h2><Link className="hotel-hero-button" href="/client#rooms">Plan your stay <Icon name="arrow" size={17} /></Link></section>
      </main>

      <footer className="hotel-footer gallery-footer"><div className="footer-main"><Link className="hotel-brand" href="/client"><span className="hotel-brand-mark">AZ</span><span><strong>Abebe Zeleke</strong><small>International Hotel</small></span></Link><p>Thoughtful stays in the heart of Addis Ababa.</p><Link className="footer-book" href="/client#rooms">Make a reservation <Icon name="arrow" size={15} /></Link></div><div className="footer-bottom"><span>© 2026 Abebe Zeleke International Hotel</span><span><Link href="/client">Back to home</Link></span></div></footer>
    </div>
  );
}
