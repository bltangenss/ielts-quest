import { Link } from 'react-router-dom';
import { Icon } from '../Icon';

export function RunStats({ run }) {
  if (!run) return null;
  const hpPct = (run.playerHP / run.playerMaxHP) * 100;
  const hpColor = hpPct > 60 ? '#3FB950' : hpPct > 30 ? '#F59E0B' : '#F85149';

  return (
    <div style={{
      background: 'rgba(13,17,23,0.95)',
      borderBottom: '1px solid rgba(124,58,237,0.25)',
      padding: '0.5rem 1.25rem',
      display: 'flex', alignItems: 'center', gap: '1.5rem',
      flexWrap: 'wrap', fontSize: '0.8rem',
    }}>
      {/* Floor */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color: '#A78BFA', display: 'grid', placeItems: 'center' }}><Icon name="castle" size={14} /></span>
        <span style={{ color: '#A78BFA', fontFamily: 'Cinzel', fontWeight: 700 }}>
          Floor {run.floor}/3
        </span>
      </div>

      {/* HP bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: hpColor, display: 'grid', placeItems: 'center' }}><Icon name="hp" size={14} /></span>
        <div style={{ width: 90 }}>
          <div style={{ background: '#1F2937', borderRadius: 3, height: 8, overflow: 'hidden' }}>
            <div style={{
              width: `${hpPct}%`, height: '100%',
              background: hpColor,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
        <span style={{ fontFamily: 'JetBrains Mono', color: hpColor, fontWeight: 700 }}>
          {run.playerHP}/{run.playerMaxHP}
        </span>
      </div>

      {/* Gold */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: '#F59E0B', display: 'grid', placeItems: 'center' }}><Icon name="gold" size={14} /></span>
        <span style={{ fontFamily: 'JetBrains Mono', color: '#F59E0B', fontWeight: 700 }}>
          {run.gold}
        </span>
      </div>

      {/* Relics */}
      {run.relics && run.relics.length > 0 && (
        <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {run.relics.map((r, i) => (
            <span key={i} style={{
              background: 'rgba(124,58,237,0.2)',
              border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: 4, padding: '3px 5px',
              color: '#C4B5FD', display: 'grid', placeItems: 'center',
            }} title={r}>
              <Icon glyph={r.split('|')[0]} size={14} />
            </span>
          ))}
        </div>
      )}

      {/* Cards mini */}
      <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
        {run.selectedCards?.map((card, i) => (
          <div key={i} style={{
            width: 24, height: 32,
            background: '#161B22',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.8rem', title: card.name,
            color: '#C9D1D9',
          }} title={card.name}>
            <Icon glyph={card.artEmoji} name={card.artEmoji ? undefined : 'sparkle'} size={14} />
          </div>
        ))}
      </div>

      {/* Back to map */}
      <Link to="/dungeon/map" style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        color: '#8B949E', fontSize: '0.7rem', textDecoration: 'none',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 4, padding: '3px 8px',
      }}>
        <Icon name="globe" size={13} /> Map
      </Link>
    </div>
  );
}
