import { AdminShell } from '@/components/admin-shell';
import { Icon } from '@/components/icon';

const categories = [['Exterior', '12 images'], ['Rooms', '28 images'], ['Restaurant', '16 images'], ['Gym & spa', '9 images'], ['Meeting hall', '11 images']];

export default function GalleryPage() { return <AdminShell><div className="page-wrap"><div className="page-heading"><div><p className="eyebrow">Content library</p><h1>Gallery<span>.</span></h1><p className="lede">Keep the hotel’s visual story organized and ready to publish.</p></div><button className="primary-button"><Icon name="plus" size={17} /> Upload images</button></div><div className="gallery-grid">{categories.map(([name, count], index) => <section className={`gallery-card gallery-${index}`} key={name}><div className="gallery-visual"><Icon name="image" size={30} /><span>{count}</span></div><div className="gallery-card-footer"><strong>{name}</strong><Icon name="arrow" size={15} /></div></section>)}</div><p className="demo-note"><span>Demo data</span> — image metadata will be managed in <code>gallery_images</code>.</p></div></AdminShell> }
