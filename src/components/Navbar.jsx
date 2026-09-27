import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../hooks/useUser';

export function Navbar() {
  const location = useLocation();
  const { profile, getTotalChests } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalChests = getTotalChests();
  const xpPct = Math.min(100, (profile.xp / profile.xpToNext) * 100);

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/learn', label: 'Learn' },
    { to: '/collection', label: 'Collection' },
    { to: '/dungeon', label: 'Dungeon' },
    { to: '/game', label: 'Arena', accent: true },
    { to: '/evolution', label: 'Evolution' },
    { to: '/profile', label: 'Profile' },
  ];
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav style={{
      background: 'rgba(255,255,255,0.78)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100, padding: '0 1.5rem',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Wordmark */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg, var(--iris), var(--grape))', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-iris)' }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: '#fff', transform: 'rotate(45deg)' }} />
          </span>
          <span className="font-display" style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--ink)' }}>
            IELTS<span className="aurora-text"> Quest</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }} className="hidden-mobile">
          {links.map(({ to, label, accent }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none', fontSize: '0.85rem', fontWeight: active ? 700 : 500,
                color: active ? '#fff' : accent ? 'var(--blossom)' : 'var(--slate)',
                padding: '0.45rem 0.85rem', borderRadius: 10,
                background: active ? 'linear-gradient(100deg, var(--iris), var(--grape))' : 'transparent',
                boxShadow: active ? 'var(--shadow-iris)' : 'none',
                transition: 'color .15s, background .15s',
              }}>{label}</Link>
            );
          })}
        </div>

        {/* Right stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }} className="hidden-mobile">
          <Link to="/chest" title="Chests" style={{ textDecoration: 'none', position: 'relative', display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 10, background: 'var(--mist)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8.5 12 4l9 4.5V17l-9 4-9-4V8.5Z" stroke="var(--iris)" strokeWidth="1.8" strokeLinejoin="round"/><path d="M3 8.5 12 13l9-4.5M12 13v8" stroke="var(--iris)" strokeWidth="1.5"/></svg>
            {totalChests > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--blossom)', color: '#fff', borderRadius: 99, minWidth: 16, height: 16, padding: '0 4px', display: 'grid', placeItems: 'center', fontSize: '0.6rem', fontWeight: 800 }}>{totalChests}</span>}
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--mist)', borderRadius: 10, padding: '5px 10px' }} title="Day streak">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--sun)"><path d="M12 2c1 3-1 4-1 6a3 3 0 0 0 6 0c0-1 0-2-.5-3 2 2 3.5 4.5 3.5 7a8 8 0 1 1-16 0c0-3 2-6 4-8 0 2 1 3 2 3-1-2 1-4 2-5Z"/></svg>
            <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--ink)', fontWeight: 700 }}>{profile.streak}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: 'linear-gradient(135deg, var(--iris), var(--grape))', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 800, fontSize: '0.78rem', boxShadow: 'var(--shadow-iris)' }} className="font-mono">{profile.level}</div>
            <div style={{ width: 84 }}>
              <div style={{ background: 'var(--mist)', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                <div style={{ width: `${xpPct}%`, height: '100%', background: 'linear-gradient(90deg, var(--iris), var(--blossom))', borderRadius: 99, transition: 'width .5s ease' }} />
              </div>
              <div className="font-mono" style={{ textAlign: 'right', fontSize: '0.55rem', color: 'var(--slate)', marginTop: 2 }}>{profile.xp}/{profile.xpToNext} XP</div>
            </div>
          </div>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
          style={{ background: 'var(--mist)', border: 'none', borderRadius: 10, color: 'var(--ink)', cursor: 'pointer', display: 'none', width: 38, height: 38 }} className="show-mobile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{menuOpen ? <path d="M6 6l12 12M18 6 6 18"/> : <path d="M4 7h16M4 12h16M4 17h16"/>}</svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {links.map(({ to, label, accent }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)} style={{
              color: isActive(to) ? 'var(--iris)' : accent ? 'var(--blossom)' : 'var(--ink)',
              textDecoration: 'none', fontWeight: isActive(to) ? 700 : 500, padding: '0.6rem 1rem', borderRadius: 10,
              background: isActive(to) ? 'rgba(109,94,246,0.10)' : 'transparent',
            }}>{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) { .hidden-mobile { display: none !important; } .show-mobile { display: grid !important; place-items: center; } }
        @media (min-width: 861px) { .show-mobile { display: none !important; } }
      `}</style>
    </nav>
  );
}
