const paths: Record<string, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  calendar: <><rect x="3" y="4.5" width="18" height="17" rx="2" /><path d="M16 2.5v4M8 2.5v4M3 9.5h18" /></>,
  bed: <><path d="M3 19v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8M3 16h18M7 9V6.5A1.5 1.5 0 0 1 8.5 5h3A1.5 1.5 0 0 1 13 6.5V9" /></>,
  meeting: <><path d="M4 20V8l8-4 8 4v12M2 20h20M8 20v-5h8v5M12 8v2" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-4.5-4.5L7 20" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.4v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.7v-2.4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h2.4v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" /></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  trend: <><path d="m4 16 5-5 4 3 7-8" /><path d="M15 6h5v5" /></>,
  more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>
  ,restaurant: <><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c2 2 3 4 3 7h-3" /></>,
  car: <><path d="m5 16 1.5-6h11L19 16M4 16h16v4H4zM7 20v1M17 20v1M7 16h.01M17 16h.01" /></>,
  'room-service': <><path d="M4 20h16M6 20v-8h12v8M9 12V8h6v4M12 8V4M9 4h6" /></>,
  spa: <><path d="M12 21c0-7 3-11 8-14-1 8-4 12-8 14ZM12 21c0-5-2-9-7-12 0 7 3 11 7 12ZM12 21V9" /></>,
  fitness: <><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12" /></>,
  laundry: <><circle cx="12" cy="13" r="4" /><path d="M4 5h16v15H4zM7 8h.01M10 8h.01" /></>,
  pool: <><path d="M3 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 3 2M3 12c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2 2 2 3 2M8 9V4h8v5M11 4v5M13 4v5" /></>
  ,quote: <><path d="M6 17H3v-3c0-3.3 1.7-5.5 5-6.5M15 17h-3v-3c0-3.3 1.7-5.5 5-6.5" /></>
};

export function Icon({ name, size = 18 }: { name: string; size?: number }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name] ?? paths.grid}</svg>;
}
