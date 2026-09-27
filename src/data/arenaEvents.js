export const ARENA_EVENTS = [
  {
    id: "ancient_shrine", title: "Ancient Shrine", emoji: "⛩️",
    description: "A glowing shrine pulses with ancient energy. Your creatures feel drawn to it.",
    choices: [
      { text: "Offer gold (20)", outcome: "The shrine blesses your team. All creatures heal 20 HP.", effect: "team_heal", value: 20, cost: 20 },
      { text: "Ignore it", outcome: "Nothing happens.", effect: "nothing", value: 0 },
    ],
  },
  {
    id: "wandering_blacksmith", title: "Wandering Blacksmith", emoji: "⚒️",
    description: "A dwarf blacksmith offers to upgrade your team's defense.",
    choices: [
      { text: "Pay 25 gold", outcome: "All creatures gain +15 DEF for this run.", effect: "team_def_boost", value: 15, cost: 25 },
      { text: "Decline", outcome: "Nothing happens.", effect: "nothing", value: 0 },
    ],
  },
  {
    id: "blood_pact", title: "Blood Pact Altar", emoji: "🩸",
    description: "A dark altar offers power at a price.",
    choices: [
      { text: "Accept (lose 30 HP, gain +20 ATK this run)", outcome: "Pain brings power.", effect: "hp_for_atk", value: 30, cost: 0 },
      { text: "Refuse", outcome: "You walk away.", effect: "nothing", value: 0 },
    ],
  },
  {
    id: "dragon_egg", title: "Abandoned Dragon Egg", emoji: "🥚",
    description: "A warm dragon egg lies unguarded. It hums with latent power.",
    choices: [
      { text: "Take it (sell for 30 gold)", outcome: "You trade the egg to a passing merchant.", effect: "gold", value: 30, cost: 0 },
      { text: "Warm it (heal team 25 HP)", outcome: "The egg's warmth restores your team.", effect: "team_heal", value: 25, cost: 0 },
    ],
  },
  {
    id: "cursed_treasure", title: "Cursed Treasure", emoji: "💰",
    description: "A glittering hoard of gold sits behind a sinister glyph.",
    choices: [
      { text: "Grab the gold (curse risk)", outcome: "Gold... but at what cost?", effect: "cursed_gold", value: 40, cost: 0 },
      { text: "Leave it be", outcome: "Wisdom over greed.", effect: "nothing", value: 0 },
    ],
  },
  {
    id: "mysterious_merchant", title: "Mysterious Merchant", emoji: "🎭",
    description: "A hooded figure offers a mystery potion for a fair price.",
    choices: [
      { text: "Buy potion (15 gold)", outcome: "The potion's effect is unpredictable...", effect: "mystery_potion", value: 25, cost: 15 },
      { text: "Walk past", outcome: "The merchant vanishes into mist.", effect: "nothing", value: 0 },
    ],
  },
  {
    id: "abandoned_warrior", title: "Abandoned Warrior", emoji: "🗡️",
    description: "A dying warrior offers his blade to one worthy.",
    choices: [
      { text: "Accept the blade (+12 ATK this run)", outcome: "His strength lives on in you.", effect: "team_atk_boost", value: 12, cost: 0 },
      { text: "Give him a proper rest", outcome: "You honor him. +20 gold found nearby.", effect: "gold", value: 20, cost: 0 },
    ],
  },
  {
    id: "ancient_weapon", title: "Ancient Weapon Rack", emoji: "⚔️",
    description: "Forgotten weapons of legendary heroes hang here.",
    choices: [
      { text: "Take a weapon (40 gold cost, +18 ATK)", outcome: "A weapon of legend is yours.", effect: "team_atk_boost", value: 18, cost: 40 },
      { text: "Too risky", outcome: "You leave the relics undisturbed.", effect: "nothing", value: 0 },
    ],
  },
  {
    id: "magical_spring", title: "Magical Spring", emoji: "💧",
    description: "Crystal-clear water glows with restorative magic.",
    choices: [
      { text: "Drink deeply", outcome: "Your team is fully refreshed. Heal 40 HP all.", effect: "team_heal", value: 40, cost: 0 },
      { text: "Bottle it (sell, +15 gold)", outcome: "Liquid magic fetches a good price.", effect: "gold", value: 15, cost: 0 },
    ],
  },
  {
    id: "shadow_portal", title: "Shadow Portal", emoji: "🌀",
    description: "A swirling portal offers a shortcut — or a trap.",
    choices: [
      { text: "Step through (gold or harm)", outcome: "The void decides your fate...", effect: "portal_gamble", value: 35, cost: 0 },
      { text: "Take the safe path", outcome: "You walk around it carefully.", effect: "nothing", value: 0 },
    ],
  },
];

export function getRandomArenaEvent() {
  return ARENA_EVENTS[Math.floor(Math.random() * ARENA_EVENTS.length)];
}
