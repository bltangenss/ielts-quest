// Roguelite upgrades offered in the between-room popup (pick 1 of 3).
export const ROGUE_UPGRADES = [
  { id: 'dmg', icon: 'attack', name: 'Power', desc: '+25% damage', color: '#F87171', apply: s => { s.dmgMult *= 1.25; } },
  { id: 'spd', icon: 'speed', name: 'Rapid Fire', desc: '+22% attack speed', color: '#FBBF24', apply: s => { s.fireMult *= 1.22; } },
  { id: 'hp', icon: 'hp', name: 'Vitality', desc: '+35 max HP & heal', color: '#22C55E', apply: s => { s.maxHP += 35; s.hp = Math.min(s.maxHP, s.hp + 35); } },
  { id: 'multishot', icon: 'sparkle', name: 'Multishot', desc: '+1 projectile', color: '#A78BFA', apply: s => { s.shots += 1; } },
  { id: 'pierce', icon: 'right', name: 'Pierce', desc: 'bullets pierce +1 enemy', color: '#7DD3FC', apply: s => { s.pierce += 1; } },
  { id: 'crit', icon: 'target', name: 'Precision', desc: '+15% crit chance', color: '#FB923C', apply: s => { s.crit += 0.15; } },
  { id: 'lifesteal', icon: 'blood', name: 'Lifesteal', desc: '+8% lifesteal', color: '#DC2626', apply: s => { s.lifesteal += 0.08; } },
  { id: 'move', icon: 'bolt', name: 'Agility', desc: '+15% move speed', color: '#34D399', apply: s => { s.moveMult *= 1.15; } },
  { id: 'dash', icon: 'refresh', name: 'Dash', desc: '-25% dash cooldown', color: '#60A5FA', apply: s => { s.dashCdMult *= 0.75; } },
  { id: 'big', icon: 'gem', name: 'Heavy Rounds', desc: '+40% size, +10% damage', color: '#818CF8', apply: s => { s.bulletSize *= 1.4; s.dmgMult *= 1.1; } },
  { id: 'bounce', icon: 'spark', name: 'Ricochet', desc: 'bullets bounce off walls', color: '#F472B6', apply: s => { s.bounce = true; } },
  { id: 'regen', icon: 'hp', name: 'Regeneration', desc: '+1.5 HP/sec', color: '#4ADE80', apply: s => { s.regen += 1.5; } },
];

export function rollUpgrades(n = 3) {
  const pool = [...ROGUE_UPGRADES];
  const out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}
