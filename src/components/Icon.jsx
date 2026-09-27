// ════════════════════════════════════════════════════════════════════
// Icon — a single line-icon set that replaces emoji "stickers" across the UI.
// Usage:
//   <Icon name="gold" size={16} />          explicit icon
//   <Icon glyph={item.icon} size={16} />    resolve a data emoji → icon
// Colour is inherited via `currentColor`, so wrap in a coloured span/parent.
// Unmapped glyphs fall back to a neutral spark so no emoji ever leaks through.
// ════════════════════════════════════════════════════════════════════

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
const F = { fill: 'currentColor', stroke: 'none' };

// Each entry returns the inner SVG markup for a 24×24 viewBox.
const ICONS = {
  // ─ economy / stats ─
  gold:    <><circle cx="12" cy="12" r="8" {...S} /><path d="M9.5 9.5h3.2a1.8 1.8 0 0 1 0 3.6H9.5h3.4a1.8 1.8 0 0 1 0 3.6H9.2M12 7.6v1.9M12 16.7v1.7" {...S} /></>,
  attack:  <><path d="M14.5 4 20 4l0 5.5L9 20.5 5 20.5 5 16.5z" {...S} /><path d="m6.5 17.5 1.5 1.5M14.5 9.5 11 13" {...S} /></>,
  defense: <><path d="M12 3.5 19 6v5c0 4.4-3 7.6-7 9.5-4-1.9-7-5.1-7-9.5V6z" {...S} /><path d="m9 11.5 2 2 4-4.5" {...S} /></>,
  speed:   <><path d="M13 3 5 13.5h5l-1 7.5 8-10.5h-5z" {...S} /></>,
  hp:      <><path d="M12 20.5C6 16.5 4 12.8 4 9.6 4 6.9 6 5 8.4 5c1.7 0 2.9.9 3.6 2 .7-1.1 1.9-2 3.6-2C18 5 20 6.9 20 9.6c0 3.2-2 6.9-8 10.9z" {...S} /></>,
  fire:    <><path d="M12 3c.6 2.6-1.4 3.8-1.4 5.8a2.5 2.5 0 0 0 5 0c0-.9-.2-1.7-.7-2.5C16.7 8 18 10.6 18 13a6 6 0 0 1-12 0c0-2.6 1.7-5.2 3.7-7 0 1.7 1 2.6 2 2.7-1.2-1.8.5-4 .3-5.7z" {...S} /></>,
  crown:   <><path d="M4 8.5 7 14h10l3-5.5-4 2.5-4-5-4 5z" {...S} /><path d="M7 17h10" {...S} /></>,
  skull:   <><path d="M12 3a8 8 0 0 0-8 8c0 2.7 1.4 4.5 3 5.5V19h10v-2.5c1.6-1 3-2.8 3-5.5a8 8 0 0 0-8-8z" {...S} /><circle cx="9" cy="11.5" r="1.6" {...F} /><circle cx="15" cy="11.5" r="1.6" {...F} /><path d="M11 19v-2M13 19v-2" {...S} /></>,
  star:    <><path d="M12 3.5 14.6 9l6 .7-4.5 4 1.3 5.9L12 16.7 6.6 19.6 7.9 13.7 3.4 9.7l6-.7z" {...S} /></>,
  check:   <><path d="M5 12.5 10 17.5 19 7" {...S} /></>,
  cross:   <><path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" {...S} /></>,
  sparkle: <><path d="M12 3.5c.8 4.4 1.6 5.2 6 6-4.4.8-5.2 1.6-6 6-.8-4.4-1.6-5.2-6-6 4.4-.8 5.2-1.6 6-6z" {...S} /></>,
  trophy:  <><path d="M7 4.5h10v4a5 5 0 0 1-10 0z" {...S} /><path d="M7 6H4.5v1.5A3 3 0 0 0 7 10.4M17 6h2.5v1.5A3 3 0 0 1 17 10.4M12 13.5V17M8.5 20h7M9.5 20l.5-3h4l.5 3" {...S} /></>,
  gift:    <><rect x="4.5" y="9" width="15" height="4" rx="1" {...S} /><path d="M6 13v7h12v-7M12 9v11" {...S} /><path d="M12 9C12 6.5 10.5 5 9 5a2 2 0 0 0 0 4zM12 9c0-2.5 1.5-4 3-4a2 2 0 0 1 0 4z" {...S} /></>,
  box:     <><path d="M12 3.5 20 7.5v9L12 20.5 4 16.5v-9z" {...S} /><path d="M4 7.5 12 11.5 20 7.5M12 11.5V20.5" {...S} /></>,
  cart:    <><path d="M4 5h2l2 10h9l2-7H7" {...S} /><circle cx="9.5" cy="19" r="1.3" {...F} /><circle cx="16.5" cy="19" r="1.3" {...F} /></>,
  gem:     <><path d="M7 4h10l3 5-8 11L4 9z" {...S} /><path d="M4 9h16M9 4 7 9l5 11M15 4l2 5-5 11" {...S} /></>,
  book:    <><path d="M5 4.5h9a2 2 0 0 1 2 2V20a2 2 0 0 0-2-2H5z" {...S} /><path d="M19 4.5h-3a2 2 0 0 0-2 2V20a2 2 0 0 1 2-2h3z" {...S} /></>,
  hourglass: <><path d="M7 4h10M7 20h10M8 4c0 4 8 4 8 8s-8 4-8 8M16 4c0 4-8 4-8 8s8 4 8 8" {...S} /></>,
  warning: <><path d="M12 4 21 19H3z" {...S} /><path d="M12 10v4" {...S} /><circle cx="12" cy="16.5" r="0.6" {...F} /></>,
  search:  <><circle cx="11" cy="11" r="6" {...S} /><path d="m16 16 4 4" {...S} /></>,
  orb:     <><circle cx="12" cy="12" r="7.5" {...S} /><path d="M12 4.5c2.5 2 2.5 13 0 15M12 4.5c-2.5 2-2.5 13 0 15M4.5 12h15" {...S} /></>,
  castle:  <><path d="M4 20V9l2 1.5V7l2 1.5V7l2-2 2 2V8.5L14 7v3.5L16 9v11z" {...S} /><path d="M4 20h12M9 20v-4h2v4" {...S} /></>,
  globe:   <><circle cx="12" cy="12" r="8" {...S} /><path d="M4 12h16M12 4c2.5 2.2 2.5 13.8 0 16M12 4c-2.5 2.2-2.5 13.8 0 16" {...S} /></>,
  water:   <><path d="M12 3.5c4 4.5 6 7.5 6 10a6 6 0 0 1-12 0c0-2.5 2-5.5 6-10z" {...S} /></>,
  snow:    <><path d="M12 3v18M5 7.5 19 16.5M19 7.5 5 16.5" {...S} /><path d="M12 6.5 9.5 5M12 6.5 14.5 5M12 17.5 9.5 19M12 17.5 14.5 19" {...S} /></>,
  blood:   <><path d="M12 4c3 3.5 4.5 5.8 4.5 8a4.5 4.5 0 0 1-9 0c0-2.2 1.5-4.5 4.5-8z" {...S} /></>,
  target:  <><circle cx="12" cy="12" r="7.5" {...S} /><circle cx="12" cy="12" r="3.5" {...S} /><circle cx="12" cy="12" r="0.6" {...F} /></>,
  potion:  <><path d="M10 3.5h4M10.5 3.5v4l-3 8a3 3 0 0 0 2.8 4.1h3.4A3 3 0 0 0 16.5 15.5l-3-8v-4" {...S} /><path d="M8.2 13h7.6" {...S} /></>,
  scroll:  <><path d="M6 5.5h9v11a3 3 0 0 1-3 3H6a3 3 0 0 0 3-3v-11" {...S} /><path d="M15 5.5h3v2a1.5 1.5 0 0 1-3 0M8 9h5M8 12h5" {...S} /></>,
  bolt:    <><path d="M13 3 5 13.5h5l-1 7.5 8-10.5h-5z" {...S} /></>,
  monster: <><path d="M5 13a7 7 0 0 1 14 0v6l-2.5-1.5L14 19l-2-1.5L10 19l-2.5-1.5L5 19z" {...S} /><circle cx="9.5" cy="11.5" r="1.4" {...F} /><circle cx="14.5" cy="11.5" r="1.4" {...F} /></>,
  leaf:    <><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" {...S} /><path d="M5 19 14 10" {...S} /></>,
  moon:    <><path d="M15 4a8 8 0 1 0 5 8 6 6 0 0 1-5-8z" {...S} /></>,
  camp:    <><path d="M12 4 4 19h16zM12 4 8 19M12 4l4 15" {...S} /></>,
  stone:   <><path d="M6 18 4 11l4-5 6-1 5 4-1 8z" {...S} /></>,
  // ─ navigation / arrows ─
  up:      <><path d="M6 14 12 8 18 14" {...S} /></>,
  down:    <><path d="M6 10 12 16 18 10" {...S} /></>,
  left:    <><path d="M14 6 8 12 14 18" {...S} /></>,
  right:   <><path d="M10 6 16 12 10 18" {...S} /></>,
  play:    <><path d="M8 5.5 18 12 8 18.5z" {...S} /></>,
  refresh: <><path d="M5 12a7 7 0 0 1 12-5l2 2M19 12a7 7 0 0 1-12 5l-2-2" {...S} /><path d="M19 4v3h-3M5 20v-3h3" {...S} /></>,
  lock:    <><rect x="5.5" y="11" width="13" height="9" rx="2" {...S} /><path d="M8 11V8a4 4 0 0 1 8 0v3" {...S} /></>,
  clock:   <><circle cx="12" cy="12" r="8" {...S} /><path d="M12 7.5V12l3 2" {...S} /></>,
  chat:    <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v6A2.5 2.5 0 0 1 17.5 15H9l-5 4z" {...S} /></>,
  question: <><circle cx="12" cy="12" r="8.5" {...S} /><path d="M9.5 9.5a2.5 2.5 0 0 1 4.5 1.5c0 1.8-2 1.8-2 3.5" {...S} /><circle cx="12" cy="17" r="0.6" {...F} /></>,
  eye:     <><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6z" {...S} /><circle cx="12" cy="12" r="2.5" {...S} /></>,
  spark:   <><path d="M12 4v6M12 14v6M4 12h6M14 12h6" {...S} /></>,
};

