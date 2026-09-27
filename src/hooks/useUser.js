import { useState, useCallback } from 'react';

const DEFAULT_PROFILE = {
  username: 'Scholar',
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalQuestionsAnswered: 0,
  correctAnswers: 0,
  streak: 0,
  lastLoginDate: '',
  chestsAvailable: { bronze: 2, silver: 0, gold: 0, legendary: 0 },
  moduleProgress: {
    reading:    { completed: 0, correct: 0, level: 1 },
    listening:  { completed: 0, correct: 0, level: 1 },
    vocabulary: { completed: 0, correct: 0, level: 1 },
    grammar:    { completed: 0, correct: 0, level: 1 },
  },
  achievements: [],
  bandScoreHistory: [],
  dailyQuestionsToday: 0,
  dailyLastReset: '',
  correctThisSession: 0,
  modulesCompletedToday: [],
};

function loadProfile() {
  try {
    const raw = localStorage.getItem('ieltsquest_profile');
    if (raw) return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_PROFILE };
}

function saveProfile(profile) {
  localStorage.setItem('ieltsquest_profile', JSON.stringify(profile));
}

export function useUser() {
  const [profile, setProfileState] = useState(() => {
    const p = loadProfile();
    // check daily login streak
    const today = new Date().toDateString();
    if (p.lastLoginDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const newStreak = p.lastLoginDate === yesterday.toDateString() ? p.streak + 1 : 1;
      const updated = {
        ...p,
        lastLoginDate: today,
        streak: newStreak,
        xp: p.xp + 20,
        dailyQuestionsToday: p.dailyLastReset === today ? p.dailyQuestionsToday : 0,
        dailyLastReset: today,
        modulesCompletedToday: p.dailyLastReset === today ? p.modulesCompletedToday : [],
      };
      saveProfile(updated);
      return updated;
    }
    return p;
  });

  const setProfile = useCallback((updater) => {
    setProfileState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveProfile(next);
      return next;
    });
  }, []);

  const addXP = useCallback((amount) => {
    setProfile(prev => {
      let xp = prev.xp + amount;
      let level = prev.level;
      let xpToNext = prev.xpToNext;
      let leveledUp = false;
      while (xp >= xpToNext) {
        xp -= xpToNext;
        level += 1;
        xpToNext = Math.floor(100 * Math.pow(1.15, level - 1));
        leveledUp = true;
      }
      return { ...prev, xp, level, xpToNext, _leveledUp: leveledUp };
    });
  }, [setProfile]);

  const recordAnswer = useCallback((correct) => {
    setProfile(prev => {
      const today = new Date().toDateString();
      const dailyCount = (prev.dailyLastReset === today ? prev.dailyQuestionsToday : 0) + 1;
      const totalCorrect = prev.correctAnswers + (correct ? 1 : 0);
      const newProfile = {
        ...prev,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        correctAnswers: totalCorrect,
        dailyQuestionsToday: dailyCount,
        dailyLastReset: today,
        correctThisSession: (prev.correctThisSession || 0) + (correct ? 1 : 0),
      };
      // update band score periodically
      if (newProfile.totalQuestionsAnswered % 10 === 0) {
        const acc = newProfile.correctAnswers / newProfile.totalQuestionsAnswered;
        const band = Math.round((4.0 + acc * 5.0) * 2) / 2;
        const lastBand = newProfile.bandScoreHistory.length > 0
          ? newProfile.bandScoreHistory[newProfile.bandScoreHistory.length - 1].score : 0;
        if (band !== lastBand) {
          newProfile.bandScoreHistory = [
            ...newProfile.bandScoreHistory,
            { date: new Date().toLocaleDateString(), score: band }
          ].slice(-20);
        }
      }
      return newProfile;
    });
  }, [setProfile]);

  const addChest = useCallback((type) => {
    setProfile(prev => ({
      ...prev,
      chestsAvailable: {
        ...prev.chestsAvailable,
        [type]: (prev.chestsAvailable[type] || 0) + 1,
      }
    }));
  }, [setProfile]);

  const useChest = useCallback((type) => {
    setProfile(prev => ({
      ...prev,
      chestsAvailable: {
        ...prev.chestsAvailable,
        [type]: Math.max(0, (prev.chestsAvailable[type] || 0) - 1),
      }
    }));
  }, [setProfile]);

  const completeModuleLevel = useCallback((module, correct, total) => {
    setProfile(prev => {
      const today = new Date().toDateString();
      const modProgress = { ...prev.moduleProgress };
      modProgress[module] = {
        completed: modProgress[module].completed + total,
        correct: modProgress[module].correct + correct,
        level: modProgress[module].level,
      };
      const modulesToday = prev.dailyLastReset === today
        ? [...(prev.modulesCompletedToday || [])]
        : [];
      if (!modulesToday.includes(module)) modulesToday.push(module);
      const newProfile = { ...prev, moduleProgress: modProgress, modulesCompletedToday: modulesToday };
      // advance module level
      if (correct / total >= 0.6) {
        newProfile.moduleProgress[module].level = Math.min(10, modProgress[module].level + 1);
      }
      return newProfile;
    });
  }, [setProfile]);

  const unlockAchievement = useCallback((id) => {
    setProfile(prev => {
      if (prev.achievements.includes(id)) return prev;
      return { ...prev, achievements: [...prev.achievements, id] };
    });
  }, [setProfile]);

  const getBandScore = useCallback(() => {
    if (profile.totalQuestionsAnswered === 0) return 4.0;
    const acc = profile.correctAnswers / profile.totalQuestionsAnswered;
    return Math.round((4.0 + acc * 5.0) * 2) / 2;
  }, [profile]);

  const getTotalChests = useCallback(() => {
    const c = profile.chestsAvailable;
    return (c.bronze || 0) + (c.silver || 0) + (c.gold || 0) + (c.legendary || 0);
  }, [profile]);

  return {
    profile,
    setProfile,
    addXP,
    recordAnswer,
    addChest,
    useChest,
    completeModuleLevel,
    unlockAchievement,
    getBandScore,
    getTotalChests,
  };
}
