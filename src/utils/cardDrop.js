import { CARDS } from '../data/cards';

const CHEST_DROP_RATES = {
  bronze:    { common: 0.70, uncommon: 0.25, rare: 0.05, epic: 0,    legendary: 0    },
  silver:    { common: 0.40, uncommon: 0.35, rare: 0.20, epic: 0.05, legendary: 0    },
  gold:      { common: 0.15, uncommon: 0.30, rare: 0.35, epic: 0.18, legendary: 0.02 },
  legendary: { common: 0,    uncommon: 0.10, rare: 0.30, epic: 0.45, legendary: 0.15 },
};

const CHEST_CARD_COUNT = { bronze: 1, silver: 1, gold: 2, legendary: 3 };
const CHEST_DUST_BONUS = { bronze: 0, silver: 50, gold: 150, legendary: 500 };

function pickRarity(chestType) {
  const rates = CHEST_DROP_RATES[chestType];
  const roll = Math.random();
  let cumulative = 0;
  const order = ['legendary', 'epic', 'rare', 'uncommon', 'common'];
  // Build from lowest to highest to keep correct probability
  let cum = 0;
  cum += rates.common;    if (roll < cum) return 'common';
  cum += rates.uncommon;  if (roll < cum) return 'uncommon';
  cum += rates.rare;      if (roll < cum) return 'rare';
  cum += rates.epic;      if (roll < cum) return 'epic';
  return 'legendary';
}

function pickCardOfRarity(rarity) {
  const pool = CARDS.filter(c => c.rarity === rarity);
  if (pool.length === 0) {
    // Fallback — shouldn't happen with correct data
    return CARDS[Math.floor(Math.random() * CARDS.length)];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}

export function openChest(chestType) {
  const cardCount = CHEST_CARD_COUNT[chestType] || 1;
  const dustBonus = CHEST_DUST_BONUS[chestType] || 0;
  const cards = [];

  for (let i = 0; i < cardCount; i++) {
    const rarity = pickRarity(chestType);
    const card = pickCardOfRarity(rarity);
    cards.push(card);
  }

  return { cards, dustBonus };
}

export function getChestRarityLabel(chestType) {
  const rates = CHEST_DROP_RATES[chestType];
  return rates;
}

export const CHEST_INFO = {
  bronze: {
    name: 'Bronze Chest',
    emoji: '📦',
    color: '#CD7F32',
    bgColor: 'rgba(205, 127, 50, 0.15)',
    borderColor: 'rgba(205, 127, 50, 0.5)',
    description: 'Earned for every 5 correct answers',
    cardCount: 1,
    dustBonus: 0,
  },
  silver: {
    name: 'Silver Chest',
    emoji: '🎁',
    color: '#C0C0C0',
    bgColor: 'rgba(192, 192, 192, 0.15)',
    borderColor: 'rgba(192, 192, 192, 0.5)',
    description: 'Earned for completing a module level',
    cardCount: 1,
    dustBonus: 50,
  },
  gold: {
    name: 'Gold Chest',
    emoji: '🏆',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    description: 'Earned for a 7-day streak',
    cardCount: 2,
    dustBonus: 150,
  },
  legendary: {
    name: 'Legendary Chest',
    emoji: '⚜️',
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: 'rgba(124, 58, 237, 0.5)',
    description: 'Earned for reaching a new band score milestone',
    cardCount: 3,
    dustBonus: 500,
  },
};