// Map raw emoji glyphs → icon names. Anything not listed falls back to `spark`.
const GLYPH_TO_NAME = {
  '💰': 'gold', '🪙': 'gold', '💵': 'gold',
  '⚔': 'attack', '⚔️': 'attack', '🗡': 'attack', '🗡️': 'attack', '⚒': 'attack', '🔪': 'attack',
  '🛡': 'defense', '🛡️': 'defense', '⛊': 'defense',
  '⚡': 'speed', '🌩': 'speed',
  '❤': 'hp', '❤️': 'hp', '♥': 'hp', '💚': 'hp', '💗': 'hp', '💖': 'hp',
  '🔥': 'fire', '👑': 'crown', '👸': 'crown', '🤴': 'crown',
  '💀': 'skull', '☠': 'skull', '☠️': 'skull', '⚰': 'skull', '⚰️': 'skull', '🪦': 'skull',
  '★': 'star', '⭐': 'star', '🌟': 'star', '✦': 'sparkle', '✧': 'sparkle', '✨': 'sparkle', '💫': 'sparkle', '🌠': 'sparkle',
  '✓': 'check', '✔': 'check', '✔️': 'check', '✅': 'check', '☑': 'check',
  '✗': 'cross', '✘': 'cross', '❌': 'cross', '⛔': 'cross',
  '🏆': 'trophy', '🥇': 'trophy', '🥈': 'trophy', '🥉': 'trophy', '🏅': 'trophy', '🎖': 'trophy',
  '🎁': 'gift', '📦': 'box', '🛒': 'cart', '🛍': 'cart',
  '⚜': 'crown', '⚜️': 'crown',
  '💎': 'gem', '💍': 'gem',
  '📚': 'book', '📖': 'book', '📘': 'book', '📕': 'book',
  '📜': 'scroll', '📃': 'scroll', '📄': 'scroll',
  '⏳': 'hourglass', '⌛': 'hourglass', '⏱': 'clock', '⏰': 'clock', '🕐': 'clock',
  '⚠': 'warning', '⚠️': 'warning', '🚩': 'warning', '❗': 'warning',
  '🔍': 'search', '🔎': 'search',
  '🔮': 'orb', '🪬': 'orb', '🧿': 'orb',
  '🏰': 'castle', '🏛': 'castle', '🏯': 'castle',
  '🌍': 'globe', '🌎': 'globe', '🌐': 'globe', '🌌': 'globe', '🗺': 'globe',
  '🌊': 'water', '💧': 'water', '💦': 'water',
  '❄': 'snow', '❄️': 'snow', '☃': 'snow', '⛄': 'snow',
  '🩸': 'blood',
  '🎯': 'target', '🧪': 'potion', '⚗': 'potion',
  '⚙': 'refresh', '🔄': 'refresh', '🔁': 'refresh', '🔀': 'refresh', '↺': 'refresh', '♻': 'refresh',
  '🔒': 'lock', '🔐': 'lock', '🔓': 'lock',
  '💬': 'chat', '💭': 'chat',
  '❓': 'question', '❔': 'question', '🤔': 'question',
  '👁': 'eye', '👁️': 'eye', '🔭': 'eye',
  '▶': 'play', '▶️': 'play', '⏩': 'play',
  '⬆': 'up', '⬆️': 'up', '▲': 'up', '🔼': 'up', '↑': 'up',
  '⬇': 'down', '⬇️': 'down', '▼': 'down', '🔽': 'down', '↓': 'down',
  '⬅': 'left', '⬅️': 'left', '◀': 'left', '←': 'left',
  '➡': 'right', '➡️': 'right', '→': 'right',
  // nature / biomes
  '🌳': 'leaf', '🌲': 'leaf', '🌿': 'leaf', '🍃': 'leaf', '🪶': 'leaf',
  '🌑': 'moon', '🌒': 'moon', '🌙': 'moon', '🌚': 'moon',
  '🏕': 'camp', '⛺': 'camp', '🔺': 'camp',
  '🗿': 'stone', '🪨': 'stone', '⛰': 'stone', '🏔': 'stone',
  // creatures shown as text → generic monster mark (sprite keys in data are untouched)
  '🐺': 'monster', '🐍': 'monster', '🦅': 'monster', '🐉': 'monster', '🐲': 'monster',
  '🤖': 'monster', '🧙': 'monster', '🧚': 'monster', '👹': 'monster', '👺': 'monster',
  '👻': 'monster', '🥷': 'monster', '🦷': 'monster', '🦇': 'monster', '🦉': 'monster',
  '🦁': 'monster', '🦊': 'monster', '🦎': 'monster', '🦀': 'monster', '🐱': 'monster',
  '🧌': 'monster', '🧛': 'monster', '🧟': 'monster', '😈': 'monster', '👁': 'eye',
  '🃏': 'sparkle', '🎭': 'sparkle', '🎵': 'sparkle', '🌵': 'leaf', '🥚': 'gem',
};

export function Icon({ name, glyph, size = 18, strokeWidth, color, style, className, title }) {
  const resolved = name || (glyph != null ? GLYPH_TO_NAME[glyph.trim?.() ?? glyph] : null) || 'spark';
  const body = ICONS[resolved] || ICONS.spark;
  const sw = strokeWidth != null ? { '--isw': strokeWidth } : null;
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size} aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, color, ...sw, ...style }}
    >
      {title ? <title>{title}</title> : null}
      {body}
    </svg>
  );
}

export default Icon;
