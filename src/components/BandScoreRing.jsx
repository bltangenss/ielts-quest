import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function BandScoreRing({ score = 4.0, size = 200 }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 200);
  }, []);

  const radius = (size / 2) - 18;
  const circumference = 2 * Math.PI * radius;
  const maxScore = 9.0;
  const minScore = 4.0;
  const normalizedScore = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));
  const strokeDash = circumference * normalizedScore;

  const getColor = (s) => {
    if (s >= 8) return '#F59E0B';
    if (s >= 7) return '#6D5EF6';
    if (s >= 6) return '#3B82F6';
    if (s >= 5) return '#3FB950';
    return '#6A6F9C';
  };

  const color = getColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 10px ${color}66)` }}>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(34,26,91,0.05)"
          strokeWidth={10}
        />
        {/* Tick marks */}
        {[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((tick) => {
          const pct = (tick - 4) / 5;
          const angle = (pct * 360 - 90) * (Math.PI / 180);
          const x1 = size / 2 + (radius - 8) * Math.cos(angle);
          const y1 = size / 2 + (radius - 8) * Math.sin(angle);
          const x2 = size / 2 + (radius + 4) * Math.cos(angle);
          const y2 = size / 2 + (radius + 4) * Math.sin(angle);
          return (
            <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={tick % 1 === 0 ? '#4B5563' : '#2D3748'}
              strokeWidth={tick % 1 === 0 ? 2 : 1}
            />
          );
        })}
        {/* Progress arc */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference - strokeDash : circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      {/* Center text */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: 700,
          fontSize: size > 160 ? '2.5rem' : '1.8rem',
          color,
          lineHeight: 1,
        }}>
          {score.toFixed(1)}
        </div>
        <div style={{
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: size > 160 ? '0.6rem' : '0.5rem',
          color: '#6A6F9C',
          marginTop: 4,
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}>
          Band Score
        </div>
      </div>
    </div>
  );
}
