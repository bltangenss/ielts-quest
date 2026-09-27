export const ARENA_WEAPONS = [
  {
    id: 'shadow_kunai',
    name: 'Shadow Kunai',
    glyph: 'K',
    color: '#F87171',
    fireBase: 0.28,
    speed: 260,
    damage: 0.82,
    shots: 2,
    spread: 0.16,
    pierce: 1,
    size: 2.8,
    life: 1.55,
  },
  {
    id: 'volt_edge',
    name: 'Volt Edge',
    glyph: 'V',
    color: '#C4B5FD',
    fireBase: 0.24,
    speed: 285,
    damage: 0.74,
    shots: 2,
    spread: 0.12,
    pierce: 0,
    size: 2.7,
    life: 1.45,
  },
  {
    id: 'burst_pistol',
    name: 'Burst Pistol',
    glyph: 'B',
    color: '#FBBF24',
    fireBase: 0.36,
    speed: 230,
    damage: 0.72,
    shots: 3,
    spread: 0.26,
    pierce: 0,
    size: 2.55,
    life: 1.65,
  },
  {
    id: 'rail_lance',
    name: 'Rail Lance',
    glyph: 'R',
    color: '#7DD3FC',
    fireBase: 0.62,
    speed: 360,
    damage: 1.85,
    shots: 1,
    spread: 0,
    pierce: 3,
    size: 3.1,
    life: 1.35,
  },
  {
    id: 'prism_staff',
    name: 'Prism Staff',
    glyph: 'P',
    color: '#A78BFA',
    fireBase: 0.42,
    speed: 220,
    damage: 1.02,
    shots: 4,
    spread: 0.32,
    pierce: 1,
    size: 2.5,
    life: 1.85,
  },
  {
    id: 'cinder_cannon',
    name: 'Cinder Cannon',
    glyph: 'C',
    color: '#FB923C',
    fireBase: 0.72,
    speed: 185,
    damage: 2.25,
    shots: 1,
    spread: 0,
    pierce: 0,
    size: 4.4,
    life: 2.0,
  },
];

export function starterWeaponFor(heroId) {
  if (heroId === 'kage_severed') return ARENA_WEAPONS.find(w => w.id === 'shadow_kunai');
  if (heroId === 'raiden_ronin') return ARENA_WEAPONS.find(w => w.id === 'volt_edge');
  return ARENA_WEAPONS.find(w => w.id === 'burst_pistol');
}

export function rollWeaponDrop(roomIndex = 0, guaranteed = false) {
  const unlocked = ARENA_WEAPONS.filter((_, index) => guaranteed || index <= 2 + Math.floor(roomIndex / 3));
  return unlocked[Math.floor(Math.random() * unlocked.length)] || ARENA_WEAPONS[0];
}
