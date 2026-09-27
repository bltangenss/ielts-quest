import { getCardArt } from '../data/cardArt';

export function CardArt({ card, revealed = true, style = {} }) {
  const art = getCardArt(card?.id);
  if (!art) return null;

  const x = art.columns === 1 ? 0 : (art.column / (art.columns - 1)) * 100;
  const y = art.rows === 1 ? 0 : (art.row / (art.rows - 1)) * 100;

  return (
    <div
      role="img"
      aria-label={revealed ? `${card.name} artwork` : 'Locked card artwork'}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        backgroundImage: `linear-gradient(180deg, transparent 62%, rgba(7,8,20,0.55)), url(${art.atlas})`,
        backgroundSize: `100% 100%, ${art.columns * 100}% ${art.rows * 100}%`,
        backgroundPosition: `center, ${x}% ${y}%`,
        backgroundRepeat: 'no-repeat',
        filter: revealed ? 'saturate(1.05) contrast(1.03)' : 'grayscale(1) brightness(0.28) contrast(1.35)',
        transform: 'translateZ(0)',
        ...style,
      }}
    />
  );
}

