// Maps card ieltsDomain → Arena creature type
export const DOMAIN_TO_TYPE = {
  reading: 'Arcane',
  listening: 'Wind',
  vocabulary: 'Poison',
  grammar: 'Iron',
  universal: 'Void',
};

export const TYPE_COLORS = {
  Arcane: '#7C3AED',
  Wind: '#06B6D4',
  Poison: '#16A34A',
  Iron: '#9CA3AF',
  Void: '#F59E0B',
};

export const TYPE_ICONS = {
  Arcane: '🔮',
  Wind: '🌪️',
  Poison: '☠️',
  Iron: '⚙️',
  Void: '🌌',
};

// Returns the 4 abilities for a creature of a given type.
// atk = creature's attack stat. legendary boosts values by 50%.
export function getAbilitiesForType(type, atk, isLegendary = false) {
  const mult = isLegendary ? 1.5 : 1;
  const A = (v) => Math.round(atk * v * mult);

  const basic = {
    slot: 1, name: 'Strike', mpCost: 0,
    description: 'A basic attack.',
    damage: A(1), target: 'single', effect: null, selfEffect: null,
  };

  const byType = {
    Arcane: [
      { slot: 2, name: 'Arcane Bolt', mpCost: 1, description: 'Deal 1.5× ATK + Silence 1.', damage: A(1.5), target: 'single', effect: { type: 'silence', stacks: 1, turns: 2 } },
      { slot: 3, name: 'Mana Surge', mpCost: 2, description: 'Deal 2.5× ATK, lose 5 HP.', damage: A(2.5), target: 'single', selfDamage: 5 },
      { slot: 4, name: 'Arcane Annihilation', mpCost: 4, description: 'Deal 4× ATK + Silence 2.', damage: A(4), target: 'single', effect: { type: 'silence', stacks: 2, turns: 2 } },
    ],
    Wind: [
      { slot: 2, name: 'Gust Strike', mpCost: 1, description: 'Deal ATK + gain Haste.', damage: A(1), target: 'single', selfEffect: { type: 'enrage', stacks: 1, turns: 1 } },
      { slot: 3, name: 'Tornado', mpCost: 2, description: 'Deal 2× ATK + Stun 1.', damage: A(2), target: 'single', effect: { type: 'stun', stacks: 1, turns: 1 } },
      { slot: 4, name: 'Eye of the Storm', mpCost: 4, description: 'Deal 3× ATK to all + dodge.', damage: A(3), target: 'all', selfEffect: { type: 'shield', stacks: 30, turns: 1 } },
    ],
    Poison: [
      { slot: 2, name: 'Venom Bite', mpCost: 1, description: 'Deal 0.8× ATK + Poison 2.', damage: A(0.8), target: 'single', effect: { type: 'poison', stacks: 2, turns: 3 } },
      { slot: 3, name: 'Plague Cloud', mpCost: 2, description: 'Poison 3 to all enemies.', damage: 0, target: 'all', effect: { type: 'poison', stacks: 3, turns: 3 } },
      { slot: 4, name: 'Death Bloom', mpCost: 4, description: 'Deal 3× ATK + Poison 5.', damage: A(3), target: 'single', effect: { type: 'poison', stacks: 5, turns: 3 } },
    ],
    Iron: [
      { slot: 2, name: 'Iron Wall', mpCost: 1, description: 'Gain shield + 0.5× ATK.', damage: A(0.5), target: 'single', selfEffect: { type: 'shield', stacks: 0, turns: 1, useDef: 0.5 } },
      { slot: 3, name: 'Shatter Strike', mpCost: 2, description: 'Deal 2× ATK + break DEF.', damage: A(2), target: 'single', effect: { type: 'defbreak', stacks: 30, turns: 2 } },
      { slot: 4, name: 'Fortress Mode', mpCost: 4, description: 'Massive shield + ATK.', damage: A(1), target: 'single', selfEffect: { type: 'shield', stacks: 0, turns: 2, useDef: 2 } },
    ],
    Void: [
      { slot: 2, name: 'Void Slash', mpCost: 1, description: 'Deal 1.2× ATK to all.', damage: A(1.2), target: 'all', effect: null },
      { slot: 3, name: 'Event Horizon', mpCost: 2, description: '1.5× ATK to all + drain MP.', damage: A(1.5), target: 'all', drainMP: 1 },
      { slot: 4, name: 'Singularity', mpCost: 4, description: '2× ATK all + all statuses.', damage: A(2), target: 'all', effect: { type: 'multi', stacks: 1, turns: 2 } },
    ],
  };

  return [basic, ...(byType[type] || byType.Void)];
}

export const STATUS_INFO = {
  burn:    { icon: '🔥', name: 'Burn', color: '#F97316', desc: '5 dmg/turn' },
  freeze:  { icon: '❄️', name: 'Freeze', color: '#06B6D4', desc: 'Skip turn' },
  poison:  { icon: '☠️', name: 'Poison', color: '#16A34A', desc: 'stacks×2 dmg/turn' },
  stun:    { icon: '⚡', name: 'Stun', color: '#FBBF24', desc: '50% skip' },
  shield:  { icon: '🛡️', name: 'Shield', color: '#BAE6FD', desc: 'absorbs dmg' },
  enrage:  { icon: '😡', name: 'Enrage', color: '#DC2626', desc: '+50% ATK' },
  regen:   { icon: '💚', name: 'Regen', color: '#22C55E', desc: 'heal 8/turn' },
  silence: { icon: '🤫', name: 'Silence', color: '#A78BFA', desc: 'no abilities' },
  defbreak:{ icon: '💥', name: 'DEF Break', color: '#F59E0B', desc: '-DEF' },
};
