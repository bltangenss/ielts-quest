export const DUNGEON_EVENTS = [
  {
    id: "ancient_tome",
    title: "Ancient Tome",
    emoji: "📖",
    description: "You discover a glowing tome on a pedestal. Its pages flicker with strange energy.",
    choices: [
      { text: "Read it carefully", outcome: "You absorb forbidden knowledge. +15 gold.", effect: "gold", value: 15 },
      { text: "Slam it shut", outcome: "The glow fades. Nothing happens.", effect: "nothing", value: 0 }
    ]
  },
  {
    id: "wounded_traveler",
    title: "Wounded Traveler",
    emoji: "🧑‍🦯",
    description: "A wounded traveler blocks your path, begging for help.",
    choices: [
      { text: "Help them (+20 gold reward)", outcome: "They thank you with a pouch of gold.", effect: "gold", value: 20 },
      { text: "Ignore them", outcome: "You step around them. Nothing changes.", effect: "nothing", value: 0 }
    ]
  },
  {
    id: "cursed_fountain",
    title: "Cursed Fountain",
    emoji: "⛲",
    description: "A shimmering fountain stands before you. The water glows faintly purple.",
    choices: [
      { text: "Drink (risky — heal or harm)", outcome: "The water's effect washes over you.", effect: "fountain_risk", value: 20 },
      { text: "Move on", outcome: "The fountain's light fades behind you.", effect: "nothing", value: 0 }
    ]
  },
  {
    id: "mysterious_shrine",
    title: "Mysterious Shrine",
    emoji: "🗿",
    description: "An obsidian shrine hums with dark energy. An inscription reads: 'Pay tribute, gain strength.'",
    choices: [
      { text: "Offer gold (costs 10 gold, gain 20 HP)", outcome: "The shrine accepts your offering. You feel invigorated.", effect: "paid_heal", value: 20 },
      { text: "Smash it", outcome: "The shrine shatters, showering you with 8 gold.", effect: "gold", value: 8 }
    ]
  },
  {
    id: "abandoned_camp",
    title: "Abandoned Camp",
    emoji: "🏕️",
    description: "You stumble upon a hastily abandoned camp. Supplies are scattered everywhere.",
    choices: [
      { text: "Search the camp (+12 gold, maybe more)", outcome: "You find a cache of supplies worth gold.", effect: "gold", value: 12 },
      { text: "Rest here (+15 HP)", outcome: "You take a short rest, recovering some wounds.", effect: "heal", value: 15 }
    ]
  },
  {
    id: "ghostly_merchant",
    title: "Ghostly Merchant",
    emoji: "👻",
    description: "A translucent merchant floats toward you, offering wares from beyond the grave.",
    choices: [
      { text: "Buy mysterious vial (costs 8 gold, +25 HP)", outcome: "The vial's contents restore your vitality.", effect: "paid_heal", value: 25 },
      { text: "Refuse and walk away", outcome: "The merchant fades with a disappointed groan.", effect: "nothing", value: 0 }
    ]
  },
  {
    id: "trapped_chest",
    title: "Trapped Chest",
    emoji: "🎁",
    description: "A glittering chest rests in the centre of the room. Surely it's not trapped... right?",
    choices: [
      { text: "Open it boldly", outcome: "You either find gold or trigger the trap!", effect: "trap_gamble", value: 25 },
      { text: "Check for traps first (+5 gold safe find)", outcome: "You carefully disarm it and take the modest reward.", effect: "gold", value: 5 }
    ]
  },
  {
    id: "dark_altar",
    title: "Dark Altar",
    emoji: "🕯️",
    description: "Black candles surround an altar stained with ancient ichor. Power radiates from it.",
    choices: [
      { text: "Sacrifice HP for gold (-20 HP, +30 gold)", outcome: "The altar cuts your hand, but fills your purse.", effect: "paid_gold", value: 30 },
      { text: "Pray for guidance (+10 HP)", outcome: "A faint light blesses you with healing.", effect: "heal", value: 10 }
    ]
  },
  {
    id: "wandering_wizard",
    title: "Wandering Wizard",
    emoji: "🧙",
    description: "A frail old wizard sits cross-legged in the corridor, muttering equations.",
    choices: [
      { text: "Listen to his lesson (+15 HP blessing)", outcome: "His wisdom imbues you with protective energy.", effect: "heal", value: 15 },
      { text: "Give him gold (costs 5 gold, +25 HP)", outcome: "Grateful, he heals your wounds thoroughly.", effect: "paid_heal", value: 25 }
    ]
  },
  {
    id: "poison_pond",
    title: "Poison Pond",
    emoji: "☠️",
    description: "A murky pond blocks the path. Crossing it will cost you, but the shortcut saves time.",
    choices: [
      { text: "Wade through (-15 HP, skip one node)", outcome: "The poison burns, but you press forward.", effect: "damage", value: 15 },
      { text: "Go around (nothing, safe path)", outcome: "You take the longer path. No harm done.", effect: "nothing", value: 0 }
    ]
  },
];

export function getRandomEvent() {
  return DUNGEON_EVENTS[Math.floor(Math.random() * DUNGEON_EVENTS.length)];
}
