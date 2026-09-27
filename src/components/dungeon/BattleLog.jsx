import { useEffect, useRef } from 'react';

export function BattleLog({ entries = [] }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  const last8 = entries.slice(-8);

  return (
    <div style={{
      background: '#0D1117',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 8,
      padding: '0.5rem 0.75rem',
      height: 140,
      overflowY: 'auto',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.7rem',
    }}>
      {entries.length === 0 ? (
        <div style={{ color: '#4B5563', textAlign: 'center', paddingTop: 40 }}>Battle log will appear here</div>
      ) : (
        entries.map((entry, i) => {
          const isRecent = i >= entries.length - 3;
          const isGood = entry.includes('heal') || entry.includes('shield') || entry.includes('Victory') || entry.includes('correct') || entry.includes('bonus');
          const isBad = entry.includes('damage') || entry.includes('Defeat') || entry.includes('wrong');
          const color = isGood ? '#3FB950' : isBad ? '#F85149' : '#8B949E';
          return (
            <div key={i} style={{
              color: isRecent ? (isGood ? '#3FB950' : isBad ? '#F85149' : '#C9D1D9') : color,
              opacity: isRecent ? 1 : 0.6,
              marginBottom: 2,
              lineHeight: 1.4,
            }}>
              {entry}
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}
