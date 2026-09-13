'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from './icon';

const primaryNav = [
  { label: 'Overview', href: '/admin', icon: 'grid' },
  { label: 'Bookings', href: '/admin/bookings', icon: 'calendar', badge: '12' },
  { label: 'Room inventory', href: '/admin/rooms', icon: 'bed' },
  { label: 'Meetings & events', href: '/admin/meetings', icon: 'meeting', badge: '3' },
  { label: 'Gallery', href: '/admin/gallery', icon: 'image' }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">AZ</div>
          <div><strong>Abebe Zeleke</strong><span>International Hotel</span></div>
        </div>
        <div className="workspace-label">OPERATIONS CONSOLE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {primaryNav.map((item) => {
            const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return <Link className={`nav-item ${active ? 'active' : ''}`} href={item.href} key={item.href}><Icon name={item.icon} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</Link>;
          })}
        </nav>
        <div className="sidebar-rule" />
        <div className="workspace-label">MANAGE</div>
        <nav className="side-nav">
          <Link className="nav-item" href="/admin/settings"><Icon name="settings" /><span>Settings</span></Link>
        </nav>
        <div className="sidebar-footer"><div className="status-dot" /> <span>System operational</span></div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="mobile-brand"><div className="brand-mark">AZ</div><strong>AZ Hotel</strong></div>
          <div className="topbar-search"><Icon name="search" size={17} /><input aria-label="Search bookings, guests, rooms" placeholder="Search bookings, guests, rooms..." /><span>⌘ K</span></div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Notifications"><Icon name="bell" /><i /></button><div className="profile"><div className="avatar">BM</div><div><strong>Bethel M.</strong><span>Administrator</span></div><Icon name="more" size={16} /></div></div>
        </header>
        {children}
      </main>
    </div>
  );
}
