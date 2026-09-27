import { useState, useCallback, useEffect } from 'react';
import { getCardById } from '../data/cards';

const DEFAULT_COLLECTION = {
  cards: [],
  dustAmount: 0,
  totalCardsObtained: 0,
};

const COLLECTION_EVENT = 'ieltsquest:collection-changed';

function loadCollection() {
  try {
    const raw = localStorage.getItem('ieltsquest_cards');
    if (raw) return { ...DEFAULT_COLLECTION, ...JSON.parse(raw) };
  } catch {
    // Ignore malformed legacy storage and start with a clean collection.
  }
  return { ...DEFAULT_COLLECTION };
}

function saveCollection(col) {
  localStorage.setItem('ieltsquest_cards', JSON.stringify(col));
  queueMicrotask(() => window.dispatchEvent(new CustomEvent(COLLECTION_EVENT, { detail: col })));
}

const DUST_BY_RARITY = { common: 5, uncommon: 15, rare: 40, epic: 100, legendary: 400 };

export function useCards() {
  const [collection, setCollectionState] = useState(() => loadCollection());

  useEffect(() => {
    const syncCollection = (event) => setCollectionState(event.detail || loadCollection());
    const syncStorage = (event) => {
      if (event.key === 'ieltsquest_cards') setCollectionState(loadCollection());
    };
    window.addEventListener(COLLECTION_EVENT, syncCollection);
    window.addEventListener('storage', syncStorage);
    return () => {
      window.removeEventListener(COLLECTION_EVENT, syncCollection);
      window.removeEventListener('storage', syncStorage);
    };
  }, []);

  const setCollection = useCallback((updater) => {
    setCollectionState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveCollection(next);
      return next;
    });
  }, []);

  // Returns { card, isDuplicate, dustGained }
  const addCard = useCallback((cardId) => {
    let result = { isDuplicate: false, dustGained: 0, card: null };
    setCollection(prev => {
      const masterCard = getCardById(cardId);
      if (!masterCard) return prev;
      result.card = masterCard;

      const existing = prev.cards.find(c => c.cardId === cardId);
      if (existing) {
        // It's a duplicate
        const dust = DUST_BY_RARITY[masterCard.rarity] || 5;
        result.isDuplicate = true;
        result.dustGained = dust;
        return {
          ...prev,
          dustAmount: prev.dustAmount + dust,
          totalCardsObtained: prev.totalCardsObtained + 1,
          cards: prev.cards.map(c =>
            c.cardId === cardId ? { ...c, duplicateCount: (c.duplicateCount || 0) + 1 } : c
          ),
        };
      }

      // New card
      const newInstance = {
        instanceId: `${cardId}_${Date.now()}`,
        cardId,
        evolutionLevel: 0,
        obtainedDate: new Date().toISOString(),
        isDuplicate: false,
        duplicateCount: 0,
      };
      return {
        ...prev,
        cards: [...prev.cards, newInstance],
        totalCardsObtained: prev.totalCardsObtained + 1,
      };
    });
    return result;
  }, [setCollection]);

  const evolveCard = useCallback((cardId) => {
    setCollection(prev => {
      const masterCard = getCardById(cardId);
      if (!masterCard) return prev;
      const owned = prev.cards.find(c => c.cardId === cardId);
      if (!owned) return prev;
      if (owned.evolutionLevel >= 2) return prev;

      const { duplicatesRequired, dustRequired } = masterCard.evolutionCost;
      if ((owned.duplicateCount || 0) < duplicatesRequired) return prev;
      if (prev.dustAmount < dustRequired) return prev;

      return {
        ...prev,
        dustAmount: prev.dustAmount - dustRequired,
        cards: prev.cards.map(c =>
          c.cardId === cardId
            ? {
                ...c,
                evolutionLevel: c.evolutionLevel + 1,
                duplicateCount: (c.duplicateCount || 0) - duplicatesRequired,
              }
            : c
        ),
      };
    });
  }, [setCollection]);

  const getOwnedCard = useCallback((cardId) => {
    return collection.cards.find(c => c.cardId === cardId);
  }, [collection]);

  // Grant a card once if not already owned (no dust/duplicate logic). For starter heroes etc.
  const ensureCard = useCallback((cardId) => {
    setCollection(prev => {
      if (!getCardById(cardId)) return prev;
      if (prev.cards.find(c => c.cardId === cardId)) return prev;
      const newInstance = {
        instanceId: `${cardId}_${Date.now()}`,
        cardId, evolutionLevel: 0,
        obtainedDate: new Date().toISOString(),
        isDuplicate: false, duplicateCount: 0,
      };
      return { ...prev, cards: [...prev.cards, newInstance], totalCardsObtained: prev.totalCardsObtained + 1 };
    });
  }, [setCollection]);

  const canEvolve = useCallback((cardId) => {
    const masterCard = getCardById(cardId);
    if (!masterCard) return false;
    const owned = collection.cards.find(c => c.cardId === cardId);
    if (!owned) return false;
    if (owned.evolutionLevel >= 2) return false;
    const { duplicatesRequired, dustRequired } = masterCard.evolutionCost;
    return (owned.duplicateCount || 0) >= duplicatesRequired && collection.dustAmount >= dustRequired;
  }, [collection]);

  const getCardStats = useCallback((cardId, evolutionLevel) => {
    const masterCard = getCardById(cardId);
    if (!masterCard) return null;
    if (evolutionLevel === 0) return masterCard.baseStats;
    if (evolutionLevel === 1) return masterCard.evolvedStats;
    return masterCard.maxStats;
  }, []);

  const uniqueCardsOwned = collection.cards.length;

  return {
    collection,
    addCard,
    ensureCard,
    evolveCard,
    getOwnedCard,
    canEvolve,
    getCardStats,
    uniqueCardsOwned,
    dustAmount: collection.dustAmount,
  };
}
